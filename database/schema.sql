-- ========================================================
-- CivicRoad AI - Database Schema (MySQL 8.0)
-- "See It. Report It. Fix It."
-- ========================================================

CREATE DATABASE IF NOT EXISTS civicroad_db;
USE civicroad_db;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
);

-- 2. Citizen Profiles
CREATE TABLE IF NOT EXISTS citizen_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    points INT DEFAULT 0,
    badge_level VARCHAR(50) DEFAULT 'Novice Reporter',
    reports_submitted INT DEFAULT 0,
    reports_verified INT DEFAULT 0,
    reports_resolved INT DEFAULT 0,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Departments
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    contact_email VARCHAR(150),
    description TEXT
);

-- 4. Areas (Jurisdictions)
CREATE TABLE IF NOT EXISTS areas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    road_health_index INT DEFAULT 75,
    active_issues_count INT DEFAULT 0
);

-- 5. Authority Officers
CREATE TABLE IF NOT EXISTS authority_officers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department_id BIGINT,
    badge_number VARCHAR(50),
    jurisdiction_area_id BIGINT,
    current_workload INT DEFAULT 0,
    active_cases INT DEFAULT 0,
    CONSTRAINT fk_officer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_officer_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_officer_area FOREIGN KEY (jurisdiction_area_id) REFERENCES areas(id) ON DELETE SET NULL
);

-- 6. Roads
CREATE TABLE IF NOT EXISTS roads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    area_id BIGINT NOT NULL,
    road_category VARCHAR(50) NOT NULL, -- EXPRESSWAY, ARTERIAL, COLLECTOR, LOCAL
    traffic_level VARCHAR(50) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    road_health_score INT DEFAULT 75,
    total_issues_count INT DEFAULT 0,
    open_issues_count INT DEFAULT 0,
    CONSTRAINT fk_road_area FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE,
    INDEX idx_road_area (area_id)
);

-- 7. Road Issues
CREATE TABLE IF NOT EXISTS road_issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_code VARCHAR(30) NOT NULL UNIQUE,
    citizen_id BIGINT,
    road_id BIGINT,
    area_id BIGINT,
    damage_type VARCHAR(50) NOT NULL,
    severity VARCHAR(30) NOT NULL,
    priority_score INT DEFAULT 0,
    priority_breakdown TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'REPORTED',
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    address VARCHAR(255),
    landmark VARCHAR(150),
    description TEXT,
    urgency_rating VARCHAR(30) DEFAULT 'MEDIUM',
    parent_issue_id BIGINT NULL,
    duplicate_count INT DEFAULT 0,
    sla_due_date TIMESTAMP NULL,
    is_escalated BOOLEAN DEFAULT FALSE,
    assigned_officer_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_issue_citizen FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_issue_road FOREIGN KEY (road_id) REFERENCES roads(id) ON DELETE SET NULL,
    CONSTRAINT fk_issue_area FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE SET NULL,
    CONSTRAINT fk_issue_parent FOREIGN KEY (parent_issue_id) REFERENCES road_issues(id) ON DELETE SET NULL,
    CONSTRAINT fk_issue_officer FOREIGN KEY (assigned_officer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_issue_status (status),
    INDEX idx_issue_severity (severity),
    INDEX idx_issue_priority (priority_score),
    INDEX idx_issue_coords (latitude, longitude),
    INDEX idx_issue_created (created_at)
);

-- 8. Issue Evidences (Images / Videos)
CREATE TABLE IF NOT EXISTS issue_evidences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    thumbnail_path VARCHAR(255),
    file_type VARCHAR(20) DEFAULT 'IMAGE',
    is_after_repair BOOLEAN DEFAULT FALSE,
    uploaded_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidence_issue FOREIGN KEY (issue_id) REFERENCES road_issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_evidence_user FOREIGN KEY (uploaded_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. AI Analyses
CREATE TABLE IF NOT EXISTS ai_analyses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL UNIQUE,
    predicted_damage_type VARCHAR(50),
    confidence_percentage DOUBLE,
    predicted_severity VARCHAR(30),
    explanation TEXT,
    model_source VARCHAR(50) DEFAULT 'COMPUTER_VISION_SERVICE',
    is_overridden BOOLEAN DEFAULT FALSE,
    overridden_by_id BIGINT NULL,
    override_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analysis_issue FOREIGN KEY (issue_id) REFERENCES road_issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_analysis_user FOREIGN KEY (overridden_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Duplicate Candidates
CREATE TABLE IF NOT EXISTS issue_duplicate_candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    primary_issue_id BIGINT NOT NULL,
    duplicate_issue_id BIGINT NOT NULL,
    distance_meters DOUBLE,
    similarity_score DOUBLE,
    is_merged BOOLEAN DEFAULT FALSE,
    merged_at TIMESTAMP NULL,
    CONSTRAINT fk_dup_primary FOREIGN KEY (primary_issue_id) REFERENCES road_issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_dup_secondary FOREIGN KEY (duplicate_issue_id) REFERENCES road_issues(id) ON DELETE CASCADE
);

-- 11. Repair Records
CREATE TABLE IF NOT EXISTS repair_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL UNIQUE,
    officer_id BIGINT NOT NULL,
    repair_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    materials_used TEXT,
    cost_estimate DOUBLE DEFAULT 0.0,
    inspection_notes TEXT,
    before_evidence_id BIGINT NULL,
    after_evidence_id BIGINT NULL,
    CONSTRAINT fk_repair_issue FOREIGN KEY (issue_id) REFERENCES road_issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_repair_officer FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 12. Citizen Feedbacks (Verification)
CREATE TABLE IF NOT EXISTS citizen_feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    citizen_id BIGINT NOT NULL,
    feedback_type VARCHAR(30) NOT NULL, -- FIXED, PARTIALLY_FIXED, NOT_FIXED
    rating INT DEFAULT 5,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_issue FOREIGN KEY (issue_id) REFERENCES road_issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_citizen FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. Status Histories
CREATE TABLE IF NOT EXISTS issue_status_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    actor_id BIGINT,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_issue FOREIGN KEY (issue_id) REFERENCES road_issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_history_issue (issue_id)
);

-- 14. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    issue_id BIGINT,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id, is_read)
);

-- 15. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_created (created_at)
);
