package com.civicroad.service;

import com.civicroad.dto.response.NotificationResponse;
import com.civicroad.entity.Notification;
import com.civicroad.entity.User;
import com.civicroad.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public void createNotification(User user, Long issueId, String title, String message, String type) {
        if (user == null) return;

        Notification notification = new Notification(user, issueId, title, message, type);
        notification = notificationRepository.save(notification);

        // Send WebSocket notification
        try {
            NotificationResponse response = toDto(notification);
            messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), response);
            messagingTemplate.convertAndSend("/topic/issues", "ISSUE_UPDATED_" + issueId);
        } catch (Exception ex) {
            logger.warn("WebSocket notification could not be delivered: {}", ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUser().getId().equals(user.getId())) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifs = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        for (Notification n : notifs) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifs);
    }

    private NotificationResponse toDto(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getIssueId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.getIsRead(),
                n.getCreatedAt()
        );
    }
}
