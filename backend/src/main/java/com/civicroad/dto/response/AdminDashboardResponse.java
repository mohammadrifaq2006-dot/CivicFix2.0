package com.civicroad.dto.response;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdminDashboardResponse {
    private long totalUsers;
    private long totalCitizens;
    private long totalOfficers;
    private long totalDepartments;
    private long totalIssues;
    private long openIssues;
    private long resolvedIssues;
    private long escalatedIssues;
    private double resolutionRatePercentage;
    private double avgResolutionDays;
    private double duplicateReductionPercentage;

    private Map<String, Long> issuesByStatus = new HashMap<>();
    private Map<String, Long> issuesByDamageType = new HashMap<>();
    private Map<String, Long> issuesBySeverity = new HashMap<>();
    private List<AuthorityDashboardResponse.AreaSummary> areaHealthScores = new ArrayList<>();

    public AdminDashboardResponse() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalCitizens() { return totalCitizens; }
    public void setTotalCitizens(long totalCitizens) { this.totalCitizens = totalCitizens; }
    public long getTotalOfficers() { return totalOfficers; }
    public void setTotalOfficers(long totalOfficers) { this.totalOfficers = totalOfficers; }
    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }
    public long getTotalIssues() { return totalIssues; }
    public void setTotalIssues(long totalIssues) { this.totalIssues = totalIssues; }
    public long getOpenIssues() { return openIssues; }
    public void setOpenIssues(long openIssues) { this.openIssues = openIssues; }
    public long getResolvedIssues() { return resolvedIssues; }
    public void setResolvedIssues(long resolvedIssues) { this.resolvedIssues = resolvedIssues; }
    public long getEscalatedIssues() { return escalatedIssues; }
    public void setEscalatedIssues(long escalatedIssues) { this.escalatedIssues = escalatedIssues; }
    public double getResolutionRatePercentage() { return resolutionRatePercentage; }
    public void setResolutionRatePercentage(double resolutionRatePercentage) { this.resolutionRatePercentage = resolutionRatePercentage; }
    public double getAvgResolutionDays() { return avgResolutionDays; }
    public void setAvgResolutionDays(double avgResolutionDays) { this.avgResolutionDays = avgResolutionDays; }
    public double getDuplicateReductionPercentage() { return duplicateReductionPercentage; }
    public void setDuplicateReductionPercentage(double duplicateReductionPercentage) { this.duplicateReductionPercentage = duplicateReductionPercentage; }
    public Map<String, Long> getIssuesByStatus() { return issuesByStatus; }
    public void setIssuesByStatus(Map<String, Long> issuesByStatus) { this.issuesByStatus = issuesByStatus; }
    public Map<String, Long> getIssuesByDamageType() { return issuesByDamageType; }
    public void setIssuesByDamageType(Map<String, Long> issuesByDamageType) { this.issuesByDamageType = issuesByDamageType; }
    public Map<String, Long> getIssuesBySeverity() { return issuesBySeverity; }
    public void setIssuesBySeverity(Map<String, Long> issuesBySeverity) { this.issuesBySeverity = issuesBySeverity; }
    public List<AuthorityDashboardResponse.AreaSummary> getAreaHealthScores() { return areaHealthScores; }
    public void setAreaHealthScores(List<AuthorityDashboardResponse.AreaSummary> areaHealthScores) { this.areaHealthScores = areaHealthScores; }
}
