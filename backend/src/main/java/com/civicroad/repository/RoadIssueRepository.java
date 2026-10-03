package com.civicroad.repository;

import com.civicroad.entity.Area;
import com.civicroad.entity.Road;
import com.civicroad.entity.RoadIssue;
import com.civicroad.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadIssueRepository extends JpaRepository<RoadIssue, Long> {
    Optional<RoadIssue> findByReferenceCode(String referenceCode);

    List<RoadIssue> findByCitizenOrderByCreatedAtDesc(User citizen);

    List<RoadIssue> findByAssignedOfficerOrderByPriorityScoreDesc(User officer);

    List<RoadIssue> findByArea(Area area);

    List<RoadIssue> findByRoad(Road road);

    List<RoadIssue> findByStatus(String status);

    List<RoadIssue> findByIsEscalatedTrue();

    long countByStatus(String status);

    long countBySeverity(String severity);

    long countByIsEscalated(Boolean isEscalated);

    @Query("SELECT r FROM RoadIssue r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:severity IS NULL OR r.severity = :severity) AND " +
           "(:damageType IS NULL OR r.damageType = :damageType) AND " +
           "(:areaId IS NULL OR r.area.id = :areaId) AND " +
           "(:officerId IS NULL OR r.assignedOfficer.id = :officerId) AND " +
           "(:search IS NULL OR LOWER(r.referenceCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.address) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " (r.road IS NOT NULL AND LOWER(r.road.name) LIKE LOWER(CONCAT('%', :search, '%')))) " +
           "ORDER BY r.priorityScore DESC, r.createdAt DESC")
    Page<RoadIssue> filterIssues(
            @Param("status") String status,
            @Param("severity") String severity,
            @Param("damageType") String damageType,
            @Param("areaId") Long areaId,
            @Param("officerId") Long officerId,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT r FROM RoadIssue r WHERE r.parentIssue IS NULL ORDER BY r.priorityScore DESC")
    List<RoadIssue> findAllPrimaryIssues();

    @Query("SELECT r FROM RoadIssue r WHERE r.parentIssue.id = :parentId ORDER BY r.createdAt ASC")
    List<RoadIssue> findChildrenByParentId(@Param("parentId") Long parentId);
}
