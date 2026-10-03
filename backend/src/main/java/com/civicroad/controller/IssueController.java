package com.civicroad.controller;

import com.civicroad.dto.request.IssueCreateRequest;
import com.civicroad.dto.response.AIAnalysisResponse;
import com.civicroad.dto.response.IssueResponse;
import com.civicroad.dto.response.IssueSummaryResponse;
import com.civicroad.entity.User;
import com.civicroad.service.AIAnalysisService;
import com.civicroad.service.AuthService;
import com.civicroad.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@Tag(name = "Road Issues", description = "Public and Citizen reporting, issue queries, and AI preview")
public class IssueController {

    private final IssueService issueService;
    private final AuthService authService;
    private final AIAnalysisService aiAnalysisService;

    public IssueController(IssueService issueService, AuthService authService, AIAnalysisService aiAnalysisService) {
        this.issueService = issueService;
        this.authService = authService;
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submit a new road damage report with photographic evidence and geolocation")
    public ResponseEntity<IssueResponse> createIssue(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "damageType", required = false) String damageType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "urgencyRating", required = false, defaultValue = "MEDIUM") String urgencyRating,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "landmark", required = false) String landmark,
            @RequestParam(value = "roadName", required = false) String roadName,
            @RequestParam(value = "areaId", required = false) Long areaId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            Authentication authentication) {

        IssueCreateRequest req = new IssueCreateRequest();
        req.setLatitude(latitude);
        req.setLongitude(longitude);
        req.setDamageType(damageType);
        req.setDescription(description);
        req.setUrgencyRating(urgencyRating);
        req.setAddress(address);
        req.setLandmark(landmark);
        req.setRoadName(roadName);
        req.setAreaId(areaId);

        User citizen = (authentication != null && authentication.isAuthenticated())
                ? authService.getUserEntity(authentication)
                : null;

        IssueResponse response = issueService.createIssue(req, files, citizen);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/analyze-preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Run AI computer vision pre-analysis preview on image and description before submission")
    public ResponseEntity<AIAnalysisResponse> analyzePreview(
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        String fileName = (file != null && !file.isEmpty()) ? file.getOriginalFilename() : "";
        AIAnalysisService.AIResult aiResult = aiAnalysisService.analyzeReport(description, fileName);

        AIAnalysisResponse resp = new AIAnalysisResponse();
        resp.setPredictedDamageType(aiResult.damageType);
        resp.setConfidencePercentage(aiResult.confidence);
        resp.setPredictedSeverity(aiResult.severity);
        resp.setExplanation(aiResult.explanation);
        resp.setModelSource(aiResult.modelSource);
        resp.setIsOverridden(false);

        return ResponseEntity.ok(resp);
    }

    @PostMapping(value = "/analyze-preview", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Run AI computer vision pre-analysis preview using JSON payload")
    public ResponseEntity<AIAnalysisResponse> analyzePreviewJson(@RequestBody java.util.Map<String, String> body) {
        String description = body.getOrDefault("description", "");
        String fileName = body.getOrDefault("fileName", "");
        AIAnalysisService.AIResult aiResult = aiAnalysisService.analyzeReport(description, fileName);

        AIAnalysisResponse resp = new AIAnalysisResponse();
        resp.setPredictedDamageType(aiResult.damageType);
        resp.setConfidencePercentage(aiResult.confidence);
        resp.setPredictedSeverity(aiResult.severity);
        resp.setExplanation(aiResult.explanation);
        resp.setModelSource(aiResult.modelSource);
        resp.setIsOverridden(false);

        return ResponseEntity.ok(resp);
    }

    @GetMapping
    @Operation(summary = "Query road issues with filters (status, severity, damageType, area) and pagination")
    public ResponseEntity<Page<IssueSummaryResponse>> getIssues(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "severity", required = false) String severity,
            @RequestParam(value = "damageType", required = false) String damageType,
            @RequestParam(value = "areaId", required = false) Long areaId,
            @RequestParam(value = "officerId", required = false) Long officerId,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        Page<IssueSummaryResponse> issues = issueService.getIssues(
                status, severity, damageType, areaId, officerId, search, page, size
        );
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/map")
    @Operation(summary = "Get all primary issues for map markers and heatmap rendering")
    public ResponseEntity<List<IssueSummaryResponse>> getIssuesForMap() {
        return ResponseEntity.ok(issueService.getAllIssuesForMap());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full issue details by ID (including AI analysis, before/after evidence, duplicate cluster)")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @GetMapping("/ref/{refCode}")
    @Operation(summary = "Track report by public reference code (e.g. CR-2026-000001)")
    public ResponseEntity<IssueResponse> getIssueByReference(@PathVariable String refCode) {
        return ResponseEntity.ok(issueService.getIssueByReferenceCode(refCode));
    }
}
