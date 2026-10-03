package com.civicroad.controller;

import com.civicroad.dto.request.*;
import com.civicroad.dto.response.*;
import com.civicroad.entity.User;
import com.civicroad.service.AuthService;
import com.civicroad.service.DashboardService;
import com.civicroad.service.DuplicateDetectionService;
import com.civicroad.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/authority")
@Tag(name = "Authority Operations", description = "Municipal officer operations, priority queue, assignment, and repair")
@PreAuthorize("hasAnyAuthority('ROLE_OFFICER', 'ROLE_ADMIN')")
public class AuthorityController {

    private final AuthService authService;
    private final DashboardService dashboardService;
    private final IssueService issueService;
    private final DuplicateDetectionService duplicateDetectionService;

    public AuthorityController(
            AuthService authService,
            DashboardService dashboardService,
            IssueService issueService,
            DuplicateDetectionService duplicateDetectionService) {
        this.authService = authService;
        this.dashboardService = dashboardService;
        this.issueService = issueService;
        this.duplicateDetectionService = duplicateDetectionService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get authority officer operational dashboard with KPIs and Priority Queue")
    public ResponseEntity<AuthorityDashboardResponse> getDashboard(Authentication authentication) {
        User officer = authService.getUserEntity(authentication);
        return ResponseEntity.ok(dashboardService.getAuthorityDashboard(officer));
    }

    @GetMapping("/issues")
    @Operation(summary = "Get issues assigned to current officer")
    public ResponseEntity<List<IssueSummaryResponse>> getAssignedIssues(Authentication authentication) {
        User officer = authService.getUserEntity(authentication);
        return ResponseEntity.ok(issueService.getOfficerAssignedIssues(officer));
    }

    @PostMapping("/issues/{id}/assign")
    @Operation(summary = "Assign a maintenance officer to an issue")
    public ResponseEntity<IssueResponse> assignOfficer(
            @PathVariable Long id,
            @Valid @RequestBody IssueAssignRequest request,
            Authentication authentication) {
        User actor = authService.getUserEntity(authentication);
        return ResponseEntity.ok(issueService.assignOfficer(id, request, actor));
    }

    @PutMapping("/issues/{id}/status")
    @Operation(summary = "Update issue lifecycle status with state machine enforcement")
    public ResponseEntity<IssueResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody IssueStatusUpdateRequest request,
            Authentication authentication) {
        User actor = authService.getUserEntity(authentication);
        return ResponseEntity.ok(issueService.updateStatus(id, request, actor));
    }

    @PostMapping(value = "/issues/{id}/repair", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submit repair completion record with photographic after-evidence and materials")
    public ResponseEntity<IssueResponse> submitRepair(
            @PathVariable Long id,
            @RequestParam(value = "materialsUsed", required = false) String materialsUsed,
            @RequestParam(value = "costEstimate", required = false, defaultValue = "0.0") Double costEstimate,
            @RequestParam(value = "inspectionNotes", required = false) String inspectionNotes,
            @RequestParam(value = "afterImage", required = false) MultipartFile afterImage,
            Authentication authentication) {

        RepairRecordRequest req = new RepairRecordRequest();
        req.setMaterialsUsed(materialsUsed);
        req.setCostEstimate(costEstimate);
        req.setInspectionNotes(inspectionNotes);

        User officer = authService.getUserEntity(authentication);
        return ResponseEntity.ok(issueService.submitRepair(id, req, afterImage, officer));
    }

    @PostMapping("/issues/{id}/override")
    @Operation(summary = "Human-in-the-loop override of AI classification, severity, and priority")
    public ResponseEntity<IssueResponse> overrideAI(
            @PathVariable Long id,
            @RequestBody IssueOverrideRequest request,
            Authentication authentication) {
        User officer = authService.getUserEntity(authentication);
        return ResponseEntity.ok(issueService.overrideAI(id, request, officer));
    }

    @PostMapping("/issues/merge")
    @Operation(summary = "Merge duplicate report into primary issue cluster for Community Evidence Fusion")
    public ResponseEntity<String> mergeIssues(
            @RequestParam("primaryIssueId") Long primaryIssueId,
            @RequestParam("duplicateIssueId") Long duplicateIssueId) {
        duplicateDetectionService.mergeIssues(primaryIssueId, duplicateIssueId);
        return ResponseEntity.ok("Issues merged successfully under Community Evidence Fusion.");
    }
}
