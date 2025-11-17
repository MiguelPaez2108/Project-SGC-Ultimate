package com.project_sgc_ultimate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PagoRequestDTO {
    @NotBlank(message = "El ID de la reserva es obligatorio.")
    private String reservaId;

    @NotNull(message = "El monto es obligatorio.")
    @Positive(message = "El monto debe ser mayor que cero.")
    private BigDecimal monto;

    @NotNull(message = "El método de pago es obligatorio.")
    private String metodo; // EFECTIVO, TARJETA, etc.
}
