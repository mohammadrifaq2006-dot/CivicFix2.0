package com.civicroad.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_duplicate_candidates")
public class IssueDuplicateCandidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_issue_id", nullable = false)
    private RoadIssue primaryIssue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "duplicate_issue_id", nullable = false)
    private RoadIssue duplicateIssue;

    @Column(name = "distance_meters")
    private Double distanceMeters;

    @Column(name = "similarity_score")
    private Double similarityScore;

    @Column(name = "is_merged")
    private Boolean isMerged = false;

    @Column(name = "merged_at")
    private LocalDateTime mergedAt;

    public IssueDuplicateCandidate() {}

    public IssueDuplicateCandidate(RoadIssue primaryIssue, RoadIssue duplicateIssue, Double distanceMeters, Double similarityScore) {
        this.primaryIssue = primaryIssue;
        this.duplicateIssue = duplicateIssue;
        this.distanceMeters = distanceMeters;
        this.similarityScore = similarityScore;
        this.isMerged = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoadIssue getPrimaryIssue() { return primaryIssue; }
    public void setPrimaryIssue(RoadIssue primaryIssue) { this.primaryIssue = primaryIssue; }

    public RoadIssue getDuplicateIssue() { return duplicateIssue; }
    public void setDuplicateIssue(RoadIssue duplicateIssue) { this.duplicateIssue = duplicateIssue; }

    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }

    public Double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }

    public Boolean getIsMerged() { return isMerged; }
    public void setIsMerged(Boolean isMerged) { this.isMerged = isMerged; }

    public LocalDateTime getMergedAt() { return mergedAt; }
    public void setMergedAt(LocalDateTime mergedAt) { this.mergedAt = mergedAt; }
}
