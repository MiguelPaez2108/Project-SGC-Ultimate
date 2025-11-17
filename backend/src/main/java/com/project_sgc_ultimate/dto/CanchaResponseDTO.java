package com.project_sgc_ultimate.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CanchaResponseDTO {
    private String id;
    private String nombre;
    private String tipo;
    private String ubicacion;
    private BigDecimal precioPorHora;
    private String estado;
    private Boolean techada;
}
