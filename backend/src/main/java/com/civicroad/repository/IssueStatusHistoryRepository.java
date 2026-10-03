package com.civicroad.repository;

import com.civicroad.entity.IssueStatusHistory;
import com.civicroad.entity.RoadIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueStatusHistoryRepository extends JpaRepository<IssueStatusHistory, Long> {
    List<IssueStatusHistory> findByIssueOrderByCreatedAtDesc(RoadIssue issue);
    List<IssueStatusHistory> findByIssueIdOrderByCreatedAtDesc(Long issueId);
}
