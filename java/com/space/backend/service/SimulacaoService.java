package com.space.backend.service;

import com.space.backend.model.Foguete;
import com.space.backend.model.Satelite;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SimulacaoService {

    private final FogueteService  fogueteService;
    private final SateliteService sateliteService;

    public SimulacaoService(FogueteService fogueteService, SateliteService sateliteService) {
        this.fogueteService  = fogueteService;
        this.sateliteService = sateliteService;
    }

    // ── Records de resposta ──────────────────────────

    public record LogEntry(String txt, String cor) {}

    public record ResultadoLancamento(
            boolean sucesso,
            double  combustivelFinal,
            double  temperaturaFinal,
            Double  energiaSatelite,
            String  statusMissao,
            List<LogEntry> log
    ) {}

    public record PontoTrajetoria(double x, double y, String label) {}

    public record TrajetoriaResponse(
            String nomeFoguete,
            double combustivel,
            double temperatura,
            String status,
            List<PontoTrajetoria> pontos
    ) {}

    // ── Simulação de Lançamento ──────────────────────

    public ResultadoLancamento simular(Long fogueteId, Long sateliteId) {

        Foguete  f = fogueteService.buscar(fogueteId);
        Satelite s = (sateliteId != null) ? sateliteService.buscar(sateliteId) : null;

        List<LogEntry> log = new ArrayList<>();

        log.add(new LogEntry("> INICIANDO LANÇAMENTO...", "azul"));
        log.add(new LogEntry("> Foguete: " + f.getNome()
                + " | Combustível: " + f.getCombustivel() + " L", ""));

        if (f.getTemperatura() > 70) {
            log.add(new LogEntry("> ⚠ Temperatura ALTA: " + f.getTemperatura()
                    + "°C — resfriando...", "amarelo"));
        } else {
            log.add(new LogEntry("> ✓ Temperatura normal: " + f.getTemperatura() + "°C", "verde"));
        }

        double novoCombustivel = f.getCombustivel() + 100;
        f.setCombustivel(novoCombustivel);
        log.add(new LogEntry("> Abastecimento: +100 L → Total: " + novoCombustivel + " L", ""));
        log.add(new LogEntry("> 5... 4... 3... 2... 1...", ""));

        boolean sucesso = novoCombustivel > 400;
        Double  energiaSatelite = null;

        if (sucesso) {
            log.add(new LogEntry("> LANÇAMENTO BEM-SUCEDIDO!", "verde"));
            f.setStatus("Lançado");

            if (s != null) {
                log.add(new LogEntry("> Separando satélite " + s.getNome() + "...", ""));
                double novaEnergia = Math.min(100, s.getEnergia() + 20);
                s.setEnergia(novaEnergia);
                s.setStatus("Ativo");
                energiaSatelite = novaEnergia;
                log.add(new LogEntry("> ✓ Satélite em órbita " + s.getOrbita()
                        + " | Energia: " + novaEnergia + "%", "verde"));
                log.add(new LogEntry("> ✓ MISSÃO CONCLUÍDA!", "verde"));
                sateliteService.salvar(s);
            } else {
                log.add(new LogEntry("> ✓ LANÇAMENTO CONCLUÍDO!", "verde"));
            }
        } else {
            log.add(new LogEntry("> ✗ FALHA! Combustível insuficiente: "
                    + novoCombustivel + " L (mínimo: 400 L)", "vermelho"));
            f.setStatus("Falha");
            log.add(new LogEntry("> ✗ MISSÃO FALHOU!", "vermelho"));
        }

        fogueteService.salvar(f);

        return new ResultadoLancamento(
                sucesso,
                f.getCombustivel(),
                f.getTemperatura(),
                energiaSatelite,
                f.getStatus(),
                log
        );
    }

    // ── Trajetória ───────────────────────────────────

    public TrajetoriaResponse calcularTrajetoria(Long fogueteId) {

        Foguete f    = fogueteService.buscar(fogueteId);
        double  seed = fogueteId;

        List<PontoTrajetoria> pontos = List.of(
                new PontoTrajetoria(80,                  340,             "Terra"),
                new PontoTrajetoria(80  + seed * 60,     260 - seed * 10, "Ignição"),
                new PontoTrajetoria(200 + seed * 50,     180 - seed * 15, "Atmosfera"),
                new PontoTrajetoria(340 + seed * 40,     100 - seed * 5,  "Órbita")
        );

        return new TrajetoriaResponse(
                f.getNome(),
                f.getCombustivel(),
                f.getTemperatura(),
                f.getStatus(),
                pontos
        );
    }
}