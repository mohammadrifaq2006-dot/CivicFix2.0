package com.civicroad.service;

import com.civicroad.entity.Area;
import com.civicroad.entity.Road;
import com.civicroad.entity.RoadIssue;
import com.civicroad.repository.AreaRepository;
import com.civicroad.repository.RoadIssueRepository;
import com.civicroad.repository.RoadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoadHealthService {

    private final RoadRepository roadRepository;
    private final AreaRepository areaRepository;
    private final RoadIssueRepository roadIssueRepository;

    public RoadHealthService(
            RoadRepository roadRepository,
            AreaRepository areaRepository,
            RoadIssueRepository roadIssueRepository) {
        this.roadRepository = roadRepository;
        this.areaRepository = areaRepository;
        this.roadIssueRepository = roadIssueRepository;
    }

    @Transactional
    public void recalculateRoadHealth(Road road) {
        if (road == null) return;

        List<RoadIssue> issues = roadIssueRepository.findByRoad(road);
        int total = issues.size();
        long open = issues.stream()
                .filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus()) && !"REJECTED".equalsIgnoreCase(i.getStatus()))
                .count();

        long critical = issues.stream()
                .filter(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity()) && !"RESOLVED".equalsIgnoreCase(i.getStatus()))
                .count();

        long high = issues.stream()
                .filter(i -> "HIGH".equalsIgnoreCase(i.getSeverity()) && !"RESOLVED".equalsIgnoreCase(i.getStatus()))
                .count();

        // Base score = 100
        // Deduct 15 for each unresolved critical, 8 for each high, 3 for other open issues
        int penalty = (int) ((critical * 15) + (high * 8) + (open * 3));
        int calculatedHealth = Math.max(15, Math.min(100, 100 - penalty));

        road.setTotalIssuesCount(total);
        road.setOpenIssuesCount((int) open);
        road.setRoadHealthScore(calculatedHealth);
        roadRepository.save(road);

        if (road.getArea() != null) {
            recalculateAreaHealth(road.getArea());
        }
    }

    @Transactional
    public void recalculateAreaHealth(Area area) {
        if (area == null) return;

        List<Road> roads = roadRepository.findByArea(area);
        if (roads.isEmpty()) {
            area.setRoadHealthIndex(85);
            area.setActiveIssuesCount(0);
        } else {
            int totalScore = 0;
            int totalOpen = 0;
            for (Road r : roads) {
                totalScore += (r.getRoadHealthScore() != null ? r.getRoadHealthScore() : 75);
                totalOpen += (r.getOpenIssuesCount() != null ? r.getOpenIssuesCount() : 0);
            }
            area.setRoadHealthIndex(Math.max(10, totalScore / roads.size()));
            area.setActiveIssuesCount(totalOpen);
        }
        areaRepository.save(area);
    }
}
