package com.civicroad.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_evidences")
public class IssueEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private RoadIssue issue;

    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    @Column(name = "thumbnail_path", length = 255)
    private String thumbnailPath;

    @Column(name = "file_type", length = 20)
    private String fileType = "IMAGE"; // IMAGE, VIDEO

    @Column(name = "is_after_repair")
    private Boolean isAfterRepair = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id")
    private User uploadedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public IssueEvidence() {}

    public IssueEvidence(RoadIssue issue, String filePath, String thumbnailPath, String fileType, Boolean isAfterRepair, User uploadedBy) {
        this.issue = issue;
        this.filePath = filePath;
        this.thumbnailPath = thumbnailPath;
        this.fileType = fileType != null ? fileType : "IMAGE";
        this.isAfterRepair = isAfterRepair != null ? isAfterRepair : false;
        this.uploadedBy = uploadedBy;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoadIssue getIssue() { return issue; }
    public void setIssue(RoadIssue issue) { this.issue = issue; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getThumbnailPath() { return thumbnailPath; }
    public void setThumbnailPath(String thumbnailPath) { this.thumbnailPath = thumbnailPath; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Boolean getIsAfterRepair() { return isAfterRepair; }
    public void setIsAfterRepair(Boolean isAfterRepair) { this.isAfterRepair = isAfterRepair; }

    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
