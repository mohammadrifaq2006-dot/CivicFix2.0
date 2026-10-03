package com.civicroad.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
public class AIAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false, unique = true)
    private RoadIssue issue;

    @Column(name = "predicted_damage_type", length = 50)
    private String predictedDamageType;

    @Column(name = "confidence_percentage")
    private Double confidencePercentage;

    @Column(name = "predicted_severity", length = 30)
    private String predictedSeverity;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "model_source", length = 50)
    private String modelSource = "COMPUTER_VISION_SERVICE";

    @Column(name = "is_overridden")
    private Boolean isOverridden = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "overridden_by_id")
    private User overriddenBy;

    @Column(name = "override_reason", columnDefinition = "TEXT")
    private String overrideReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AIAnalysis() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoadIssue getIssue() { return issue; }
    public void setIssue(RoadIssue issue) { this.issue = issue; }

    public String getPredictedDamageType() { return predictedDamageType; }
    public void setPredictedDamageType(String predictedDamageType) { this.predictedDamageType = predictedDamageType; }

    public Double getConfidencePercentage() { return confidencePercentage; }
    public void setConfidencePercentage(Double confidencePercentage) { this.confidencePercentage = confidencePercentage; }

    public String getPredictedSeverity() { return predictedSeverity; }
    public void setPredictedSeverity(String predictedSeverity) { this.predictedSeverity = predictedSeverity; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getModelSource() { return modelSource; }
    public void setModelSource(String modelSource) { this.modelSource = modelSource; }

    public Boolean getIsOverridden() { return isOverridden; }
    public void setIsOverridden(Boolean isOverridden) { this.isOverridden = isOverridden; }

    public User getOverriddenBy() { return overriddenBy; }
    public void setOverriddenBy(User overriddenBy) { this.overriddenBy = overriddenBy; }

    public String getOverrideReason() { return overrideReason; }
    public void setOverrideReason(String overrideReason) { this.overrideReason = overrideReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
