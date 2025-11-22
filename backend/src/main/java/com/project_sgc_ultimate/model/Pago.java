package com.project_sgc_ultimate.model;

import lombok.*;
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

    private String reservaId;
    
    private String usuarioId;

    private BigDecimal monto;

    private MetodoPago metodo;

    private EstadoPago estado;

    private LocalDateTime fechaPago;

    private String referencia; // id de transacción, comprobante, etc.

    public enum MetodoPago {
        EFECTIVO,
        TARJETA,
        TRANSFERENCIA,
        NEQUI,
        DAVIPLATA
    }

    public enum EstadoPago {
        PENDIENTE,
        PAGADO,
        FALLIDO
    }
}
