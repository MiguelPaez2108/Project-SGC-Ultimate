package com.project_sgc_ultimate.dto;

import com.project_sgc_ultimate.model.Pago;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PagoResponseDTO {

    private String id;
    private String reservaId;
    private BigDecimal monto;
    private String metodo;
    private String estado;
    private LocalDateTime fechaPago;
    private String referencia;

    public static PagoResponseDTO fromEntity(Pago pago) {
        return PagoResponseDTO.builder()
                .id(pago.getId())
                .reservaId(pago.getReservaId())
                .monto(pago.getMonto())
                .metodo(pago.getMetodo() != null ? pago.getMetodo().name() : null)
                .estado(pago.getEstado() != null ? pago.getEstado().name() : null)
                .fechaPago(pago.getFechaPago())
                .referencia(pago.getReferencia())
                .build();
    }
}
