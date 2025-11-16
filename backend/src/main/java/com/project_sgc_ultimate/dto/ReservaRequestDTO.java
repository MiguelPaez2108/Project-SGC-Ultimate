package com.project_sgc_ultimate.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservaRequestDTO {
    private String canchaId;
    private String usuarioId;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
}
