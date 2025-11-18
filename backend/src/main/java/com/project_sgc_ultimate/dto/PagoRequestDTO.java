package com.project_sgc_ultimate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PagoRequestDTO {

    private String reservaId;
    private BigDecimal monto;
    private String metodo;      // EFECTIVO, TARJETA, etc.
    private String referencia;  // opcional
}
