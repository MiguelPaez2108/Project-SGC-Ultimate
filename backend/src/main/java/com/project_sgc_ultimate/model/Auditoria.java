package com.project_sgc_ultimate.model;

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
@Document(collection = "auditorias")
public class Auditoria {

    @Id
    private String id;

    private String entidad;       // Ej: "Cancha", "Usuario", "Reserva"
    private String entidadId;     // ID del documento afectado
    private String usuarioId;     // Quien hizo el cambio (si aplica)

    private Accion accion;        // CREACION, ACTUALIZACION, etc.
    private LocalDateTime fechaHora;

    private String detalle;       // Texto libre: qué se hizo

    public enum Accion {
        CREACION,
        ACTUALIZACION,
        ELIMINACION,
        LOGIN,
        LOGOUT,
        RESERVA,
        PAGO
    }
}
