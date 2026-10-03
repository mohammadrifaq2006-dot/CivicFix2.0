package com.civicroad.repository;

import com.civicroad.entity.CitizenProfile;
import com.civicroad.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, Long> {
    Optional<CitizenProfile> findByUser(User user);
    Optional<CitizenProfile> findByUserId(Long userId);
}
