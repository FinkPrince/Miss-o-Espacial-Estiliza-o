package com.space.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "satelites")
public class Satelite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    @NotNull(message = "Massa é obrigatória")
    @Min(0)
    private Double massa;
    @NotNull(message = "Energia é obrigatória")
    @Min(0) @Max(100)
    private Double energia;
    
    @NotBlank
    private String orbita;       // LEO | GEO | LUNAR
    private String funcao;       // Espionagem | Localização / GPS | Comunicação
    private String tempoOrbita;  // 7 meses | 1 ano e 4 meses | 2 anos
    private String status = "Inativo";
    public Satelite() {}

    public Satelite(String nome, Double massa, Double energia,
                    String orbita, String funcao, String tempoOrbita) {
        this.nome        = nome;
        this.massa       = massa;
        this.energia     = energia;
        this.orbita      = orbita;
        this.funcao      = funcao;
        this.tempoOrbita = tempoOrbita;
        this.status      = "Inativo";
    }

    public Long   getId()                    { return id; }
    public void   setId(Long id)             { this.id = id; }
    public String getNome()                  { return nome; }
    public void   setNome(String nome)       { this.nome = nome; }
    public Double getMassa()                 { return massa; }
    public void   setMassa(Double massa)     { this.massa = massa; }
    public Double getEnergia()               { return energia; }
    public void   setEnergia(Double energia) { this.energia = energia; }
    public String getOrbita()                { return orbita; }
    public void   setOrbita(String orbita)   { this.orbita = orbita; }
    public String getFuncao()                { return funcao; }
    public void   setFuncao(String funcao)   { this.funcao = funcao; }
    public String getTempoOrbita()                   { return tempoOrbita; }
    public void   setTempoOrbita(String tempoOrbita) { this.tempoOrbita = tempoOrbita; }
    public String getStatus()                { return status; }
    public void   setStatus(String status)   { this.status = status; }
}
