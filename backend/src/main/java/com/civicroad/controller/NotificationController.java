package com.civicroad.controller;

import com.civicroad.dto.response.NotificationResponse;
import com.civicroad.entity.User;
import com.civicroad.service.AuthService;
import com.civicroad.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Real-time and in-app user notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "Get in-app notifications for currently logged in user")
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {
        User user = authService.getUserEntity(authentication);
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications for badge display")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        User user = authService.getUserEntity(authentication);
        return ResponseEntity.ok(notificationService.getUnreadCount(user.getId()));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        User user = authService.getUserEntity(authentication);
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications for current user as read")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        User user = authService.getUserEntity(authentication);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}
