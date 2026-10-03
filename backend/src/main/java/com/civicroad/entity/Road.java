package com.civicroad.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roads")
public class Road {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @Column(name = "road_category", nullable = false, length = 50)
    private String roadCategory; // EXPRESSWAY, ARTERIAL, COLLECTOR, LOCAL

    @Column(name = "traffic_level", nullable = false, length = 50)
    private String trafficLevel; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(name = "road_health_score")
    private Integer roadHealthScore = 75;

    @Column(name = "total_issues_count")
    private Integer totalIssuesCount = 0;

    @Column(name = "open_issues_count")
    private Integer openIssuesCount = 0;

    public Road() {}

    public Road(String name, Area area, String roadCategory, String trafficLevel, Integer roadHealthScore) {
        this.name = name;
        this.area = area;
        this.roadCategory = roadCategory;
        this.trafficLevel = trafficLevel;
        this.roadHealthScore = roadHealthScore;
        this.totalIssuesCount = 0;
        this.openIssuesCount = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Area getArea() { return area; }
    public void setArea(Area area) { this.area = area; }

    public String getRoadCategory() { return roadCategory; }
    public void setRoadCategory(String roadCategory) { this.roadCategory = roadCategory; }

    public String getTrafficLevel() { return trafficLevel; }
    public void setTrafficLevel(String trafficLevel) { this.trafficLevel = trafficLevel; }

    public Integer getRoadHealthScore() { return roadHealthScore; }
    public void setRoadHealthScore(Integer roadHealthScore) { this.roadHealthScore = roadHealthScore; }

    public Integer getTotalIssuesCount() { return totalIssuesCount; }
    public void setTotalIssuesCount(Integer totalIssuesCount) { this.totalIssuesCount = totalIssuesCount; }

    public Integer getOpenIssuesCount() { return openIssuesCount; }
    public void setOpenIssuesCount(Integer openIssuesCount) { this.openIssuesCount = openIssuesCount; }
}
