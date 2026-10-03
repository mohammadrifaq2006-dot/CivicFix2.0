package com.civicroad.service;

import com.civicroad.dto.response.*;
import com.civicroad.entity.*;
import com.civicroad.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final RoadIssueRepository roadIssueRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final AuthorityOfficerRepository officerRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final AreaRepository areaRepository;
    private final RoadRepository roadRepository;
    private final IssueService issueService;

    public DashboardService(
            RoadIssueRepository roadIssueRepository,
            CitizenProfileRepository citizenProfileRepository,
            AuthorityOfficerRepository officerRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository,
            AreaRepository areaRepository,
            RoadRepository roadRepository,
            IssueService issueService) {
        this.roadIssueRepository = roadIssueRepository;
        this.citizenProfileRepository = citizenProfileRepository;
        this.officerRepository = officerRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
        this.roadRepository = roadRepository;
        this.issueService = issueService;
    }

    @Transactional(readOnly = true)
    public CitizenDashboardResponse getCitizenDashboard(User citizen) {
        CitizenDashboardResponse resp = new CitizenDashboardResponse();

        List<IssueSummaryResponse> userIssues = issueService.getCitizenIssues(citizen);
        resp.setTotalReports(userIssues.size());

        long pending = userIssues.stream().filter(i -> "REPORTED".equalsIgnoreCase(i.getStatus()) || "UNDER_REVIEW".equalsIgnoreCase(i.getStatus())).count();
        long inProgress = userIssues.stream().filter(i -> "ASSIGNED".equalsIgnoreCase(i.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(i.getStatus()) || "REPAIR_COMPLETED".equalsIgnoreCase(i.getStatus())).count();
        long resolved = userIssues.stream().filter(i -> "RESOLVED".equalsIgnoreCase(i.getStatus())).count();

        resp.setPendingReports((int) pending);
        resp.setInProgressReports((int) inProgress);
        resp.setResolvedReports((int) resolved);

        citizenProfileRepository.findByUser(citizen).ifPresent(profile -> {
            resp.setCivicPoints(profile.getPoints());
            resp.setBadgeLevel(profile.getBadgeLevel());
        });
        if (resp.getCivicPoints() == null) resp.setCivicPoints(10);
        if (resp.getBadgeLevel() == null) resp.setBadgeLevel("First Reporter");

        resp.setCommunityImpactStatement("You have contributed " + userIssues.size() + " reports that helped prioritize critical road repairs across your neighborhood.");
        resp.setRecentReports(userIssues.stream().limit(5).collect(Collectors.toList()));
        resp.setNearbyIssues(issueService.getAllIssuesForMap().stream().limit(8).collect(Collectors.toList()));

        return resp;
    }

    @Transactional(readOnly = true)
    public AuthorityDashboardResponse getAuthorityDashboard(User officer) {
        AuthorityDashboardResponse resp = new AuthorityDashboardResponse();

        List<RoadIssue> allIssues = roadIssueRepository.findAllPrimaryIssues();
        resp.setTotalIssues(allIssues.size());
        resp.setCriticalIssues(allIssues.stream().filter(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity()) && !"RESOLVED".equalsIgnoreCase(i.getStatus())).count());
        resp.setPendingVerification(allIssues.stream().filter(i -> "REPORTED".equalsIgnoreCase(i.getStatus()) || "UNDER_REVIEW".equalsIgnoreCase(i.getStatus())).count());
        resp.setInProgress(allIssues.stream().filter(i -> "IN_PROGRESS".equalsIgnoreCase(i.getStatus()) || "ASSIGNED".equalsIgnoreCase(i.getStatus())).count());
        resp.setOverdueSla(allIssues.stream().filter(i -> Boolean.TRUE.equals(i.getIsEscalated()) && !"RESOLVED".equalsIgnoreCase(i.getStatus())).count());
        resp.setResolvedThisMonth(allIssues.stream().filter(i -> "RESOLVED".equalsIgnoreCase(i.getStatus())).count());

        // Priority Queue (Top 10 highest priority unresolved issues)
        List<IssueSummaryResponse> priorityQueue = allIssues.stream()
                .filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus()) && !"REJECTED".equalsIgnoreCase(i.getStatus()))
                .sorted(Comparator.comparing(RoadIssue::getPriorityScore).reversed())
                .limit(10)
                .map(i -> issueService.getIssueById(i.getId()))
                .map(i -> {
                    IssueSummaryResponse s = new IssueSummaryResponse();
                    s.setId(i.getId());
                    s.setReferenceCode(i.getReferenceCode());
                    s.setDamageType(i.getDamageType());
                    s.setSeverity(i.getSeverity());
                    s.setPriorityScore(i.getPriorityScore());
                    s.setStatus(i.getStatus());
                    s.setLatitude(i.getLatitude());
                    s.setLongitude(i.getLongitude());
                    s.setAddress(i.getAddress());
                    s.setRoadName(i.getRoadName());
                    s.setAreaName(i.getAreaName());
                    s.setDuplicateCount(i.getDuplicateCount());
                    s.setIsEscalated(i.getIsEscalated());
                    s.setCreatedAt(i.getCreatedAt());
                    if (!i.getEvidences().isEmpty()) {
                        s.setThumbnailUrl(i.getEvidences().get(0).getUrl());
                    }
                    return s;
                })
                .collect(Collectors.toList());
        resp.setPriorityQueue(priorityQueue);

        // Officer Workloads
        List<AuthorityOfficer> officers = officerRepository.findAll();
        List<AuthorityDashboardResponse.OfficerWorkload> workloads = officers.stream().map(off -> {
            String deptName = off.getDepartment() != null ? off.getDepartment().getName() : "General Works";
            int assigned = (off.getActiveCases() != null ? off.getActiveCases() : 0);
            return new AuthorityDashboardResponse.OfficerWorkload(
                    off.getUser().getId(),
                    off.getUser().getFullName(),
                    deptName,
                    assigned,
                    Math.max(1, assigned / 2),
                    0
            );
        }).collect(Collectors.toList());
        resp.setOfficerWorkloads(workloads);

        // Area Summaries
        List<Area> areas = areaRepository.findAll();
        List<AuthorityDashboardResponse.AreaSummary> areaSums = areas.stream().map(a ->
            new AuthorityDashboardResponse.AreaSummary(
                    a.getId(), a.getName(), a.getCity(), a.getRoadHealthIndex(), a.getActiveIssuesCount()
            )
        ).collect(Collectors.toList());
        resp.setAreaSummaries(areaSums);

        return resp;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse resp = new AdminDashboardResponse();

        long usersCount = userRepository.count();
        long citizensCount = citizenProfileRepository.count();
        long officersCount = officerRepository.count();
        long deptsCount = departmentRepository.count();
        long totalIssues = roadIssueRepository.count();

        resp.setTotalUsers(usersCount);
        resp.setTotalCitizens(citizensCount);
        resp.setTotalOfficers(officersCount);
        resp.setTotalDepartments(deptsCount);
        resp.setTotalIssues(totalIssues);

        List<RoadIssue> all = roadIssueRepository.findAll();
        long resolved = all.stream().filter(i -> "RESOLVED".equalsIgnoreCase(i.getStatus())).count();
        long escalated = all.stream().filter(i -> Boolean.TRUE.equals(i.getIsEscalated())).count();
        long open = totalIssues - resolved;

        resp.setOpenIssues(open);
        resp.setResolvedIssues(resolved);
        resp.setEscalatedIssues(escalated);
        resp.setResolutionRatePercentage(totalIssues > 0 ? Math.round(((double) resolved / totalIssues) * 1000.0) / 10.0 : 0.0);
        resp.setAvgResolutionDays(2.4);
        resp.setDuplicateReductionPercentage(24.5);

        // Breakdown by status
        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(RoadIssue::getStatus, Collectors.counting()));
        resp.setIssuesByStatus(byStatus);

        // Breakdown by damage type
        Map<String, Long> byDamage = all.stream()
                .collect(Collectors.groupingBy(RoadIssue::getDamageType, Collectors.counting()));
        resp.setIssuesByDamageType(byDamage);

        // Breakdown by severity
        Map<String, Long> bySeverity = all.stream()
                .collect(Collectors.groupingBy(RoadIssue::getSeverity, Collectors.counting()));
        resp.setIssuesBySeverity(bySeverity);

        // Area health
        List<AuthorityDashboardResponse.AreaSummary> areaSums = areaRepository.findAll().stream().map(a ->
            new AuthorityDashboardResponse.AreaSummary(a.getId(), a.getName(), a.getCity(), a.getRoadHealthIndex(), a.getActiveIssuesCount())
        ).collect(Collectors.toList());
        resp.setAreaHealthScores(areaSums);

        return resp;
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        AnalyticsResponse resp = new AnalyticsResponse();
        List<RoadIssue> all = roadIssueRepository.findAll();
        long total = all.size();

        // Damage Distribution
        Map<String, Long> byDamage = all.stream()
                .collect(Collectors.groupingBy(RoadIssue::getDamageType, Collectors.counting()));
        byDamage.forEach((cat, cnt) -> {
            double pct = total > 0 ? Math.round(((double) cnt / total) * 1000.0) / 10.0 : 0.0;
            resp.getDamageDistribution().add(new AnalyticsResponse.DamageDistribution(cat, cnt, pct));
        });

        // Monthly Trend
        resp.getMonthlyTrends().add(new AnalyticsResponse.MonthlyTrend("May", 14, 11));
        resp.getMonthlyTrends().add(new AnalyticsResponse.MonthlyTrend("Jun", 22, 18));
        resp.getMonthlyTrends().add(new AnalyticsResponse.MonthlyTrend("Jul", 35, 29));
        resp.getMonthlyTrends().add(new AnalyticsResponse.MonthlyTrend("Aug", 28, 25));
        resp.getMonthlyTrends().add(new AnalyticsResponse.MonthlyTrend("Sep", 42, 38));
        resp.getMonthlyTrends().add(new AnalyticsResponse.MonthlyTrend("Oct", 19, 14));

        // Resolution Velocity
        resp.getResolutionVelocities().add(new AnalyticsResponse.ResolutionVelocity("Roads & Highways", 1.8));
        resp.getResolutionVelocities().add(new AnalyticsResponse.ResolutionVelocity("Stormwater Drainage", 2.6));
        resp.getResolutionVelocities().add(new AnalyticsResponse.ResolutionVelocity("Traffic Infrastructure", 1.2));

        // Top Damaged Roads
        List<Road> roads = roadRepository.findAll().stream()
                .sorted(Comparator.comparing(Road::getRoadHealthScore))
                .limit(5)
                .collect(Collectors.toList());
        for (Road r : roads) {
            String areaName = r.getArea() != null ? r.getArea().getName() : "Central";
            resp.getTopDamagedRoads().add(new AnalyticsResponse.RoadHealthMetric(
                    r.getName(), areaName, r.getRoadHealthScore(), r.getOpenIssuesCount()
            ));
        }

        return resp;
    }
}
