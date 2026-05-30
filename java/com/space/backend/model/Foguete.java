package com.space.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "foguetes")
public class Foguete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;
    @NotNull(message = "Carga é obrigatória")
    @Min(value = 0, message = "Carga não pode ser negativa")
    private Double carga;
    @NotNull(message = "Combustível é obrigatório")
    @Min(value = 0, message = "Combustível não pode ser negativo")
    private Double combustivel;
    @NotNull(message = "Temperatura é obrigatória")
    private Double temperatura;
    @NotBlank(message = "Status é obrigatório")
    private String status;

    public Foguete() {}

    public Foguete(String nome, Double carga, Double combustivel, Double temperatura, String status) {
        this.nome        = nome;
        this.carga       = carga;
        this.combustivel = combustivel;
        this.temperatura = temperatura;
        this.status      = status;
    }

    public Long   getId()                    { return id; }
    public void   setId(Long id)             { this.id = id; }
    public String getNome()                  { return nome; }
    public void   setNome(String nome)       { this.nome = nome; }
    public Double getCarga()                 { return carga; }
    public void   setCarga(Double carga)     { this.carga = carga; }
    public Double getCombustivel()                   { return combustivel; }
    public void   setCombustivel(Double combustivel) { this.combustivel = combustivel; }
    public Double getTemperatura()                   { return temperatura; }
    public void   setTemperatura(Double temperatura) { this.temperatura = temperatura; }
    public String getStatus()                { return status; }
    public void   setStatus(String status)   { this.status = status; }
}
