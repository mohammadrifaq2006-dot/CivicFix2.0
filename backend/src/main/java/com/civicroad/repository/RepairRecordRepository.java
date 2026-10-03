package com.civicroad.repository;

import com.civicroad.entity.RepairRecord;
import com.civicroad.entity.RoadIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepairRecordRepository extends JpaRepository<RepairRecord, Long> {
    Optional<RepairRecord> findByIssue(RoadIssue issue);
    Optional<RepairRecord> findByIssueId(Long issueId);
}
