package com.project_sgc_ultimate.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ReservaResponseDTO {
    private String id;
    private String canchaId;
    private String canchaNombre;
    private String usuarioId;
    private String usuarioNombre;
    private String estado;
    private BigDecimal precioTotal;
    private String fechaInicio;
    private String fechaFin;
}
