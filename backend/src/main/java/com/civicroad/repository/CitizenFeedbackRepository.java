package com.civicroad.repository;

import com.civicroad.entity.CitizenFeedback;
import com.civicroad.entity.RoadIssue;
import com.civicroad.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CitizenFeedbackRepository extends JpaRepository<CitizenFeedback, Long> {
    List<CitizenFeedback> findByIssue(RoadIssue issue);
    Optional<CitizenFeedback> findByIssueAndCitizen(RoadIssue issue, User citizen);
}
