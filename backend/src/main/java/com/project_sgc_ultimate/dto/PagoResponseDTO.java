package com.project_sgc_ultimate.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PagoResponseDTO {
    private String id;
    private String reservaId;
    private BigDecimal monto;
    private String metodo;
    private String estado;
    private String fechaPago;
}
