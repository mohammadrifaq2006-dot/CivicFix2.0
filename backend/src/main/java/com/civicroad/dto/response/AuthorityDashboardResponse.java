package com.civicroad.dto.response;

import java.util.ArrayList;
import java.util.List;

public class AuthorityDashboardResponse {
    private long totalIssues;
    private long criticalIssues;
    private long pendingVerification;
    private long inProgress;
    private long overdueSla;
    private long resolvedThisMonth;

    private List<IssueSummaryResponse> priorityQueue = new ArrayList<>();
    private List<OfficerWorkload> officerWorkloads = new ArrayList<>();
    private List<AreaSummary> areaSummaries = new ArrayList<>();

    public AuthorityDashboardResponse() {}

    public static class OfficerWorkload {
        private Long officerId;
        private String officerName;
        private String departmentName;
        private Integer assignedCases;
        private Integer inProgressCases;
        private Integer overdueCases;

        public OfficerWorkload() {}
        public OfficerWorkload(Long officerId, String officerName, String departmentName, Integer assignedCases, Integer inProgressCases, Integer overdueCases) {
            this.officerId = officerId;
            this.officerName = officerName;
            this.departmentName = departmentName;
            this.assignedCases = assignedCases;
            this.inProgressCases = inProgressCases;
            this.overdueCases = overdueCases;
        }

        public Long getOfficerId() { return officerId; }
        public void setOfficerId(Long officerId) { this.officerId = officerId; }
        public String getOfficerName() { return officerName; }
        public void setOfficerName(String officerName) { this.officerName = officerName; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public Integer getAssignedCases() { return assignedCases; }
        public void setAssignedCases(Integer assignedCases) { this.assignedCases = assignedCases; }
        public Integer getInProgressCases() { return inProgressCases; }
        public void setInProgressCases(Integer inProgressCases) { this.inProgressCases = inProgressCases; }
        public Integer getOverdueCases() { return overdueCases; }
        public void setOverdueCases(Integer overdueCases) { this.overdueCases = overdueCases; }
    }

    public static class AreaSummary {
        private Long areaId;
        private String areaName;
        private String city;
        private Integer roadHealthIndex;
        private Integer activeIssues;

        public AreaSummary() {}
        public AreaSummary(Long areaId, String areaName, String city, Integer roadHealthIndex, Integer activeIssues) {
            this.areaId = areaId;
            this.areaName = areaName;
            this.city = city;
            this.roadHealthIndex = roadHealthIndex;
            this.activeIssues = activeIssues;
        }

        public Long getAreaId() { return areaId; }
        public void setAreaId(Long areaId) { this.areaId = areaId; }
        public String getAreaName() { return areaName; }
        public void setAreaName(String areaName) { this.areaName = areaName; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public Integer getRoadHealthIndex() { return roadHealthIndex; }
        public void setRoadHealthIndex(Integer roadHealthIndex) { this.roadHealthIndex = roadHealthIndex; }
        public Integer getActiveIssues() { return activeIssues; }
        public void setActiveIssues(Integer activeIssues) { this.activeIssues = activeIssues; }
    }

    public long getTotalIssues() { return totalIssues; }
    public void setTotalIssues(long totalIssues) { this.totalIssues = totalIssues; }
    public long getCriticalIssues() { return criticalIssues; }
    public void setCriticalIssues(long criticalIssues) { this.criticalIssues = criticalIssues; }
    public long getPendingVerification() { return pendingVerification; }
    public void setPendingVerification(long pendingVerification) { this.pendingVerification = pendingVerification; }
    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }
    public long getOverdueSla() { return overdueSla; }
    public void setOverdueSla(long overdueSla) { this.overdueSla = overdueSla; }
    public long getResolvedThisMonth() { return resolvedThisMonth; }
    public void setResolvedThisMonth(long resolvedThisMonth) { this.resolvedThisMonth = resolvedThisMonth; }
    public List<IssueSummaryResponse> getPriorityQueue() { return priorityQueue; }
    public void setPriorityQueue(List<IssueSummaryResponse> priorityQueue) { this.priorityQueue = priorityQueue; }
    public List<OfficerWorkload> getOfficerWorkloads() { return officerWorkloads; }
    public void setOfficerWorkloads(List<OfficerWorkload> officerWorkloads) { this.officerWorkloads = officerWorkloads; }
    public List<AreaSummary> getAreaSummaries() { return areaSummaries; }
    public void setAreaSummaries(List<AreaSummary> areaSummaries) { this.areaSummaries = areaSummaries; }
}
