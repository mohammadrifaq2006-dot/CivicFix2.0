# CivicRoad AI — Database Schema Documentation

## 1. Relational Entity Relationship (ER) Summary
The platform operates on a normalized MySQL 8.0 schema (`civicroad_db`) comprising 15 core entities:

```
USERS (id, email, password_hash, full_name, role)
 ├── CITIZEN_PROFILES (points, badge_level, reports_submitted, reports_resolved)
 ├── AUTHORITY_OFFICERS (department_id, badge_number, jurisdiction_area_id, active_cases)
 ├── ROAD_ISSUES (reference_code, status, severity, priority_score, latitude, longitude)
 │    ├── ISSUE_EVIDENCES (file_path, file_type, is_after_repair)
 │    ├── AI_ANALYSES (predicted_damage_type, confidence_percentage, model_source)
 │    ├── ISSUE_DUPLICATE_CANDIDATES (primary_id, duplicate_id, distance_meters)
 │    ├── REPAIR_RECORDS (materials_used, cost_estimate, inspection_notes)
 │    ├── CITIZEN_FEEDBACKS (feedback_type, rating, comments)
 │    └── ISSUE_STATUS_HISTORIES (old_status, new_status, notes)
 ├── NOTIFICATIONS (title, message, is_read)
 └── AUDIT_LOGS (action, entity_type, entity_id, details_json)
```

## 2. Key Constraints & Optimization Indexes
- `idx_user_email`: Unique B-Tree index on `users.email`.
- `idx_issue_coords`: Spatial lookup index on `(latitude, longitude)`.
- `idx_issue_status`: Composite index on `status` and `priority_score`.
- `fk_issue_parent`: Self-referencing foreign key on `road_issues.parent_issue_id` enabling duplicate evidence clustering.
- Cascade deletions configured appropriately for transient artifacts while preserving operational audit trails.
