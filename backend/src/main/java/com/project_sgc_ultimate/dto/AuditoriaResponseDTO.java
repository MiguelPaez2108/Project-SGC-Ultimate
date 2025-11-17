package com.project_sgc_ultimate.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuditoriaResponseDTO {
    private String id;
    private String entidad;
    private String entidadId;
    private String usuarioId;
    private String accion;
    private String fecha;
    private String detalles;
}
