package com.project_sgc_ultimate.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
@Document(collection = "pagos")
public class Pago {

    @Id
    private String id;

    @NotNull(message = "La reserva asociada es obligatoria.")
    private String reservaId;

    @NotNull(message = "El monto es obligatorio.")
    @Positive(message = "El monto debe ser mayor que cero.")
    private BigDecimal monto;

    @NotNull(message = "El método de pago es obligatorio.")
    private MetodoPago metodo;

    @NotNull(message = "El estado del pago es obligatorio.")
    private EstadoPago estado;

    private LocalDateTime fechaPago;

    public enum MetodoPago {
        EFECTIVO,
        TARJETA,
        TRANSFERENCIA,
        NEQUI,
        DAVIPLATA,
        OTRO
    }

    public enum EstadoPago {
        PENDIENTE,
        COMPLETADO,
        FALLIDO,
        REEMBOLSADO
    }
}
