package com.civicroad.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class IssueResponse {
    private Long id;
    private String referenceCode;
    private Long citizenId;
    private String citizenName;
    private Long roadId;
    private String roadName;
    private String roadCategory;
    private Long areaId;
    private String areaName;
    private String city;
    private String damageType;
    private String severity;
    private Integer priorityScore;
    private String priorityBreakdown;
    private String status;
    private Double latitude;
    private Double longitude;
    private String address;
    private String landmark;
    private String description;
    private String urgencyRating;
    private Long parentIssueId;
    private Integer duplicateCount;
    private LocalDateTime slaDueDate;
    private Boolean isEscalated;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    private String departmentName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private AIAnalysisResponse aiAnalysis;
    private List<EvidenceItem> evidences = new ArrayList<>();
    private List<IssueSummaryResponse> fusedDuplicates = new ArrayList<>();
    private RepairDetails repairDetails;
    private List<FeedbackItem> feedbacks = new ArrayList<>();

    public IssueResponse() {}

    public static class EvidenceItem {
        private Long id;
        private String url;
        private String fileType;
        private Boolean isAfterRepair;

        public EvidenceItem() {}
        public EvidenceItem(Long id, String url, String fileType, Boolean isAfterRepair) {
            this.id = id;
            this.url = url;
            this.fileType = fileType;
            this.isAfterRepair = isAfterRepair;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
        public Boolean getIsAfterRepair() { return isAfterRepair; }
        public void setIsAfterRepair(Boolean isAfterRepair) { this.isAfterRepair = isAfterRepair; }
    }

    public static class RepairDetails {
        private Long id;
        private String officerName;
        private LocalDateTime repairDate;
        private String materialsUsed;
        private Double costEstimate;
        private String inspectionNotes;
        private String beforeImageUrl;
        private String afterImageUrl;

        public RepairDetails() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOfficerName() { return officerName; }
        public void setOfficerName(String officerName) { this.officerName = officerName; }
        public LocalDateTime getRepairDate() { return repairDate; }
        public void setRepairDate(LocalDateTime repairDate) { this.repairDate = repairDate; }
        public String getMaterialsUsed() { return materialsUsed; }
        public void setMaterialsUsed(String materialsUsed) { this.materialsUsed = materialsUsed; }
        public Double getCostEstimate() { return costEstimate; }
        public void setCostEstimate(Double costEstimate) { this.costEstimate = costEstimate; }
        public String getInspectionNotes() { return inspectionNotes; }
        public void setInspectionNotes(String inspectionNotes) { this.inspectionNotes = inspectionNotes; }
        public String getBeforeImageUrl() { return beforeImageUrl; }
        public void setBeforeImageUrl(String beforeImageUrl) { this.beforeImageUrl = beforeImageUrl; }
        public String getAfterImageUrl() { return afterImageUrl; }
        public void setAfterImageUrl(String afterImageUrl) { this.afterImageUrl = afterImageUrl; }
    }

    public static class FeedbackItem {
        private String citizenName;
        private String feedbackType;
        private Integer rating;
        private String comments;
        private LocalDateTime createdAt;

        public FeedbackItem() {}
        public FeedbackItem(String citizenName, String feedbackType, Integer rating, String comments, LocalDateTime createdAt) {
            this.citizenName = citizenName;
            this.feedbackType = feedbackType;
            this.rating = rating;
            this.comments = comments;
            this.createdAt = createdAt;
        }

        public String getCitizenName() { return citizenName; }
        public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
        public String getFeedbackType() { return feedbackType; }
        public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }
    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public Long getRoadId() { return roadId; }
    public void setRoadId(Long roadId) { this.roadId = roadId; }
    public String getRoadName() { return roadName; }
    public void setRoadName(String roadName) { this.roadName = roadName; }
    public String getRoadCategory() { return roadCategory; }
    public void setRoadCategory(String roadCategory) { this.roadCategory = roadCategory; }
    public Long getAreaId() { return areaId; }
    public void setAreaId(Long areaId) { this.areaId = areaId; }
    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
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
    public Long getParentIssueId() { return parentIssueId; }
    public void setParentIssueId(Long parentIssueId) { this.parentIssueId = parentIssueId; }
    public Integer getDuplicateCount() { return duplicateCount; }
    public void setDuplicateCount(Integer duplicateCount) { this.duplicateCount = duplicateCount; }
    public LocalDateTime getSlaDueDate() { return slaDueDate; }
    public void setSlaDueDate(LocalDateTime slaDueDate) { this.slaDueDate = slaDueDate; }
    public Boolean getIsEscalated() { return isEscalated; }
    public void setIsEscalated(Boolean isEscalated) { this.isEscalated = isEscalated; }
    public Long getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }
    public String getAssignedOfficerName() { return assignedOfficerName; }
    public void setAssignedOfficerName(String assignedOfficerName) { this.assignedOfficerName = assignedOfficerName; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public AIAnalysisResponse getAiAnalysis() { return aiAnalysis; }
    public void setAiAnalysis(AIAnalysisResponse aiAnalysis) { this.aiAnalysis = aiAnalysis; }
    public List<EvidenceItem> getEvidences() { return evidences; }
    public void setEvidences(List<EvidenceItem> evidences) { this.evidences = evidences; }
    public List<IssueSummaryResponse> getFusedDuplicates() { return fusedDuplicates; }
    public void setFusedDuplicates(List<IssueSummaryResponse> fusedDuplicates) { this.fusedDuplicates = fusedDuplicates; }
    public RepairDetails getRepairDetails() { return repairDetails; }
    public void setRepairDetails(RepairDetails repairDetails) { this.repairDetails = repairDetails; }
    public List<FeedbackItem> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<FeedbackItem> feedbacks) { this.feedbacks = feedbacks; }
}
