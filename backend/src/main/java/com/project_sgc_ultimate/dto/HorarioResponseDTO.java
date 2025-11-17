package com.project_sgc_ultimate.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HorarioResponseDTO {
    private String id;
    private String canchaId;
    private String diaSemana;
    private String horaInicio;
    private String horaFin;
    private Boolean activo;
}
