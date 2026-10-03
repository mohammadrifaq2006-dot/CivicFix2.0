package com.civicroad.dto.response;

import java.util.ArrayList;
import java.util.List;

public class CitizenDashboardResponse {
    private Integer totalReports;
    private Integer pendingReports;
    private Integer inProgressReports;
    private Integer resolvedReports;
    private Integer civicPoints;
    private String badgeLevel;
    private String communityImpactStatement;
    private List<IssueSummaryResponse> recentReports = new ArrayList<>();
    private List<IssueSummaryResponse> nearbyIssues = new ArrayList<>();

    public CitizenDashboardResponse() {}

    public Integer getTotalReports() { return totalReports; }
    public void setTotalReports(Integer totalReports) { this.totalReports = totalReports; }
    public Integer getPendingReports() { return pendingReports; }
    public void setPendingReports(Integer pendingReports) { this.pendingReports = pendingReports; }
    public Integer getInProgressReports() { return inProgressReports; }
    public void setInProgressReports(Integer inProgressReports) { this.inProgressReports = inProgressReports; }
    public Integer getResolvedReports() { return resolvedReports; }
    public void setResolvedReports(Integer resolvedReports) { this.resolvedReports = resolvedReports; }
    public Integer getCivicPoints() { return civicPoints; }
    public void setCivicPoints(Integer civicPoints) { this.civicPoints = civicPoints; }
    public String getBadgeLevel() { return badgeLevel; }
    public void setBadgeLevel(String badgeLevel) { this.badgeLevel = badgeLevel; }
    public String getCommunityImpactStatement() { return communityImpactStatement; }
    public void setCommunityImpactStatement(String communityImpactStatement) { this.communityImpactStatement = communityImpactStatement; }
    public List<IssueSummaryResponse> getRecentReports() { return recentReports; }
    public void setRecentReports(List<IssueSummaryResponse> recentReports) { this.recentReports = recentReports; }
    public List<IssueSummaryResponse> getNearbyIssues() { return nearbyIssues; }
    public void setNearbyIssues(List<IssueSummaryResponse> nearbyIssues) { this.nearbyIssues = nearbyIssues; }
}
