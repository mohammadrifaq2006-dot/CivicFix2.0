# CivicRoad AI — Technical Architecture Documentation

## 1. Architectural Philosophy
CivicRoad AI is architected as an event-ready, microservice-hybrid platform:
1. **Presentation Layer**: Single Page Application built on React 18, Tailwind CSS, Lucide icons, and Leaflet geospatial rendering.
2. **Business & Transactional Core**: Java 21 / Spring Boot 3 enterprise backend providing REST APIs, Spring Security RBAC, WebSocket STOMP messaging, and relational JPA persistence.
3. **AI Vision Microservice**: Independent Python service providing computer vision feature extraction and damage classification.
4. **Data Persistence**: MySQL 8.0 normalized schema with ACID transaction isolation.

```
       [ Citizen / Officer / Admin Browser ]
                        │
                        ▼ (HTTP & WebSocket)
           [ React 18 / Tailwind Client ]
                        │
                        ▼ (Reverse Proxy /api)
         [ Spring Boot 3 Application Core ]
          ├── Security (JWT + BCrypt)
          ├── Priority Engine (0-100)
          ├── Duplicate Clustering (150m Haversine)
          ├── Road Health Index Engine
          └── Storage Service
            │                       │
            ▼ (REST)                ▼ (JDBC)
  [ Python AI Microservice ]   [ MySQL 8.0 Database ]
```

---

## 2. Component Details

### 2.1 Explainable Priority Engine (`PriorityEngineService`)
Calculates a normalized score (0–100) combining:
- Damage Severity ($0 - 30$ pts)
- Road Classification & Traffic Exposure ($0 - 20$ pts)
- Community Duplicate Frequency ($0 - 15$ pts)
- Critical Zone Proximity (Hospital, School, Transit) ($0 - 15$ pts)
- SLA Aging Penalty ($0 - 20$ pts)

### 2.2 Geospatial Duplicate Detection (`DuplicateDetectionService`)
Uses the great-circle Haversine formula:
$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
Any report within 150 meters is evaluated against category similarity. When matched, it links under the primary case without fragmenting work orders.

### 2.3 Resilient AI Integration (`AIAnalysisService`)
Utilizes a circuit breaker with timeout. If the Python AI service is responsive, it integrates the CV model predictions. If unreachable, it executes a transparent local rule-based fallback labeled as `DEMO_FALLBACK_ANALYZER`.

### 2.4 Real-Time WebSockets (`WebSocketConfig` & `NotificationService`)
Configures a STOMP broker at `/ws` broadcasting:
- User-specific notifications: `/topic/notifications/{userId}`
- Operational dashboard events: `/topic/issues`
