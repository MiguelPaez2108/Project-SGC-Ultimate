package com.project_sgc_ultimate.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "notificaciones")
public class Notificacion {

    @Id
    private String id;

    @NotNull(message = "El usuario es obligatorio.")
    private String usuarioId;

    @NotNull(message = "El tipo de notificación es obligatorio.")
    private TipoNotificacion tipo;

    @NotBlank(message = "El mensaje de la notificación es obligatorio.")
    private String mensaje;

    private Boolean leida;

    private LocalDateTime fechaEnvio;

    public enum TipoNotificacion {
        RESERVA_CREADA,
        RESERVA_CANCELADA,
        RESERVA_CONFIRMADA,
        PAGO_CONFIRMADO,
        RECORDATORIO
    }
}
