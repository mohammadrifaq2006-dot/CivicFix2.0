package com.civicroad.repository;

import com.civicroad.entity.Area;
import com.civicroad.entity.Road;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadRepository extends JpaRepository<Road, Long> {
    List<Road> findByArea(Area area);
    Optional<Road> findByNameIgnoreCase(String name);
}
