package com.space.backend.service;

import com.space.backend.model.Usuario;
import com.space.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    public UsuarioService(UsuarioRepository repo) { this.repo = repo; }

    public void cadastrar(String nome, String senha) {
        if (repo.findByNome(nome).isPresent())
            throw new RuntimeException("Nome já cadastrado");
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setSenha(senha); // sem criptografia por enquanto, igual seu padrão
        repo.save(u);
    }

    public Usuario autenticar(String nome, String senha) {
        Usuario u = repo.findByNome(nome)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (!u.getSenha().equals(senha))
            throw new RuntimeException("Senha incorreta");
        return u;
    }
}