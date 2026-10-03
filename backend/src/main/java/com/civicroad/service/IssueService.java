package com.civicroad.service;

import com.civicroad.dto.request.*;
import com.civicroad.dto.response.*;
import com.civicroad.entity.*;
import com.civicroad.exception.BadRequestException;
import com.civicroad.exception.ResourceNotFoundException;
import com.civicroad.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IssueService {

    private final RoadIssueRepository roadIssueRepository;
    private final IssueEvidenceRepository evidenceRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final AuthorityOfficerRepository officerRepository;
    private final RoadRepository roadRepository;
    private final AreaRepository areaRepository;
    private final UserRepository userRepository;
    private final RepairRecordRepository repairRecordRepository;
    private final CitizenFeedbackRepository feedbackRepository;
    private final IssueStatusHistoryRepository statusHistoryRepository;
    private final StorageService storageService;
    private final AIAnalysisService aiAnalysisService;
    private final PriorityEngineService priorityEngineService;
    private final DuplicateDetectionService duplicateDetectionService;
    private final RoadHealthService roadHealthService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public IssueService(
            RoadIssueRepository roadIssueRepository,
            IssueEvidenceRepository evidenceRepository,
            AIAnalysisRepository aiAnalysisRepository,
            CitizenProfileRepository citizenProfileRepository,
            AuthorityOfficerRepository officerRepository,
            RoadRepository roadRepository,
            AreaRepository areaRepository,
            UserRepository userRepository,
            RepairRecordRepository repairRecordRepository,
            CitizenFeedbackRepository feedbackRepository,
            IssueStatusHistoryRepository statusHistoryRepository,
            StorageService storageService,
            AIAnalysisService aiAnalysisService,
            PriorityEngineService priorityEngineService,
            DuplicateDetectionService duplicateDetectionService,
            RoadHealthService roadHealthService,
            NotificationService notificationService,
            AuditLogService auditLogService) {
        this.roadIssueRepository = roadIssueRepository;
        this.evidenceRepository = evidenceRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.citizenProfileRepository = citizenProfileRepository;
        this.officerRepository = officerRepository;
        this.roadRepository = roadRepository;
        this.areaRepository = areaRepository;
        this.userRepository = userRepository;
        this.repairRecordRepository = repairRecordRepository;
        this.feedbackRepository = feedbackRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.storageService = storageService;
        this.aiAnalysisService = aiAnalysisService;
        this.priorityEngineService = priorityEngineService;
        this.duplicateDetectionService = duplicateDetectionService;
        this.roadHealthService = roadHealthService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    private String generateReferenceCode() {
        long count = roadIssueRepository.count() + 1;
        return String.format("CR-2026-%06d", count);
    }

    @Transactional
    public IssueResponse createIssue(IssueCreateRequest request, List<MultipartFile> files, User citizen) {
        RoadIssue issue = new RoadIssue();
        issue.setReferenceCode(generateReferenceCode());
        issue.setCitizen(citizen);
        issue.setLatitude(request.getLatitude());
        issue.setLongitude(request.getLongitude());
        issue.setAddress(request.getAddress());
        issue.setLandmark(request.getLandmark());
        issue.setDescription(request.getDescription());
        issue.setUrgencyRating(request.getUrgencyRating() != null ? request.getUrgencyRating() : "MEDIUM");
        issue.setStatus("REPORTED");

        // Resolve Area
        Area area = null;
        if (request.getAreaId() != null) {
            area = areaRepository.findById(request.getAreaId()).orElse(null);
        }
        if (area == null) {
            area = areaRepository.findAll().stream().findFirst()
                    .orElseGet(() -> areaRepository.save(new Area("Demo Zone A - Central Corridor", "Hyderabad", "Telangana", 78)));
        }
        issue.setArea(area);

        // Resolve Road
        Road road = null;
        if (request.getRoadName() != null && !request.getRoadName().trim().isEmpty()) {
            final Area targetArea = area;
            road = roadRepository.findByNameIgnoreCase(request.getRoadName().trim())
                    .orElseGet(() -> roadRepository.save(new Road(request.getRoadName().trim(), targetArea, "ARTERIAL", "HIGH", 75)));
        }
        if (road == null) {
            final Area targetArea = area;
            road = roadRepository.findByArea(area).stream().findFirst()
                    .orElseGet(() -> roadRepository.save(new Road("Central Demo Highway", targetArea, "ARTERIAL", "HIGH", 75)));
        }
        issue.setRoad(road);

        // 1. AI Analysis
        String firstFileName = (files != null && !files.isEmpty()) ? files.get(0).getOriginalFilename() : "";
        AIAnalysisService.AIResult aiResult = aiAnalysisService.analyzeReport(request.getDescription(), firstFileName);

        String initialDamageType = (request.getDamageType() != null && !request.getDamageType().trim().isEmpty())
                ? request.getDamageType().toUpperCase()
                : aiResult.damageType;
        issue.setDamageType(initialDamageType);
        issue.setSeverity(aiResult.severity);

        // 2. Priority Engine Scoring
        PriorityEngineService.PriorityResult prioResult = priorityEngineService.calculatePriority(
                issue.getDamageType(),
                issue.getSeverity(),
                road,
                request.getLandmark(),
                0,
                LocalDateTime.now(),
                "REPORTED"
        );
        issue.setPriorityScore(prioResult.getScore());
        issue.setPriorityBreakdown(prioResult.getBreakdownJson());
        issue.setSlaDueDate(prioResult.getSlaDueDate());
        issue.setIsEscalated(prioResult.isEscalated());

        issue = roadIssueRepository.save(issue);

        // 3. Save AI Analysis record
        aiAnalysisService.saveAnalysis(issue, aiResult);

        // 4. Save Evidence files
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String storedPath = storageService.store(file);
                    String fileType = storageService.determineFileType(file.getOriginalFilename());
                    IssueEvidence evidence = new IssueEvidence(issue, storedPath, storedPath, fileType, false, citizen);
                    evidenceRepository.save(evidence);
                }
            }
        }

        // 5. Duplicate Detection & Clustering
        RoadIssue parentCluster = duplicateDetectionService.checkAndLinkDuplicates(issue);
        if (parentCluster != null) {
            // Re-evaluate parent priority with updated duplicate count
            PriorityEngineService.PriorityResult updatedPrio = priorityEngineService.calculatePriority(
                    parentCluster.getDamageType(),
                    parentCluster.getSeverity(),
                    parentCluster.getRoad(),
                    parentCluster.getLandmark(),
                    parentCluster.getDuplicateCount(),
                    parentCluster.getCreatedAt(),
                    parentCluster.getStatus()
            );
            parentCluster.setPriorityScore(updatedPrio.getScore());
            parentCluster.setPriorityBreakdown(updatedPrio.getBreakdownJson());
            roadIssueRepository.save(parentCluster);
        }

        // 6. Record Status History
        statusHistoryRepository.save(new IssueStatusHistory(
                issue, citizen, null, "REPORTED", "Citizen report registered with AI damage classification."
        ));

        // 7. Update Road & Area Health
        roadHealthService.recalculateRoadHealth(road);

        // 8. Citizen Gamification / Badges
        if (citizen != null) {
            citizenProfileRepository.findByUser(citizen).ifPresent(profile -> {
                profile.setReportsSubmitted(profile.getReportsSubmitted() + 1);
                profile.setPoints(profile.getPoints() + 10);
                if (profile.getReportsSubmitted() >= 10) {
                    profile.setBadgeLevel("Road Safety Champion");
                } else if (profile.getReportsSubmitted() >= 3) {
                    profile.setBadgeLevel("Community Contributor");
                } else {
                    profile.setBadgeLevel("First Reporter");
                }
                citizenProfileRepository.save(profile);
            });

            // Notification
            notificationService.createNotification(
                    citizen,
                    issue.getId(),
                    "Report Submitted: " + issue.getReferenceCode(),
                    "Your report for " + issue.getDamageType().toLowerCase().replace('_', ' ') +
                    " at " + issue.getAddress() + " has been recorded with Priority " + issue.getPriorityScore() + "/100.",
                    "REPORT_SUBMITTED"
            );
        }

        auditLogService.logAction(citizen, "CREATE_REPORT", "RoadIssue", issue.getId(),
                "{\"ref\":\"" + issue.getReferenceCode() + "\",\"priority\":" + issue.getPriorityScore() + "}");

        return getIssueById(issue.getId());
    }

    @Transactional(readOnly = true)
    public IssueResponse getIssueById(Long id) {
        RoadIssue issue = roadIssueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Road issue not found with id: " + id));
        return mapToResponse(issue);
    }

    @Transactional(readOnly = true)
    public IssueResponse getIssueByReferenceCode(String refCode) {
        RoadIssue issue = roadIssueRepository.findByReferenceCode(refCode)
                .orElseThrow(() -> new ResourceNotFoundException("Road issue not found with reference: " + refCode));
        return mapToResponse(issue);
    }

    @Transactional(readOnly = true)
    public Page<IssueSummaryResponse> getIssues(
            String status, String severity, String damageType, Long areaId, Long officerId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)));
        Page<RoadIssue> issuePage = roadIssueRepository.filterIssues(
                status, severity, damageType, areaId, officerId, search, pageable
        );
        return issuePage.map(this::mapToSummary);
    }

    @Transactional(readOnly = true)
    public List<IssueSummaryResponse> getCitizenIssues(User citizen) {
        return roadIssueRepository.findByCitizenOrderByCreatedAtDesc(citizen).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueSummaryResponse> getOfficerAssignedIssues(User officer) {
        return roadIssueRepository.findByAssignedOfficerOrderByPriorityScoreDesc(officer).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueSummaryResponse> getAllIssuesForMap() {
        return roadIssueRepository.findAllPrimaryIssues().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    public IssueResponse updateStatus(Long issueId, IssueStatusUpdateRequest request, User actor) {
        RoadIssue issue = roadIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        String oldStatus = issue.getStatus();
        String newStatus = request.getStatus().toUpperCase();

        // State Machine Validation
        validateStatusTransition(oldStatus, newStatus);

        issue.setStatus(newStatus);
        issue.setUpdatedAt(LocalDateTime.now());
        roadIssueRepository.save(issue);

        // Record history
        statusHistoryRepository.save(new IssueStatusHistory(issue, actor, oldStatus, newStatus, request.getNotes()));

        // Recalculate Road Health
        if (issue.getRoad() != null) {
            roadHealthService.recalculateRoadHealth(issue.getRoad());
        }

        // Notify Citizen
        if (issue.getCitizen() != null) {
            notificationService.createNotification(
                    issue.getCitizen(),
                    issue.getId(),
                    "Status Updated: " + issue.getReferenceCode(),
                    "Your report status has changed from " + oldStatus + " to " + newStatus + ".",
                    "STATUS_UPDATE"
            );
        }

        auditLogService.logAction(actor, "STATUS_CHANGE", "RoadIssue", issue.getId(),
                "{\"old\":\"" + oldStatus + "\",\"new\":\"" + newStatus + "\",\"notes\":\"" + request.getNotes() + "\"}");

        return mapToResponse(issue);
    }

    @Transactional
    public IssueResponse assignOfficer(Long issueId, IssueAssignRequest request, User actor) {
        RoadIssue issue = roadIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        User officerUser = userRepository.findById(request.getOfficerId())
                .orElseThrow(() -> new ResourceNotFoundException("Officer user not found with id: " + request.getOfficerId()));

        issue.setAssignedOfficer(officerUser);
        if ("REPORTED".equalsIgnoreCase(issue.getStatus()) || "UNDER_REVIEW".equalsIgnoreCase(issue.getStatus())) {
            issue.setStatus("ASSIGNED");
        }
        issue.setUpdatedAt(LocalDateTime.now());
        roadIssueRepository.save(issue);

        // Update Officer Workload
        officerRepository.findByUser(officerUser).ifPresent(off -> {
            off.setActiveCases(off.getActiveCases() + 1);
            off.setCurrentWorkload(off.getCurrentWorkload() + 1);
            officerRepository.save(off);
        });

        statusHistoryRepository.save(new IssueStatusHistory(
                issue, actor, issue.getStatus(), "ASSIGNED", "Assigned to officer " + officerUser.getFullName() + ". Notes: " + request.getNotes()
        ));

        // Notify Officer
        notificationService.createNotification(
                officerUser,
                issue.getId(),
                "New Assignment: " + issue.getReferenceCode(),
                "You have been assigned to handle " + issue.getDamageType().toLowerCase().replace('_', ' ') + " at " + issue.getAddress() + ".",
                "ASSIGNED"
        );

        // Notify Citizen
        if (issue.getCitizen() != null) {
            notificationService.createNotification(
                    issue.getCitizen(),
                    issue.getId(),
                    "Officer Assigned: " + issue.getReferenceCode(),
                    "Officer " + officerUser.getFullName() + " has been assigned to your reported issue.",
                    "ASSIGNED"
            );
        }

        auditLogService.logAction(actor, "ASSIGN_OFFICER", "RoadIssue", issue.getId(),
                "{\"officerId\":" + officerUser.getId() + ",\"officerName\":\"" + officerUser.getFullName() + "\"}");

        return mapToResponse(issue);
    }

    @Transactional
    public IssueResponse submitRepair(Long issueId, RepairRecordRequest request, MultipartFile afterImage, User officer) {
        RoadIssue issue = roadIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        String afterImagePath = null;
        IssueEvidence afterEvidence = null;
        if (afterImage != null && !afterImage.isEmpty()) {
            afterImagePath = storageService.store(afterImage);
            afterEvidence = new IssueEvidence(issue, afterImagePath, afterImagePath, "IMAGE", true, officer);
            afterEvidence = evidenceRepository.save(afterEvidence);
        }

        IssueEvidence beforeEvidence = evidenceRepository.findByIssueOrderByCreatedAtAsc(issue).stream()
                .filter(e -> !e.getIsAfterRepair())
                .findFirst()
                .orElse(null);

        RepairRecord repair = repairRecordRepository.findByIssue(issue).orElse(new RepairRecord());
        repair.setIssue(issue);
        repair.setOfficer(officer);
        repair.setRepairDate(LocalDateTime.now());
        repair.setMaterialsUsed(request.getMaterialsUsed());
        repair.setCostEstimate(request.getCostEstimate() != null ? request.getCostEstimate() : 0.0);
        repair.setInspectionNotes(request.getInspectionNotes());
        repair.setBeforeEvidence(beforeEvidence);
        repair.setAfterEvidence(afterEvidence);
        repairRecordRepository.save(repair);

        issue.setStatus("AWAITING_CITIZEN_CONFIRMATION");
        issue.setUpdatedAt(LocalDateTime.now());
        roadIssueRepository.save(issue);

        statusHistoryRepository.save(new IssueStatusHistory(
                issue, officer, "IN_PROGRESS", "AWAITING_CITIZEN_CONFIRMATION",
                "Repair completed. After-repair photographic evidence uploaded. Awaiting citizen confirmation."
        ));

        // Notify Citizen for confirmation
        if (issue.getCitizen() != null) {
            notificationService.createNotification(
                    issue.getCitizen(),
                    issue.getId(),
                    "Repair Verification Requested: " + issue.getReferenceCode(),
                    "Maintenance repair has been completed! Please inspect the before/after photos and confirm whether the road is fixed.",
                    "CONFIRMATION_REQUESTED"
            );
        }

        auditLogService.logAction(officer, "REPAIR_COMPLETED", "RoadIssue", issue.getId(),
                "{\"cost\":" + repair.getCostEstimate() + ",\"materials\":\"" + repair.getMaterialsUsed() + "\"}");

        return mapToResponse(issue);
    }

    @Transactional
    public IssueResponse submitCitizenFeedback(Long issueId, CitizenFeedbackRequest request, User citizen) {
        RoadIssue issue = roadIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        CitizenFeedback feedback = new CitizenFeedback(
                issue, citizen, request.getFeedbackType().toUpperCase(), request.getRating(), request.getComments()
        );
        feedbackRepository.save(feedback);

        String type = request.getFeedbackType().toUpperCase();
        if ("FIXED".equals(type)) {
            issue.setStatus("RESOLVED");
            issue.setUpdatedAt(LocalDateTime.now());
            roadIssueRepository.save(issue);

            statusHistoryRepository.save(new IssueStatusHistory(
                    issue, citizen, "AWAITING_CITIZEN_CONFIRMATION", "RESOLVED",
                    "Citizen confirmed repair as satisfactory. Road issue officially resolved."
            ));

            // Award civic points (+25)
            citizenProfileRepository.findByUser(citizen).ifPresent(profile -> {
                profile.setReportsResolved(profile.getReportsResolved() + 1);
                profile.setPoints(profile.getPoints() + 25);
                citizenProfileRepository.save(profile);
            });

            // Recalculate Road Health
            if (issue.getRoad() != null) {
                roadHealthService.recalculateRoadHealth(issue.getRoad());
            }

            notificationService.createNotification(
                    citizen,
                    issue.getId(),
                    "Issue Resolved: " + issue.getReferenceCode(),
                    "Thank you for validating this repair! You earned 25 Civic Contributor points.",
                    "RESOLVED"
            );
        } else if ("NOT_FIXED".equals(type) || "PARTIALLY_FIXED".equals(type)) {
            issue.setStatus("REOPENED");
            issue.setPriorityScore(Math.min(100, issue.getPriorityScore() + 15)); // Bump priority
            issue.setUpdatedAt(LocalDateTime.now());
            roadIssueRepository.save(issue);

            statusHistoryRepository.save(new IssueStatusHistory(
                    issue, citizen, "AWAITING_CITIZEN_CONFIRMATION", "REOPENED",
                    "Citizen indicated repair is unsatisfactory ('" + type + "'). Reopened for urgent maintenance review."
            ));

            if (issue.getAssignedOfficer() != null) {
                notificationService.createNotification(
                        issue.getAssignedOfficer(),
                        issue.getId(),
                        "Issue Reopened: " + issue.getReferenceCode(),
                        "Citizen marked repair as " + type + ". Reason: " + request.getComments(),
                        "REOPENED"
                );
            }
        }

        auditLogService.logAction(citizen, "CITIZEN_FEEDBACK", "RoadIssue", issue.getId(),
                "{\"feedbackType\":\"" + type + "\",\"rating\":" + request.getRating() + "}");

        return mapToResponse(issue);
    }

    @Transactional
    public IssueResponse overrideAI(Long issueId, IssueOverrideRequest request, User officerOrAdmin) {
        RoadIssue issue = roadIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        AIAnalysis analysis = aiAnalysisRepository.findByIssue(issue).orElse(new AIAnalysis());
        analysis.setIssue(issue);
        analysis.setIsOverridden(true);
        analysis.setOverriddenBy(officerOrAdmin);
        analysis.setOverrideReason(request.getOverrideReason());
        aiAnalysisRepository.save(analysis);

        if (request.getDamageType() != null && !request.getDamageType().trim().isEmpty()) {
            issue.setDamageType(request.getDamageType().toUpperCase());
        }
        if (request.getSeverity() != null && !request.getSeverity().trim().isEmpty()) {
            issue.setSeverity(request.getSeverity().toUpperCase());
        }
        if (request.getPriorityScore() != null) {
            issue.setPriorityScore(Math.min(100, Math.max(0, request.getPriorityScore())));
        } else {
            // Recompute priority
            PriorityEngineService.PriorityResult prio = priorityEngineService.calculatePriority(
                    issue.getDamageType(),
                    issue.getSeverity(),
                    issue.getRoad(),
                    issue.getLandmark(),
                    issue.getDuplicateCount(),
                    issue.getCreatedAt(),
                    issue.getStatus()
            );
            issue.setPriorityScore(prio.getScore());
            issue.setPriorityBreakdown(prio.getBreakdownJson());
        }

        issue.setUpdatedAt(LocalDateTime.now());
        roadIssueRepository.save(issue);

        statusHistoryRepository.save(new IssueStatusHistory(
                issue, officerOrAdmin, issue.getStatus(), issue.getStatus(),
                "Human-in-the-loop override applied by " + officerOrAdmin.getFullName() + ". Reason: " + request.getOverrideReason()
        ));

        auditLogService.logAction(officerOrAdmin, "HUMAN_OVERRIDE_AI", "RoadIssue", issue.getId(),
                "{\"reason\":\"" + request.getOverrideReason() + "\",\"newSeverity\":\"" + issue.getSeverity() + "\"}");

        return mapToResponse(issue);
    }

    private void validateStatusTransition(String from, String to) {
        if (from.equalsIgnoreCase(to)) return;

        Map<String, Set<String>> allowedTransitions = new HashMap<>();
        allowedTransitions.put("DRAFT", Set.of("REPORTED"));
        allowedTransitions.put("REPORTED", Set.of("UNDER_REVIEW", "VERIFIED", "REJECTED", "ESCALATED"));
        allowedTransitions.put("UNDER_REVIEW", Set.of("VERIFIED", "REJECTED", "ESCALATED"));
        allowedTransitions.put("VERIFIED", Set.of("ASSIGNED", "IN_PROGRESS", "REJECTED", "ESCALATED"));
        allowedTransitions.put("ASSIGNED", Set.of("IN_PROGRESS", "REJECTED", "ESCALATED"));
        allowedTransitions.put("IN_PROGRESS", Set.of("REPAIR_COMPLETED", "AWAITING_CITIZEN_CONFIRMATION", "ESCALATED"));
        allowedTransitions.put("REPAIR_COMPLETED", Set.of("AWAITING_CITIZEN_CONFIRMATION", "RESOLVED"));
        allowedTransitions.put("AWAITING_CITIZEN_CONFIRMATION", Set.of("RESOLVED", "REOPENED"));
        allowedTransitions.put("REOPENED", Set.of("ASSIGNED", "IN_PROGRESS", "UNDER_REVIEW"));
        allowedTransitions.put("ESCALATED", Set.of("IN_PROGRESS", "ASSIGNED", "RESOLVED"));
        allowedTransitions.put("RESOLVED", Set.of("REOPENED"));
        allowedTransitions.put("REJECTED", Set.of("UNDER_REVIEW"));

        Set<String> validNext = allowedTransitions.getOrDefault(from, Collections.emptySet());
        if (!validNext.contains(to)) {
            throw new BadRequestException("Invalid status transition from " + from + " to " + to);
        }
    }

    private IssueResponse mapToResponse(RoadIssue issue) {
        IssueResponse resp = new IssueResponse();
        resp.setId(issue.getId());
        resp.setReferenceCode(issue.getReferenceCode());
        if (issue.getCitizen() != null) {
            resp.setCitizenId(issue.getCitizen().getId());
            // Anonymize for civic privacy
            resp.setCitizenName(issue.getCitizen().getFullName().replaceAll("(?<=.{2}).(?=.*@|.* )", "*"));
        } else {
            resp.setCitizenName("Community Contributor");
        }

        if (issue.getRoad() != null) {
            resp.setRoadId(issue.getRoad().getId());
            resp.setRoadName(issue.getRoad().getName());
            resp.setRoadCategory(issue.getRoad().getRoadCategory());
        }
        if (issue.getArea() != null) {
            resp.setAreaId(issue.getArea().getId());
            resp.setAreaName(issue.getArea().getName());
            resp.setCity(issue.getArea().getCity());
        }

        resp.setDamageType(issue.getDamageType());
        resp.setSeverity(issue.getSeverity());
        resp.setPriorityScore(issue.getPriorityScore());
        resp.setPriorityBreakdown(issue.getPriorityBreakdown());
        resp.setStatus(issue.getStatus());
        resp.setLatitude(issue.getLatitude());
        resp.setLongitude(issue.getLongitude());
        resp.setAddress(issue.getAddress());
        resp.setLandmark(issue.getLandmark());
        resp.setDescription(issue.getDescription());
        resp.setUrgencyRating(issue.getUrgencyRating());
        resp.setParentIssueId(issue.getParentIssue() != null ? issue.getParentIssue().getId() : null);
        resp.setDuplicateCount(issue.getDuplicateCount());
        resp.setSlaDueDate(issue.getSlaDueDate());
        resp.setIsEscalated(issue.getIsEscalated());
        resp.setCreatedAt(issue.getCreatedAt());
        resp.setUpdatedAt(issue.getUpdatedAt());

        if (issue.getAssignedOfficer() != null) {
            resp.setAssignedOfficerId(issue.getAssignedOfficer().getId());
            resp.setAssignedOfficerName(issue.getAssignedOfficer().getFullName());
            officerRepository.findByUser(issue.getAssignedOfficer()).ifPresent(off -> {
                if (off.getDepartment() != null) {
                    resp.setDepartmentName(off.getDepartment().getName());
                }
            });
        }

        // AI Analysis
        aiAnalysisRepository.findByIssue(issue).ifPresent(ai -> {
            AIAnalysisResponse aiResp = new AIAnalysisResponse();
            aiResp.setPredictedDamageType(ai.getPredictedDamageType());
            aiResp.setConfidencePercentage(ai.getConfidencePercentage());
            aiResp.setPredictedSeverity(ai.getPredictedSeverity());
            aiResp.setExplanation(ai.getExplanation());
            aiResp.setModelSource(ai.getModelSource());
            aiResp.setIsOverridden(ai.getIsOverridden());
            if (ai.getOverriddenBy() != null) {
                aiResp.setOverriddenByName(ai.getOverriddenBy().getFullName());
            }
            aiResp.setOverrideReason(ai.getOverrideReason());
            resp.setAiAnalysis(aiResp);
        });

        // Evidences
        List<IssueEvidence> evidences = evidenceRepository.findByIssueOrderByCreatedAtAsc(issue);
        List<IssueResponse.EvidenceItem> evidenceItems = evidences.stream()
                .map(e -> new IssueResponse.EvidenceItem(e.getId(), e.getFilePath(), e.getFileType(), e.getIsAfterRepair()))
                .collect(Collectors.toList());
        resp.setEvidences(evidenceItems);

        // Community Evidence Fusion (Duplicates)
        List<RoadIssue> fusedChildren = roadIssueRepository.findChildrenByParentId(issue.getId());
        List<IssueSummaryResponse> duplicateSummaries = fusedChildren.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
        resp.setFusedDuplicates(duplicateSummaries);

        // Repair Record
        repairRecordRepository.findByIssue(issue).ifPresent(repair -> {
            IssueResponse.RepairDetails details = new IssueResponse.RepairDetails();
            details.setId(repair.getId());
            details.setOfficerName(repair.getOfficer().getFullName());
            details.setRepairDate(repair.getRepairDate());
            details.setMaterialsUsed(repair.getMaterialsUsed());
            details.setCostEstimate(repair.getCostEstimate());
            details.setInspectionNotes(repair.getInspectionNotes());
            if (repair.getBeforeEvidence() != null) details.setBeforeImageUrl(repair.getBeforeEvidence().getFilePath());
            if (repair.getAfterEvidence() != null) details.setAfterImageUrl(repair.getAfterEvidence().getFilePath());
            resp.setRepairDetails(details);
        });

        // Feedbacks
        List<CitizenFeedback> feedbacks = feedbackRepository.findByIssue(issue);
        List<IssueResponse.FeedbackItem> feedbackItems = feedbacks.stream()
                .map(f -> new IssueResponse.FeedbackItem(
                        f.getCitizen().getFullName().replaceAll("(?<=.{2}).(?=.*@|.* )", "*"),
                        f.getFeedbackType(), f.getRating(), f.getComments(), f.getCreatedAt()
                ))
                .collect(Collectors.toList());
        resp.setFeedbacks(feedbackItems);

        return resp;
    }

    private IssueSummaryResponse mapToSummary(RoadIssue issue) {
        IssueSummaryResponse sum = new IssueSummaryResponse();
        sum.setId(issue.getId());
        sum.setReferenceCode(issue.getReferenceCode());
        sum.setDamageType(issue.getDamageType());
        sum.setSeverity(issue.getSeverity());
        sum.setPriorityScore(issue.getPriorityScore());
        sum.setStatus(issue.getStatus());
        sum.setLatitude(issue.getLatitude());
        sum.setLongitude(issue.getLongitude());
        sum.setAddress(issue.getAddress());
        if (issue.getRoad() != null) sum.setRoadName(issue.getRoad().getName());
        if (issue.getArea() != null) sum.setAreaName(issue.getArea().getName());
        sum.setDuplicateCount(issue.getDuplicateCount());
        sum.setIsEscalated(issue.getIsEscalated());
        sum.setCreatedAt(issue.getCreatedAt());

        // Find primary thumbnail
        evidenceRepository.findByIssueOrderByCreatedAtAsc(issue).stream()
                .findFirst()
                .ifPresent(e -> sum.setThumbnailUrl(e.getFilePath()));

        return sum;
    }
}
