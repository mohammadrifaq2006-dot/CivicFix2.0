package com.civicroad.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CitizenFeedbackRequest {

    @NotBlank(message = "Feedback type is required (FIXED, PARTIALLY_FIXED, NOT_FIXED)")
    private String feedbackType;

    private Integer rating = 5;
    private String comments;

    public CitizenFeedbackRequest() {}

    public String getFeedbackType() { return feedbackType; }
    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
