package com.civicroad.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_records")
public class RepairRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false, unique = true)
    private RoadIssue issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id", nullable = false)
    private User officer;

    @Column(name = "repair_date")
    private LocalDateTime repairDate = LocalDateTime.now();

    @Column(name = "materials_used", columnDefinition = "TEXT")
    private String materialsUsed;

    @Column(name = "cost_estimate")
    private Double costEstimate = 0.0;

    @Column(name = "inspection_notes", columnDefinition = "TEXT")
    private String inspectionNotes;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "before_evidence_id")
    private IssueEvidence beforeEvidence;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "after_evidence_id")
    private IssueEvidence afterEvidence;

    public RepairRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoadIssue getIssue() { return issue; }
    public void setIssue(RoadIssue issue) { this.issue = issue; }

    public User getOfficer() { return officer; }
    public void setOfficer(User officer) { this.officer = officer; }

    public LocalDateTime getRepairDate() { return repairDate; }
    public void setRepairDate(LocalDateTime repairDate) { this.repairDate = repairDate; }

    public String getMaterialsUsed() { return materialsUsed; }
    public void setMaterialsUsed(String materialsUsed) { this.materialsUsed = materialsUsed; }

    public Double getCostEstimate() { return costEstimate; }
    public void setCostEstimate(Double costEstimate) { this.costEstimate = costEstimate; }

    public String getInspectionNotes() { return inspectionNotes; }
    public void setInspectionNotes(String inspectionNotes) { this.inspectionNotes = inspectionNotes; }

    public IssueEvidence getBeforeEvidence() { return beforeEvidence; }
    public void setBeforeEvidence(IssueEvidence beforeEvidence) { this.beforeEvidence = beforeEvidence; }

    public IssueEvidence getAfterEvidence() { return afterEvidence; }
    public void setAfterEvidence(IssueEvidence afterEvidence) { this.afterEvidence = afterEvidence; }
}
