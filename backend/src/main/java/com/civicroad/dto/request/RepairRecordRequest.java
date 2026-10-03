package com.civicroad.dto.request;

public class RepairRecordRequest {

    private String materialsUsed;
    private Double costEstimate = 0.0;
    private String inspectionNotes;

    public RepairRecordRequest() {}

    public String getMaterialsUsed() { return materialsUsed; }
    public void setMaterialsUsed(String materialsUsed) { this.materialsUsed = materialsUsed; }

    public Double getCostEstimate() { return costEstimate; }
    public void setCostEstimate(Double costEstimate) { this.costEstimate = costEstimate; }

    public String getInspectionNotes() { return inspectionNotes; }
    public void setInspectionNotes(String inspectionNotes) { this.inspectionNotes = inspectionNotes; }
}
