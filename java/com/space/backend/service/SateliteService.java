package com.space.backend.service;

import com.space.backend.model.Satelite;
import com.space.backend.repository.SateliteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SateliteService {

    private final SateliteRepository repo;

    public SateliteService(SateliteRepository repo) {
        this.repo = repo;
    }

    public List<Satelite> listar() {
        return repo.findAll();
    }

    public Satelite buscar(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Satélite não encontrado: " + id));
    }

    public Satelite registrar(String nome, Double massa, Double energia,
                              String orbita, String funcao, String tempoOrbita) {
        Satelite s = new Satelite(nome, massa, energia, orbita, funcao, tempoOrbita);
        return repo.save(s);
    }

    public Satelite salvar(Satelite s) {
        return repo.save(s);
    }

    public void deletar(Long id) {
        if (!repo.existsById(id))
            throw new RuntimeException("Satélite não encontrado: " + id);
        repo.deleteById(id);
    }
}