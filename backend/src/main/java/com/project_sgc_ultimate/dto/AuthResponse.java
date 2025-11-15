package com.project_sgc_ultimate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String usuarioId;
    private String rol;
}
