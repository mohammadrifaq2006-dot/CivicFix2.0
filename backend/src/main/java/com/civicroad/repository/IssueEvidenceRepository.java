package com.civicroad.repository;

import com.civicroad.entity.IssueEvidence;
import com.civicroad.entity.RoadIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueEvidenceRepository extends JpaRepository<IssueEvidence, Long> {
    List<IssueEvidence> findByIssueOrderByCreatedAtAsc(RoadIssue issue);
    List<IssueEvidence> findByIssueId(Long issueId);
}
