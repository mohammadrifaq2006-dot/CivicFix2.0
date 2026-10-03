package com.civicroad;

import com.civicroad.entity.Area;
import com.civicroad.entity.Road;
import com.civicroad.service.PriorityEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class PriorityEngineServiceTest {

    private PriorityEngineService priorityEngine;

    @BeforeEach
    public void setup() {
        priorityEngine = new PriorityEngineService();
    }

    @Test
    public void testCriticalSeverityWithHospitalProximityYieldsHighPriority() {
        Area area = new Area("Central Zone", "Hyderabad", "Telangana", 70);
        Road road = new Road("MG Road", area, "EXPRESSWAY", "CRITICAL", 60);

        PriorityEngineService.PriorityResult result = priorityEngine.calculatePriority(
                "POTHOLE",
                "CRITICAL",
                road,
                "Near Gandhi Hospital Gate 1",
                3, // 3 duplicates
                LocalDateTime.now(),
                "REPORTED"
        );

        // 30 (CRITICAL) + 20 (EXPRESSWAY) + 9 (3 dups) + 15 (Hospital) = 74+
        assertTrue(result.getScore() >= 74, "Score should be >= 74, got: " + result.getScore());
        assertTrue(result.getBreakdownJson().contains("Hospital"), "Breakdown should include hospital proximity");
        assertTrue(result.getBreakdownJson().contains("Damage Severity"), "Breakdown should include damage severity");
    }

    @Test
    public void testLowSeverityLocalRoadYieldsLowPriority() {
        Area area = new Area("Suburban Zone", "Hyderabad", "Telangana", 85);
        Road road = new Road("Quiet Residential Lane", area, "LOCAL", "LOW", 90);

        PriorityEngineService.PriorityResult result = priorityEngine.calculatePriority(
                "EDGE_DAMAGE",
                "LOW",
                road,
                "Near street lamp 4",
                0,
                LocalDateTime.now(),
                "REPORTED"
        );

        // 6 (LOW) + 6 (LOCAL) + 0 + 0 = 12
        assertTrue(result.getScore() <= 25, "Score should be LOW (<= 25), got: " + result.getScore());
        assertEquals("LOW", result.getSeverity());
    }

    @Test
    public void testOverdueSlaTriggersEscalation() {
        Area area = new Area("Central Zone", "Hyderabad", "Telangana", 70);
        Road road = new Road("Highway 1", area, "ARTERIAL", "HIGH", 60);

        // 3 days ago for a CRITICAL issue (24h SLA)
        LocalDateTime createdThreeDaysAgo = LocalDateTime.now().minusHours(72);

        PriorityEngineService.PriorityResult result = priorityEngine.calculatePriority(
                "POTHOLE",
                "CRITICAL",
                road,
                "Bus Stand",
                1,
                createdThreeDaysAgo,
                "REPORTED"
        );

        assertTrue(result.isEscalated(), "Issue past SLA should be flagged as escalated");
        assertTrue(result.getBreakdownJson().contains("SLA Overdue Aging"), "Should add aging penalty points");
    }
}
