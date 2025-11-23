package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.CanchaRequestDTO;
import com.project_sgc_ultimate.dto.CanchaResponseDTO;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.service.CanchaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/canchas")
@RequiredArgsConstructor
public class CanchaController {

    private final CanchaService canchaService;

    @GetMapping
    @Operation(summary = "Listar todas las canchas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de canchas obtenida exitosamente")
    })
    public ResponseEntity<List<CanchaResponseDTO>> obtenerTodas() {
        List<Cancha> canchas = canchaService.listarTodas();
        List<CanchaResponseDTO> respuesta = canchas.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/activas")
    @Operation(summary = "Listar canchas activas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de canchas activas obtenida exitosamente")
    })
    public ResponseEntity<List<CanchaResponseDTO>> obtenerActivas() {
        List<Cancha> canchas = canchaService.listarActivas();
        List<CanchaResponseDTO> respuesta = canchas.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener cancha por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cancha encontrada"),
        @ApiResponse(responseCode = "404", description = "Cancha no encontrada")
    })
    public ResponseEntity<CanchaResponseDTO> obtenerPorId(@PathVariable String id) {
        Cancha cancha = canchaService.buscarPorId(id);
        return ResponseEntity.ok(mapToResponseDto(cancha));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear nueva cancha")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Cancha creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<CanchaResponseDTO> crear(@Valid @RequestBody CanchaRequestDTO dto) {
        Cancha creada = canchaService.crearDesdeDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDto(creada));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar cancha")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cancha actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cancha no encontrada"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<CanchaResponseDTO> actualizar(
            @PathVariable String id,
            @Valid @RequestBody CanchaRequestDTO dto
    ) {
        Cancha actualizada = canchaService.actualizarDesdeDto(id, dto);
        return ResponseEntity.ok(mapToResponseDto(actualizada));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar cancha")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Cancha eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cancha no encontrada")
    })
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        canchaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private CanchaResponseDTO mapToResponseDto(Cancha cancha) {
        return CanchaResponseDTO.builder()
                .id(cancha.getId())
                .nombre(cancha.getNombre())
                .tipo(cancha.getTipo() != null ? cancha.getTipo().name() : null)
                .ubicacion(cancha.getUbicacion())
                .precioPorHora(cancha.getPrecioPorHora())
                .estado(cancha.getEstado() != null ? cancha.getEstado().name() : null)
                .techada(cancha.getTechada())
                .imagenUrl(cancha.getImagenUrl())
                .build();
    }
}
