package com.space.backend.controller;

import com.space.backend.model.Usuario;
import com.space.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService service;
    public UsuarioController(UsuarioService service) { this.service = service; }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> body) {
        try {
            service.cadastrar(body.get("nome"), body.get("senha"));
            return ResponseEntity.ok(Map.of("mensagem", "Conta criada com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            Usuario u = service.autenticar(body.get("nome"), body.get("senha"));
            return ResponseEntity.ok(Map.of("mensagem", "Autenticado", "usuario", u.getNome()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("erro", e.getMessage()));
        }
    }
}