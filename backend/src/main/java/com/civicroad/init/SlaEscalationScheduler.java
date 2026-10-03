package com.civicroad.init;

import com.civicroad.entity.RoadIssue;
import com.civicroad.entity.User;
import com.civicroad.repository.RoadIssueRepository;
import com.civicroad.repository.UserRepository;
import com.civicroad.service.NotificationService;
import com.civicroad.service.PriorityEngineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SlaEscalationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(SlaEscalationScheduler.class);

    private final RoadIssueRepository roadIssueRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final PriorityEngineService priorityEngineService;

    public SlaEscalationScheduler(
            RoadIssueRepository roadIssueRepository,
            NotificationService notificationService,
            UserRepository userRepository,
            PriorityEngineService priorityEngineService) {
        this.roadIssueRepository = roadIssueRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.priorityEngineService = priorityEngineService;
    }

    @Scheduled(fixedRate = 120000) // Scan every 2 minutes
    @Transactional
    public void checkAndEscalateBreachedIssues() {
        LocalDateTime now = LocalDateTime.now();
        List<RoadIssue> openIssues = roadIssueRepository.findAllPrimaryIssues();

        for (RoadIssue issue : openIssues) {
            if ("RESOLVED".equalsIgnoreCase(issue.getStatus()) || "REPAIR_COMPLETED".equalsIgnoreCase(issue.getStatus())) {
                continue;
            }

            if (issue.getSlaDueDate() != null && now.isAfter(issue.getSlaDueDate()) && !Boolean.TRUE.equals(issue.getIsEscalated())) {
                logger.warn("SLA Breach detected on issue {}: SLA due date was {}", issue.getReferenceCode(), issue.getSlaDueDate());

                issue.setIsEscalated(true);
                issue.setStatus("ESCALATED");

                // Recalculate priority with SLA breach penalties
                PriorityEngineService.PriorityResult updatedPrio = priorityEngineService.calculatePriority(
                        issue.getDamageType(),
                        issue.getSeverity(),
                        issue.getRoad(),
                        issue.getLandmark(),
                        issue.getDuplicateCount(),
                        issue.getCreatedAt(),
                        "ESCALATED"
                );
                issue.setPriorityScore(updatedPrio.getScore());
                issue.setPriorityBreakdown(updatedPrio.getBreakdownJson());
                roadIssueRepository.save(issue);

                // Notify assigned officer or admins
                if (issue.getAssignedOfficer() != null) {
                    notificationService.createNotification(
                            issue.getAssignedOfficer(),
                            issue.getId(),
                            "⚠ SLA Breach Escalation: " + issue.getReferenceCode(),
                            "Issue " + issue.getReferenceCode() + " at " + issue.getAddress() + " has exceeded its resolution SLA and is escalated.",
                            "ESCALATED"
                    );
                }
            }
        }
    }
}
