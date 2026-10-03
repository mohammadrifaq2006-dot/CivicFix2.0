package com.civicroad.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "citizen_feedbacks")
public class CitizenFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private RoadIssue issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @Column(name = "feedback_type", nullable = false, length = 30)
    private String feedbackType; // FIXED, PARTIALLY_FIXED, NOT_FIXED

    private Integer rating = 5;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CitizenFeedback() {}

    public CitizenFeedback(RoadIssue issue, User citizen, String feedbackType, Integer rating, String comments) {
        this.issue = issue;
        this.citizen = citizen;
        this.feedbackType = feedbackType;
        this.rating = rating != null ? rating : 5;
        this.comments = comments;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoadIssue getIssue() { return issue; }
    public void setIssue(RoadIssue issue) { this.issue = issue; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public String getFeedbackType() { return feedbackType; }
    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
