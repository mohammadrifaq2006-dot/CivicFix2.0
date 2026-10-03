package com.civicroad.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "citizen_profiles")
public class CitizenProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer points = 0;

    @Column(name = "badge_level", length = 50)
    private String badgeLevel = "Novice Reporter";

    @Column(name = "reports_submitted")
    private Integer reportsSubmitted = 0;

    @Column(name = "reports_verified")
    private Integer reportsVerified = 0;

    @Column(name = "reports_resolved")
    private Integer reportsResolved = 0;

    public CitizenProfile() {}

    public CitizenProfile(User user) {
        this.user = user;
        this.points = 0;
        this.badgeLevel = "Novice Reporter";
        this.reportsSubmitted = 0;
        this.reportsVerified = 0;
        this.reportsResolved = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public String getBadgeLevel() { return badgeLevel; }
    public void setBadgeLevel(String badgeLevel) { this.badgeLevel = badgeLevel; }

    public Integer getReportsSubmitted() { return reportsSubmitted; }
    public void setReportsSubmitted(Integer reportsSubmitted) { this.reportsSubmitted = reportsSubmitted; }

    public Integer getReportsVerified() { return reportsVerified; }
    public void setReportsVerified(Integer reportsVerified) { this.reportsVerified = reportsVerified; }

    public Integer getReportsResolved() { return reportsResolved; }
    public void setReportsResolved(Integer reportsResolved) { this.reportsResolved = reportsResolved; }
}
