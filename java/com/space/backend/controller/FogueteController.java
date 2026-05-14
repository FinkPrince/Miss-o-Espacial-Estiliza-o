package com.space.backend.controller;

import com.space.backend.model.Foguete;
import com.space.backend.service.FogueteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/foguetes")
@CrossOrigin(origins = "*")
public class FogueteController {

    private final FogueteService service;

    public FogueteController(FogueteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Foguete> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Foguete> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscar(id));
    }

    @PostMapping
    public ResponseEntity<Foguete> registrar(@RequestBody Map<String, Object> body) {
        Foguete salvo = service.registrar(
                (String) body.get("nome"),
                toDouble(body.get("carga")),
                toDouble(body.get("combustivel")),
                toDouble(body.get("temperatura")),
                (String) body.get("status")
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
