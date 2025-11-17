package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.AuditoriaResponseDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.service.AuditoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auditorias")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas las auditorías")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de auditorías obtenida exitosamente")
    })
    public ResponseEntity<List<AuditoriaResponseDTO>> listarTodas() {
        List<Auditoria> auditorias = auditoriaService.listarTodas();
        List<AuditoriaResponseDTO> respuesta = auditorias.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    private AuditoriaResponseDTO mapToResponseDto(Auditoria auditoria) {
        return AuditoriaResponseDTO.builder()
                .id(auditoria.getId())
                .entidad(auditoria.getEntidad())
                .entidadId(auditoria.getEntidadId())
                .usuarioId(auditoria.getUsuarioId())
                .accion(auditoria.getAccion() != null ? auditoria.getAccion().name() : null)
                .detalles(auditoria.getDetalle())
                .fecha(auditoria.getFechaHora() != null ? auditoria.getFechaHora().toString() : null)
                .build();
    }
}
