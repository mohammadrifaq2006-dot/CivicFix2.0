# CivicRoad AI — REST API Reference

Swagger UI is interactively available at: **`http://localhost:8080/swagger-ui.html`**

---

## 1. Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register`: Creates Citizen or Officer account.
- `POST /api/auth/login`: Validates credentials and returns JWT bearer token.
- `GET /api/auth/me`: Returns profile of the current authenticated user.

---

## 2. Road Damage Issues (`/api/issues`)
- `POST /api/issues` *(multipart/form-data)*: Submit new road defect with GPS and photos.
- `POST /api/issues/analyze-preview`: Run real-time AI damage inference before submission.
- `GET /api/issues`: Query paginated issues with filter parameters (`status`, `severity`, `damageType`, `areaId`, `search`).
- `GET /api/issues/map`: Get lightweight pin payloads for interactive map rendering.
- `GET /api/issues/{id}`: Detailed issue inspection (includes duplicate clusters and repair records).
- `GET /api/issues/ref/{code}`: Track report by reference code (e.g. `CR-2026-000001`).

---

## 3. Citizen Portal (`/api/citizen`)
*(Requires `ROLE_CITIZEN` or `ROLE_ADMIN`)*
- `GET /api/citizen/dashboard`: Personal statistics, points, and badge milestone.
- `GET /api/citizen/my-reports`: List of issues submitted by user.
- `POST /api/citizen/issues/{id}/feedback`: Submit satisfaction confirmation (`FIXED`, `PARTIALLY_FIXED`, `NOT_FIXED`).

---

## 4. Municipal Authority Operations (`/api/authority`)
*(Requires `ROLE_OFFICER` or `ROLE_ADMIN`)*
- `GET /api/authority/dashboard`: KPIs, Priority Queue, and Officer Workload metrics.
- `GET /api/authority/issues`: Issues assigned to the current officer.
- `POST /api/authority/issues/{id}/assign`: Assign crew to issue.
- `PUT /api/authority/issues/{id}/status`: State machine transition (`UNDER_REVIEW`, `VERIFIED`, `IN_PROGRESS`, etc.).
- `POST /api/authority/issues/{id}/repair` *(multipart)*: Upload after-repair photograph, materials, and cost estimate.
- `POST /api/authority/issues/{id}/override`: Apply human-in-the-loop AI override with audit reasoning.
- `POST /api/authority/issues/merge`: Manually merge duplicate candidate into primary case.

---

## 5. Executive Administration (`/api/admin`)
*(Requires `ROLE_ADMIN`)*
- `GET /api/admin/dashboard`: Platform-wide resolution KPIs and metrics.
- `GET /api/admin/analytics`: Visual analytics dataset (damage distribution, monthly trends, department velocity).
- `GET /api/admin/users`: User management table.
- `GET /api/admin/officers`: Maintenance officers list.
- `GET /api/admin/audit-logs`: System compliance and activity log.
