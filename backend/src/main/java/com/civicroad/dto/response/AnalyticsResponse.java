package com.civicroad.dto.response;

import java.util.ArrayList;
import java.util.List;

public class AnalyticsResponse {
    private List<DamageDistribution> damageDistribution = new ArrayList<>();
    private List<MonthlyTrend> monthlyTrends = new ArrayList<>();
    private List<ResolutionVelocity> resolutionVelocities = new ArrayList<>();
    private List<RoadHealthMetric> topDamagedRoads = new ArrayList<>();

    public AnalyticsResponse() {}

    public static class DamageDistribution {
        private String category;
        private long count;
        private double percentage;

        public DamageDistribution() {}
        public DamageDistribution(String category, long count, double percentage) {
            this.category = category;
            this.count = count;
            this.percentage = percentage;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    public static class MonthlyTrend {
        private String month;
        private long reported;
        private long resolved;

        public MonthlyTrend() {}
        public MonthlyTrend(String month, long reported, long resolved) {
            this.month = month;
            this.reported = reported;
            this.resolved = resolved;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public long getReported() { return reported; }
        public void setReported(long reported) { this.reported = reported; }
        public long getResolved() { return resolved; }
        public void setResolved(long resolved) { this.resolved = resolved; }
    }

    public static class ResolutionVelocity {
        private String department;
        private double avgDays;

        public ResolutionVelocity() {}
        public ResolutionVelocity(String department, double avgDays) {
            this.department = department;
            this.avgDays = avgDays;
        }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public double getAvgDays() { return avgDays; }
        public void setAvgDays(double avgDays) { this.avgDays = avgDays; }
    }

    public static class RoadHealthMetric {
        private String roadName;
        private String areaName;
        private Integer healthScore;
        private Integer openIssues;

        public RoadHealthMetric() {}
        public RoadHealthMetric(String roadName, String areaName, Integer healthScore, Integer openIssues) {
            this.roadName = roadName;
            this.areaName = areaName;
            this.healthScore = healthScore;
            this.openIssues = openIssues;
        }

        public String getRoadName() { return roadName; }
        public void setRoadName(String roadName) { this.roadName = roadName; }
        public String getAreaName() { return areaName; }
        public void setAreaName(String areaName) { this.areaName = areaName; }
        public Integer getHealthScore() { return healthScore; }
        public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }
        public Integer getOpenIssues() { return openIssues; }
        public void setOpenIssues(Integer openIssues) { this.openIssues = openIssues; }
    }

    public List<DamageDistribution> getDamageDistribution() { return damageDistribution; }
    public void setDamageDistribution(List<DamageDistribution> damageDistribution) { this.damageDistribution = damageDistribution; }
    public List<MonthlyTrend> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrend> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
    public List<ResolutionVelocity> getResolutionVelocities() { return resolutionVelocities; }
    public void setResolutionVelocities(List<ResolutionVelocity> resolutionVelocities) { this.resolutionVelocities = resolutionVelocities; }
    public List<RoadHealthMetric> getTopDamagedRoads() { return topDamagedRoads; }
    public void setTopDamagedRoads(List<RoadHealthMetric> topDamagedRoads) { this.topDamagedRoads = topDamagedRoads; }
}
