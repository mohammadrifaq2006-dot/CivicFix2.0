package com.civicroad.repository;

import com.civicroad.entity.AIAnalysis;
import com.civicroad.entity.RoadIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {
    Optional<AIAnalysis> findByIssue(RoadIssue issue);
    Optional<AIAnalysis> findByIssueId(Long issueId);
}
