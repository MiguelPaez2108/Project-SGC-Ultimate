// UsuarioRequestDTO.java
package com.project_sgc_ultimate.dto;

import lombok.Data;

@Data
public class UsuarioRequestDTO {
    private String nombreCompleto;
    private String email;
    private String password; // texto plano que viene del cliente
    private String rol;      // "ADMIN", "CLIENTE", "EMPLEADO"
}
