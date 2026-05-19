package com.space.backend.controller;

import com.space.backend.model.Astronauta;
import com.space.backend.service.AstronautaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/astronautas")
@CrossOrigin(origins = "*")
public class AstronautaController {

    private final AstronautaService service;
    public AstronautaController(AstronautaService service) { this.service = service; }

    @GetMapping
    public List<Astronauta> listar() { return service.listar(); }

    @PostMapping
    public Astronauta salvar(@RequestBody Astronauta astronauta) {
        return service.salvar(astronauta);
    }
}
