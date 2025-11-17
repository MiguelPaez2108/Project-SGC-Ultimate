package com.project_sgc_ultimate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HorarioRequestDTO {
    @NotBlank(message = "El ID de la cancha es obligatorio.")
    private String canchaId;

    @NotNull(message = "El día de la semana es obligatorio.")
    private String diaSemana; // LUNES, MARTES, etc.

    @NotNull(message = "La hora de inicio es obligatoria.")
    private String horaInicio; // HH:mm

    @NotNull(message = "La hora de fin es obligatoria.")
    private String horaFin; // HH:mm

    private Boolean activo;
}
