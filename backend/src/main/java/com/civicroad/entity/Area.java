package com.civicroad.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "areas")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "road_health_index")
    private Integer roadHealthIndex = 75;

    @Column(name = "active_issues_count")
    private Integer activeIssuesCount = 0;

    public Area() {}

    public Area(String name, String city, String state, Integer roadHealthIndex) {
        this.name = name;
        this.city = city;
        this.state = state;
        this.roadHealthIndex = roadHealthIndex;
        this.activeIssuesCount = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Integer getRoadHealthIndex() { return roadHealthIndex; }
    public void setRoadHealthIndex(Integer roadHealthIndex) { this.roadHealthIndex = roadHealthIndex; }

    public Integer getActiveIssuesCount() { return activeIssuesCount; }
    public void setActiveIssuesCount(Integer activeIssuesCount) { this.activeIssuesCount = activeIssuesCount; }
}
