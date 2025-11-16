package com.project_sgc_ultimate.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "reservas")
public class Reserva {

    @Id
    private String id;

    @NotNull(message = "La cancha es obligatoria.")
    private String canchaId;

    @NotNull(message = "El usuario es obligatorio.")
    private String usuarioId;

    @NotNull(message = "La fecha de la reserva es obligatoria.")
    private LocalDate fecha;

    @NotNull(message = "La hora de inicio es obligatoria.")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria.")
    private LocalTime horaFin;

    private EstadoReserva estado;

    private BigDecimal precioTotal;

    private LocalDateTime fechaInicio;
    
    private LocalDateTime fechaFin;

    public enum EstadoReserva {
        PENDIENTE,
        CONFIRMADA,
        CANCELADA,
        FINALIZADA
    }
}
