package com.civicroad.service;

import com.civicroad.entity.IssueDuplicateCandidate;
import com.civicroad.entity.RoadIssue;
import com.civicroad.repository.IssueDuplicateCandidateRepository;
import com.civicroad.repository.RoadIssueRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DuplicateDetectionService {

    private static final Logger logger = LoggerFactory.getLogger(DuplicateDetectionService.class);
    private static final double DUPLICATE_RADIUS_METERS = 150.0;

    private final RoadIssueRepository roadIssueRepository;
    private final IssueDuplicateCandidateRepository duplicateCandidateRepository;

    public DuplicateDetectionService(
            RoadIssueRepository roadIssueRepository,
            IssueDuplicateCandidateRepository duplicateCandidateRepository) {
        this.roadIssueRepository = roadIssueRepository;
        this.duplicateCandidateRepository = duplicateCandidateRepository;
    }

    public static double calculateHaversineDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @Transactional
    public RoadIssue checkAndLinkDuplicates(RoadIssue newIssue) {
        List<RoadIssue> potentialCandidates = roadIssueRepository.findAllPrimaryIssues();

        RoadIssue bestMatch = null;
        double bestSimilarity = 0.0;
        double minDistance = Double.MAX_VALUE;

        for (RoadIssue existing : potentialCandidates) {
            if (existing.getId().equals(newIssue.getId())) continue;

            double distance = calculateHaversineDistanceMeters(
                    newIssue.getLatitude(), newIssue.getLongitude(),
                    existing.getLatitude(), existing.getLongitude()
            );

            if (distance <= DUPLICATE_RADIUS_METERS) {
                // Similarity calculation
                double distScore = Math.max(0.0, 1.0 - (distance / DUPLICATE_RADIUS_METERS));
                double typeScore = existing.getDamageType().equalsIgnoreCase(newIssue.getDamageType()) ? 1.0 : 0.4;
                double totalSimilarity = (distScore * 0.6) + (typeScore * 0.4);

                // Save duplicate candidate record
                if (!duplicateCandidateRepository.existsByPrimaryIssueAndDuplicateIssue(existing, newIssue)) {
                    IssueDuplicateCandidate candidate = new IssueDuplicateCandidate(existing, newIssue, distance, totalSimilarity);
                    duplicateCandidateRepository.save(candidate);
                }

                if (totalSimilarity > 0.65 && totalSimilarity > bestSimilarity) {
                    bestSimilarity = totalSimilarity;
                    bestMatch = existing;
                    minDistance = distance;
                }
            }
        }

        if (bestMatch != null) {
            logger.info("Auto-linking duplicate issue {} -> primary issue {} (distance: {}m, similarity: {})",
                    newIssue.getReferenceCode(), bestMatch.getReferenceCode(), minDistance, bestSimilarity);
            newIssue.setParentIssue(bestMatch);
            bestMatch.setDuplicateCount(bestMatch.getDuplicateCount() + 1);
            roadIssueRepository.save(bestMatch);
        }

        return bestMatch;
    }

    @Transactional
    public void mergeIssues(Long primaryIssueId, Long duplicateIssueId) {
        RoadIssue primary = roadIssueRepository.findById(primaryIssueId)
                .orElseThrow(() -> new IllegalArgumentException("Primary issue not found"));
        RoadIssue duplicate = roadIssueRepository.findById(duplicateIssueId)
                .orElseThrow(() -> new IllegalArgumentException("Duplicate issue not found"));

        duplicate.setParentIssue(primary);
        duplicate.setStatus("MERGED");
        roadIssueRepository.save(duplicate);

        primary.setDuplicateCount(primary.getDuplicateCount() + 1);
        roadIssueRepository.save(primary);

        duplicateCandidateRepository.findByPrimaryIssueId(primaryIssueId).stream()
                .filter(c -> c.getDuplicateIssue().getId().equals(duplicateIssueId))
                .findFirst()
                .ifPresent(c -> {
                    c.setIsMerged(true);
                    c.setMergedAt(LocalDateTime.now());
                    duplicateCandidateRepository.save(c);
                });
    }
}
