package com.project_sgc_ultimate.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "reservas")
public class Reserva {

    @Id
    private String id;

    private String canchaId;
    private String usuarioId;

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    private BigDecimal precioTotal;

    private EstadoReserva estado;

    public enum EstadoReserva {
        PENDIENTE,
        CONFIRMADA,
        CANCELADA,
        COMPLETADA   // 👈👈👈 ESTA ES LA QUE FALTABA
    }
}

