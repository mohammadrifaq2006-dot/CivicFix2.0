# 🚀 CivicRoad
### *"See It. Understand It. Fix It."*
**Community Road Damage Intelligence & Municipal Maintenance Platform**

CivicRoad transforms fragmented, unstructured citizen road damage observations (potholes, cracks, surface erosion, drainage failures, missing infrastructure) into structured, prioritized, and trackable municipal maintenance operations.

Instead of being a basic passive complaint desk, CivicRoad automates the complete operational lifecycle:
$$\text{Capture} \longrightarrow \text{Locate} \longrightarrow \text{Detect} \longrightarrow \text{Understand} \longrightarrow \text{Prioritize} \longrightarrow \text{Assign} \longrightarrow \text{Repair} \longrightarrow \text{Verify}$$

---

## 🌟 Key Product Differentiators

### 1. AI Real vs. Fake Image Authenticity Check
Before dispatching municipal crews, our computer vision sensor analysis inspects camera sensor data to ensure the image is an authentic photograph and filters out AI-generated images or internet duplicates.

### 2. Multi-Perspective Incident Fusion
When multiple citizens photograph and report the same pothole from different angles, CivicRoad clusters identical coordinates, optical textures, and property damage into **one single verified incident ticket**, eliminating duplicate work orders and preserving community evidence.

### 3. Transparent Explainable Priority Engine (0–100 Score)
Never an opaque black box. CivicRoad dynamically computes an auditable mathematical priority score across 5 civic factors:
- **Damage Severity (+30 max)**: Deep cavity rupture (>8.2cm) with progressive sub-base collapse
- **Road Classification & Traffic (+20 max)**: Central arterial demo corridor with high daily transits
- **Community Reports & Duplicates (+15 max)**: Multi-citizen consensus
- **Proximity to Critical Facilities (+15 max)**: Near hospitals, schools, and transit centers
- **SLA Breach Aging (+20 max)**: Escalates automatically past deadline

### 4. Mechanized Pothole Repair Engineering Guide
A 4-phase technical engineering breakdown showing mechanized Jetpatcher pothole filling, emulsion tack coat spraying, drainage culvert stabilization, and 8-ton vibratory compaction reopening roads in 15 minutes.

### 5. Resolution & Community Verification
Interactive Before/After comparison of road damage alongside completed repairs. Closed-loop citizen feedback gates ticket sign-off:
- **YES — FIXED**: Community consensus confirms repair, contractor SLA bonus unlocked.
- **STILL DAMAGED**: Escalates for immediate municipal re-inspection and dispatch.

---

## 🏗 Architecture Overview

```
Frontend (React 18 + Vite + Tailwind CSS + Lucide Icons) : Port 5173
       │
       ▼ (REST & WebSocket / STOMP)
Backend (Java 21 + Spring Boot 3 + Spring Security + JPA) : Port 8080
   ├── Spring Security + BCrypt + JWT Auth
   ├── Explainable Priority Engine
   ├── Geospatial Duplicate Clustering Engine (Haversine 150m)
   ├── Road Health Index Calculator
   ├── Storage Service (JPG, PNG, WEBP, MP4)
   └── Resilient AI Circuit Breaker
        │
        ├──► MySQL 8.0 Database (civicroad_db) : Port 3306
        └──► Python AI Computer Vision Microservice : Port 5000
```

---

## 🚀 Quickstart & Running Locally

### Prerequisites
- **Node.js v18+**
- (Optional Full Stack: Java 21 LTS, Python 3.10+, MySQL 8.0)

### Run Frontend Prototype
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Run Full Stack (Optional)
1. **Python AI Microservice**:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python app.py
   ```
2. **Spring Boot Backend**:
   ```bash
   cd backend
   mvn clean package -DskipTests
   java -jar target/civicroad-backend-1.0.0.jar
   ```

---

## 📦 Pushing to GitHub (Step-by-Step)

```bash
# 1. Initialize git repository
git init

# 2. Add all clean project files (.gitignore excludes node_modules and builds)
git add .

# 3. Create initial commit
git commit -m "feat: CivicRoad initial release with AI vision, incident fusion, and repair guide"

# 4. Create a new repository on GitHub (e.g. 'civicroad')
# Then link your remote and push:
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

&copy; 2026 CivicRoad Engineering Team.
