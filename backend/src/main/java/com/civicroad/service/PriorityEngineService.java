package com.civicroad.service;

import com.civicroad.entity.Road;
import com.civicroad.entity.RoadIssue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PriorityEngineService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static class PriorityResult {
        private final int score;
        private final String severity;
        private final String breakdownJson;
        private final LocalDateTime slaDueDate;
        private final boolean isEscalated;

        public PriorityResult(int score, String severity, String breakdownJson, LocalDateTime slaDueDate, boolean isEscalated) {
            this.score = score;
            this.severity = severity;
            this.breakdownJson = breakdownJson;
            this.slaDueDate = slaDueDate;
            this.isEscalated = isEscalated;
        }

        public int getScore() { return score; }
        public String getSeverity() { return severity; }
        public String getBreakdownJson() { return breakdownJson; }
        public LocalDateTime getSlaDueDate() { return slaDueDate; }
        public boolean isEscalated() { return isEscalated; }
    }

    public PriorityResult calculatePriority(
            String damageType,
            String baseSeverity,
            Road road,
            String landmark,
            int duplicateCount,
            LocalDateTime createdAt,
            String currentStatus) {

        Map<String, Object> breakdown = new LinkedHashMap<>();
        int totalScore = 0;

        // 1. Damage Severity Component (Max 30 pts)
        String severity = (baseSeverity != null ? baseSeverity.toUpperCase() : "MEDIUM");
        int severityPoints;
        switch (severity) {
            case "CRITICAL":
                severityPoints = 30;
                break;
            case "HIGH":
                severityPoints = 22;
                break;
            case "MEDIUM":
                severityPoints = 14;
                break;
            default:
                severityPoints = 6;
                break;
        }
        totalScore += severityPoints;
        breakdown.put("Damage Severity (" + severity + ")", "+" + severityPoints);

        // 2. Road Importance & Traffic Exposure (Max 20 pts)
        int roadPoints = 10;
        String roadDesc = "Standard Road";
        if (road != null) {
            String cat = road.getRoadCategory() != null ? road.getRoadCategory().toUpperCase() : "LOCAL";
            String traffic = road.getTrafficLevel() != null ? road.getTrafficLevel().toUpperCase() : "MEDIUM";

            if (cat.contains("EXPRESS") || traffic.equals("CRITICAL")) {
                roadPoints = 20;
                roadDesc = "Expressway / Critical Traffic Corridor";
            } else if (cat.contains("ARTERIAL") || traffic.equals("HIGH")) {
                roadPoints = 16;
                roadDesc = "Major Arterial Highway";
            } else if (cat.contains("COLLECTOR")) {
                roadPoints = 11;
                roadDesc = "Collector Road";
            } else {
                roadPoints = 6;
                roadDesc = "Local Residential Street";
            }
        }
        totalScore += roadPoints;
        breakdown.put("Road Importance (" + roadDesc + ")", "+" + roadPoints);

        // 3. Duplicate / Community Reports Component (Max 15 pts)
        int duplicatePoints = Math.min(15, duplicateCount * 3);
        if (duplicateCount > 0) {
            totalScore += duplicatePoints;
            breakdown.put(duplicateCount + " Community Duplicate Reports", "+" + duplicatePoints);
        }

        // 4. Critical Facility Proximity Component (Max 15 pts)
        int facilityPoints = 0;
        String facilityDesc = "Standard Civic Zone";
        String lm = landmark != null ? landmark.toLowerCase() : "";
        if (lm.contains("hospital") || lm.contains("emergency") || lm.contains("ambulance")) {
            facilityPoints = 15;
            facilityDesc = "Hospital / Emergency Route Proximity";
        } else if (lm.contains("school") || lm.contains("college") || lm.contains("bus station") || lm.contains("metro")) {
            facilityPoints = 12;
            facilityDesc = "School / Transit Hub Proximity";
        } else if (lm.contains("market") || lm.contains("junction") || lm.contains("mall")) {
            facilityPoints = 8;
            facilityDesc = "Dense Commercial / Intersection Proximity";
        }
        if (facilityPoints > 0) {
            totalScore += facilityPoints;
            breakdown.put(facilityDesc, "+" + facilityPoints);
        }

        // 5. SLA Due Date & Unresolved Aging Component (Max 20 pts)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime refCreated = createdAt != null ? createdAt : now;
        LocalDateTime slaDueDate;

        // SLA threshold by severity
        int slaHours;
        switch (severity) {
            case "CRITICAL": slaHours = 24; break;
            case "HIGH": slaHours = 48; break;
            case "MEDIUM": slaHours = 120; break; // 5 days
            default: slaHours = 240; break; // 10 days
        }
        slaDueDate = refCreated.plusHours(slaHours);

        boolean isEscalated = false;
        long hoursElapsed = Duration.between(refCreated, now).toHours();
        if (hoursElapsed > slaHours && !"RESOLVED".equalsIgnoreCase(currentStatus) && !"REPAIR_COMPLETED".equalsIgnoreCase(currentStatus)) {
            isEscalated = true;
            int agingPoints = (int) Math.min(20, (hoursElapsed - slaHours) / 12 * 4);
            if (agingPoints > 0) {
                totalScore += agingPoints;
                breakdown.put("SLA Overdue Aging (" + (hoursElapsed / 24) + " days pending)", "+" + agingPoints);
            }
        }

        // Normalize total score to [0, 100]
        int finalScore = Math.min(100, Math.max(0, totalScore));

        // Re-evaluate severity bracket based on explainable final score
        String evaluatedSeverity;
        if (finalScore >= 76) evaluatedSeverity = "CRITICAL";
        else if (finalScore >= 51) evaluatedSeverity = "HIGH";
        else if (finalScore >= 26) evaluatedSeverity = "MEDIUM";
        else evaluatedSeverity = "LOW";

        String jsonBreakdown;
        try {
            jsonBreakdown = objectMapper.writeValueAsString(breakdown);
        } catch (JsonProcessingException e) {
            jsonBreakdown = "{}";
        }

        return new PriorityResult(finalScore, evaluatedSeverity, jsonBreakdown, slaDueDate, isEscalated);
    }
}
