package com.civicroad;

import com.civicroad.service.DuplicateDetectionService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DuplicateDetectionServiceTest {

    @Test
    public void testHaversineDistanceCloseCoordinates() {
        // Point A: 17.4485, 78.3750 (Cyber Gateway Junction)
        // Point B: 17.4487, 78.3752 (~30 meters away)
        double distance = DuplicateDetectionService.calculateHaversineDistanceMeters(
                17.4485, 78.3750,
                17.4487, 78.3752
        );

        assertTrue(distance > 10 && distance < 60, "Distance should be ~30m, got: " + distance);
    }

    @Test
    public void testHaversineDistanceFarCoordinates() {
        // Point A: Hyderabad (17.4065, 78.4772)
        // Point B: Secunderabad (17.4399, 78.4983) (~4.3km away)
        double distance = DuplicateDetectionService.calculateHaversineDistanceMeters(
                17.4065, 78.4772,
                17.4399, 78.4983
        );

        assertTrue(distance > 3500 && distance < 6000, "Distance should be ~4.3km, got: " + distance);
    }
}
