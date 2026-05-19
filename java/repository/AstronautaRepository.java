package com.space.backend.repository;

import com.space.backend.model.Astronauta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AstronautaRepository extends JpaRepository<Astronauta, Long> {}
