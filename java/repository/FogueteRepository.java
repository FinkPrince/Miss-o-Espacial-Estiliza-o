package com.space.backend.repository;

import com.space.backend.model.Foguete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FogueteRepository extends JpaRepository<Foguete, Long> {}
