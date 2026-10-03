package com.civicroad.dto.response;

public class AIAnalysisResponse {
    private String predictedDamageType;
    private Double confidencePercentage;
    private String predictedSeverity;
    private String explanation;
    private String modelSource;
    private Boolean isOverridden;
    private String overriddenByName;
    private String overrideReason;

    public AIAnalysisResponse() {}

    public String getPredictedDamageType() { return predictedDamageType; }
    public void setPredictedDamageType(String predictedDamageType) { this.predictedDamageType = predictedDamageType; }

    public Double getConfidencePercentage() { return confidencePercentage; }
    public void setConfidencePercentage(Double confidencePercentage) { this.confidencePercentage = confidencePercentage; }

    public String getPredictedSeverity() { return predictedSeverity; }
    public void setPredictedSeverity(String predictedSeverity) { this.predictedSeverity = predictedSeverity; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getModelSource() { return modelSource; }
    public void setModelSource(String modelSource) { this.modelSource = modelSource; }

    public Boolean getIsOverridden() { return isOverridden; }
    public void setIsOverridden(Boolean isOverridden) { this.isOverridden = isOverridden; }

    public String getOverriddenByName() { return overriddenByName; }
    public void setOverriddenByName(String overriddenByName) { this.overriddenByName = overriddenByName; }

    public String getOverrideReason() { return overrideReason; }
    public void setOverrideReason(String overrideReason) { this.overrideReason = overrideReason; }
}
