package com.civicroad.controller;

import com.civicroad.dto.response.*;
import com.civicroad.entity.*;
import com.civicroad.repository.*;
import com.civicroad.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administration", description = "Executive analytics, user administration, and audit logs")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final AuthorityOfficerRepository officerRepository;
    private final AreaRepository areaRepository;
    private final RoadRepository roadRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminController(
            DashboardService dashboardService,
            UserRepository userRepository,
            AuthorityOfficerRepository officerRepository,
            AreaRepository areaRepository,
            RoadRepository roadRepository,
            AuditLogRepository auditLogRepository) {
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
        this.officerRepository = officerRepository;
        this.areaRepository = areaRepository;
        this.roadRepository = roadRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get executive admin dashboard metrics")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get visual analytics dataset for charts and road health heatmaps")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(dashboardService.getAnalytics());
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of registered users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getEmail(), u.getFullName(), u.getPhone(), u.getRole().name(), u.getIsActive()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/officers")
    @Operation(summary = "Get list of maintenance officers for assignment dropdowns")
    public ResponseEntity<List<UserResponse>> getOfficers() {
        List<UserResponse> officers = userRepository.findByRole(Role.ROLE_OFFICER).stream()
                .map(u -> new UserResponse(u.getId(), u.getEmail(), u.getFullName(), u.getPhone(), u.getRole().name(), u.getIsActive()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(officers);
    }

    @GetMapping("/areas")
    @Operation(summary = "Get all municipal areas and jurisdiction boundaries")
    public ResponseEntity<List<Area>> getAreas() {
        return ResponseEntity.ok(areaRepository.findAll());
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get recent system audit logs for administrative compliance")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findTop50ByOrderByCreatedAtDesc());
    }
}
