package com.civicroad.controller;

import com.civicroad.dto.request.CitizenFeedbackRequest;
import com.civicroad.dto.response.CitizenDashboardResponse;
import com.civicroad.dto.response.IssueResponse;
import com.civicroad.dto.response.IssueSummaryResponse;
import com.civicroad.entity.User;
import com.civicroad.service.AuthService;
import com.civicroad.service.DashboardService;
import com.civicroad.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
@Tag(name = "Citizen Portal", description = "Citizen dashboard, reports history, and repair verification")
@PreAuthorize("hasAnyAuthority('ROLE_CITIZEN', 'ROLE_ADMIN')")
public class CitizenController {

    private final AuthService authService;
    private final DashboardService dashboardService;
    private final IssueService issueService;

    public CitizenController(AuthService authService, DashboardService dashboardService, IssueService issueService) {
        this.authService = authService;
        this.dashboardService = dashboardService;
        this.issueService = issueService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get citizen dashboard overview, impact metrics, and personal badges")
    public ResponseEntity<CitizenDashboardResponse> getDashboard(Authentication authentication) {
        User citizen = authService.getUserEntity(authentication);
        return ResponseEntity.ok(dashboardService.getCitizenDashboard(citizen));
    }

    @GetMapping("/my-reports")
    @Operation(summary = "Get all road damage reports submitted by current citizen")
    public ResponseEntity<List<IssueSummaryResponse>> getMyReports(Authentication authentication) {
        User citizen = authService.getUserEntity(authentication);
        return ResponseEntity.ok(issueService.getCitizenIssues(citizen));
    }

    @PostMapping("/issues/{id}/feedback")
    @Operation(summary = "Submit citizen repair verification (Fixed, Partially Fixed, Not Fixed) with comments")
    public ResponseEntity<IssueResponse> submitFeedback(
            @PathVariable Long id,
            @Valid @RequestBody CitizenFeedbackRequest request,
            Authentication authentication) {
        User citizen = authService.getUserEntity(authentication);
        return ResponseEntity.ok(issueService.submitCitizenFeedback(id, request, citizen));
    }
}
