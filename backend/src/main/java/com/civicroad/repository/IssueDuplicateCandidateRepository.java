package com.civicroad.repository;

import com.civicroad.entity.IssueDuplicateCandidate;
import com.civicroad.entity.RoadIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueDuplicateCandidateRepository extends JpaRepository<IssueDuplicateCandidate, Long> {
    List<IssueDuplicateCandidate> findByPrimaryIssue(RoadIssue primaryIssue);
    List<IssueDuplicateCandidate> findByPrimaryIssueId(Long primaryIssueId);
    List<IssueDuplicateCandidate> findByDuplicateIssue(RoadIssue duplicateIssue);
    boolean existsByPrimaryIssueAndDuplicateIssue(RoadIssue primary, RoadIssue duplicate);
}
