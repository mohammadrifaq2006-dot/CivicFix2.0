package com.civicroad.repository;

import com.civicroad.entity.Area;
import com.civicroad.entity.AuthorityOfficer;
import com.civicroad.entity.Department;
import com.civicroad.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorityOfficerRepository extends JpaRepository<AuthorityOfficer, Long> {
    Optional<AuthorityOfficer> findByUser(User user);
    Optional<AuthorityOfficer> findByUserId(Long userId);
    List<AuthorityOfficer> findByDepartment(Department department);
    List<AuthorityOfficer> findByJurisdictionArea(Area area);
}
