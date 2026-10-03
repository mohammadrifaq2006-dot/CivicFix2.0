package com.civicroad.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "authority_officers")
public class AuthorityOfficer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "badge_number", length = 50)
    private String badgeNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jurisdiction_area_id")
    private Area jurisdictionArea;

    @Column(name = "current_workload")
    private Integer currentWorkload = 0;

    @Column(name = "active_cases")
    private Integer activeCases = 0;

    public AuthorityOfficer() {}

    public AuthorityOfficer(User user, Department department, String badgeNumber, Area jurisdictionArea) {
        this.user = user;
        this.department = department;
        this.badgeNumber = badgeNumber;
        this.jurisdictionArea = jurisdictionArea;
        this.currentWorkload = 0;
        this.activeCases = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public Area getJurisdictionArea() { return jurisdictionArea; }
    public void setJurisdictionArea(Area jurisdictionArea) { this.jurisdictionArea = jurisdictionArea; }

    public Integer getCurrentWorkload() { return currentWorkload; }
    public void setCurrentWorkload(Integer currentWorkload) { this.currentWorkload = currentWorkload; }

    public Integer getActiveCases() { return activeCases; }
    public void setActiveCases(Integer activeCases) { this.activeCases = activeCases; }
}
