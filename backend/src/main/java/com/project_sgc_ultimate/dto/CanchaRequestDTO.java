package com.project_sgc_ultimate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CanchaRequestDTO {
    @NotBlank(message = "El nombre de la cancha es obligatorio.")
    private String nombre;

    @NotNull(message = "El tipo de cancha es obligatorio.")
    private String tipo; // FUTSAL, FUTBOL_5, etc.

    private String ubicacion;

    @NotNull(message = "El precio por hora es obligatorio.")
    @Positive(message = "El precio por hora debe ser mayor que cero.")
    private BigDecimal precioPorHora;

    private Boolean techada;
}
