package com.space.backend.service;

import com.space.backend.model.Foguete;
import com.space.backend.repository.FogueteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FogueteService {

    private final FogueteRepository repo;

    public FogueteService(FogueteRepository repo) {
        this.repo = repo;
    }

    public List<Foguete> listar() {
        return repo.findAll();
    }

    public Foguete buscar(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Foguete não encontrado: " + id));
    }

    public Foguete registrar(String nome, Double carga, Double combustivel,
                             Double temperatura, String status) {
        Foguete f = new Foguete(nome, carga, combustivel, temperatura, status);
        return repo.save(f);
    }

    public Foguete salvar(Foguete f) {
        return repo.save(f);
    }

    public void deletar(Long id) {
        if (!repo.existsById(id))
            throw new RuntimeException("Foguete não encontrado: " + id);
        repo.deleteById(id);
    }
}