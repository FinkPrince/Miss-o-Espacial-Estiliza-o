package com.space.backend.service;

import com.space.backend.model.Astronauta;
import com.space.backend.repository.AstronautaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AstronautaService {

    private final AstronautaRepository repo;
    public AstronautaService(AstronautaRepository repo) { this.repo = repo; }

    public List<Astronauta> listar() { return repo.findAll(); }
    public Astronauta salvar(Astronauta a) { return repo.save(a); }

    public void deletar(Long id) {
        repo.deleteById(id);
    }
}
