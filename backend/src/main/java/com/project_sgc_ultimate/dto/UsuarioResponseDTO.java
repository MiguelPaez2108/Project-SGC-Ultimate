package com.project_sgc_ultimate.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioResponseDTO {
    private String id;
    private String nombreCompleto;
    private String email;
    private String rol;
}
