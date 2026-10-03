package com.civicroad.dto.request;

import jakarta.validation.constraints.NotNull;

public class IssueCreateRequest {

    private String damageType;
    private String description;
    private String urgencyRating = "MEDIUM";

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String address;
    private String landmark;
    private String roadName;
    private Long areaId;

    public IssueCreateRequest() {}

    public String getDamageType() { return damageType; }
    public void setDamageType(String damageType) { this.damageType = damageType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUrgencyRating() { return urgencyRating; }
    public void setUrgencyRating(String urgencyRating) { this.urgencyRating = urgencyRating; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getRoadName() { return roadName; }
    public void setRoadName(String roadName) { this.roadName = roadName; }

    public Long getAreaId() { return areaId; }
    public void setAreaId(Long areaId) { this.areaId = areaId; }
}
