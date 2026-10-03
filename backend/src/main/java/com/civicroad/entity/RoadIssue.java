package com.civicroad.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "road_issues")
public class RoadIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_code", nullable = false, unique = true, length = 30)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id")
    private User citizen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "road_id")
    private Road road;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    @Column(name = "damage_type", nullable = false, length = 50)
    private String damageType; // POTHOLE, LONGITUDINAL_CRACK, etc.

    @Column(nullable = false, length = 30)
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "priority_score")
    private Integer priorityScore = 0;

    @Column(name = "priority_breakdown", columnDefinition = "TEXT")
    private String priorityBreakdown;

    @Column(nullable = false, length = 50)
    private String status = "REPORTED";

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 255)
    private String address;

    @Column(length = 150)
    private String landmark;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "urgency_rating", length = 30)
    private String urgencyRating = "MEDIUM";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_issue_id")
    private RoadIssue parentIssue;

    @Column(name = "duplicate_count")
    private Integer duplicateCount = 0;

    @Column(name = "sla_due_date")
    private LocalDateTime slaDueDate;

    @Column(name = "is_escalated")
    private Boolean isEscalated = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RoadIssue() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (status == null) status = "REPORTED";
        if (duplicateCount == null) duplicateCount = 0;
        if (isEscalated == null) isEscalated = false;
        if (priorityScore == null) priorityScore = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public Road getRoad() { return road; }
    public void setRoad(Road road) { this.road = road; }

    public Area getArea() { return area; }
    public void setArea(Area area) { this.area = area; }

    public String getDamageType() { return damageType; }
    public void setDamageType(String damageType) { this.damageType = damageType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Integer priorityScore) { this.priorityScore = priorityScore; }

    public String getPriorityBreakdown() { return priorityBreakdown; }
    public void setPriorityBreakdown(String priorityBreakdown) { this.priorityBreakdown = priorityBreakdown; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUrgencyRating() { return urgencyRating; }
    public void setUrgencyRating(String urgencyRating) { this.urgencyRating = urgencyRating; }

    public RoadIssue getParentIssue() { return parentIssue; }
    public void setParentIssue(RoadIssue parentIssue) { this.parentIssue = parentIssue; }

    public Integer getDuplicateCount() { return duplicateCount; }
    public void setDuplicateCount(Integer duplicateCount) { this.duplicateCount = duplicateCount; }

    public LocalDateTime getSlaDueDate() { return slaDueDate; }
    public void setSlaDueDate(LocalDateTime slaDueDate) { this.slaDueDate = slaDueDate; }

    public Boolean getIsEscalated() { return isEscalated; }
    public void setIsEscalated(Boolean isEscalated) { this.isEscalated = isEscalated; }

    public User getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(User assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
