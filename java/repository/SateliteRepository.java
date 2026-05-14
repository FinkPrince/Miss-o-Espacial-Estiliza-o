package com.space.backend.repository;

import com.space.backend.model.Satelite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SateliteRepository extends JpaRepository<Satelite, Long> {}

