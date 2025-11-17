package com.project_sgc_ultimate.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificacionResponseDTO {
    private String id;
    private String usuarioId;
    private String tipo;
    private String mensaje;
    private Boolean leida;
    private String fechaEnvio;
}
