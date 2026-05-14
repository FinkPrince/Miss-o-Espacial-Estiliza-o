package com.space.backend.controller;

import com.space.backend.service.SimulacaoService;
import com.space.backend.service.SimulacaoService.ResultadoLancamento;
import com.space.backend.service.SimulacaoService.TrajetoriaResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulacao")
@CrossOrigin(origins = "*")
public class SimulacaoController {

    private final SimulacaoService service;

    public SimulacaoController(SimulacaoService service) {
        this.service = service;
    }

    // POST /api/simulacao/lancar
    // Body: { "fogueteId": 1, "sateliteId": 2 }
    //   sateliteId é opcional — omita ou envie null para lançar sem satélite
    @PostMapping("/lancar")
    public ResponseEntity<ResultadoLancamento> lancar(@RequestBody Map<String, Object> body) {
        Long fogueteId  = toLong(body.get("fogueteId"));
        Long sateliteId = (body.containsKey("sateliteId") && body.get("sateliteId") != null)
                ? toLong(body.get("sateliteId")) : null;

        return ResponseEntity.ok(service.simular(fogueteId, sateliteId));
    }

    // GET /api/simulacao/trajetoria/{fogueteId}
    @GetMapping("/trajetoria/{fogueteId}")
    public ResponseEntity<TrajetoriaResponse> trajetoria(@PathVariable Long fogueteId) {
        return ResponseEntity.ok(service.calcularTrajetoria(fogueteId));
    }

    private Long toLong(Object val) {
        if (val == null) throw new IllegalArgumentException("ID não pode ser nulo");
        return val instanceof Number n ? n.longValue() : Long.parseLong(val.toString());
    }
}