package com.space.backend.controller;

import com.space.backend.model.Satelite;
import com.space.backend.service.SateliteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/satelites")
@CrossOrigin(origins = "*")
public class SateliteController {

    private final SateliteService service;

    public SateliteController(SateliteService service) {
        this.service = service;
    }
    @GetMapping
    public List<Satelite> listar() {
        return service.listar();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Satelite> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscar(id));
    }

    @PostMapping
    public ResponseEntity<Satelite> registrar(@RequestBody Map<String, Object> body) {
        Satelite salvo = service.registrar(
                (String) body.get("nome"),
                toDouble(body.get("massa")),
                toDouble(body.get("energia")),
                (String) body.get("orbita"),
                (String) body.get("funcao"),
                (String) body.get("tempoOrbita")
        );
        return ResponseEntity.status(201).body(salvo);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    private Double toDouble(Object val) {
        if (val == null) return null;
        return val instanceof Number n ? n.doubleValue() : Double.parseDouble(val.toString());
    }
}
