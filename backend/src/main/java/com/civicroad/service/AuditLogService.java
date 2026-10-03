package com.civicroad.service;

import com.civicroad.entity.AuditLog;
import com.civicroad.entity.User;
import com.civicroad.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void logAction(User actor, String action, String entityType, Long entityId, String detailsJson) {
        AuditLog log = new AuditLog(actor, action, entityType, entityId, detailsJson);
        auditLogRepository.save(log);
    }
}
