package com.project_sgc_ultimate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificacionRequestDTO {
    @NotBlank(message = "El ID del usuario es obligatorio.")
    private String usuarioId;

    @NotNull(message = "El tipo de notificación es obligatorio.")
    private String tipo; // RESERVA_CREADA, etc.

    @NotBlank(message = "El mensaje es obligatorio.")
    private String mensaje;
}
