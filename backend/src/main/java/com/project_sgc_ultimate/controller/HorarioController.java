package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.HorarioRequestDTO;
import com.project_sgc_ultimate.dto.HorarioResponseDTO;
import com.project_sgc_ultimate.model.Horario;
import com.project_sgc_ultimate.service.HorarioService;
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
@RequestMapping("/api/horarios")
@RequiredArgsConstructor
public class HorarioController {

    private final HorarioService horarioService;

    @GetMapping
    @Operation(summary = "Listar todos los horarios")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de horarios obtenida exitosamente")
    })
    public ResponseEntity<List<HorarioResponseDTO>> listarTodos() {
        List<Horario> horarios = horarioService.listarTodos();

        List<HorarioResponseDTO> respuesta = horarios.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/por-cancha/{canchaId}")
    @Operation(summary = "Listar horarios por cancha")
    public ResponseEntity<List<HorarioResponseDTO>> listarPorCancha(@PathVariable String canchaId) {
        List<Horario> horarios = horarioService.listarPorCancha(canchaId);

        List<HorarioResponseDTO> respuesta = horarios.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener horario por ID")
    public ResponseEntity<HorarioResponseDTO> obtenerPorId(@PathVariable String id) {
        Horario horario = horarioService.buscarPorId(id);
        return ResponseEntity.ok(mapToResponseDto(horario));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear nuevo horario")
    public ResponseEntity<HorarioResponseDTO> crear(@Valid @RequestBody HorarioRequestDTO dto) {
        Horario creado = horarioService.crearDesdeDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDto(creado));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar horario")
    public ResponseEntity<HorarioResponseDTO> actualizar(
            @PathVariable String id,
            @Valid @RequestBody HorarioRequestDTO dto
    ) {
        Horario actualizado = horarioService.actualizarDesdeDto(id, dto);
        return ResponseEntity.ok(mapToResponseDto(actualizado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar horario")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        horarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

   
    // MAPEO A DTO  (NO BORRAR)
  
    private HorarioResponseDTO mapToResponseDto(Horario horario) {
        return HorarioResponseDTO.builder()
                .id(horario.getId())
                .canchaId(horario.getCanchaId())
                .diaSemana(horario.getDiaSemana() != null ? horario.getDiaSemana().name() : null)
                .horaInicio(horario.getHoraInicio() != null ? horario.getHoraInicio().toString() : null)
                .horaFin(horario.getHoraFin() != null ? horario.getHoraFin().toString() : null)
                .activo(horario.isActivo())  // <- AQUÍ EL CAMBIO CORRECTO
                .build();
    }
}
