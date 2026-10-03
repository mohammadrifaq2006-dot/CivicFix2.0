package com.civicroad.dto.request;

import jakarta.validation.constraints.NotBlank;

public class IssueStatusUpdateRequest {

    @NotBlank(message = "New status is required")
    private String status;

    private String notes;

    public IssueStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
