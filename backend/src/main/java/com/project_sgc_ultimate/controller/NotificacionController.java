package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.NotificacionRequestDTO;
import com.project_sgc_ultimate.dto.NotificacionResponseDTO;
import com.project_sgc_ultimate.model.Notificacion;
import com.project_sgc_ultimate.service.NotificacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping
    @Operation(summary = "Listar todas las notificaciones")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de notificaciones obtenida exitosamente")
    })
    public ResponseEntity<List<NotificacionResponseDTO>> listarTodas() {
        List<Notificacion> notificaciones = notificacionService.listarTodas();
        List<NotificacionResponseDTO> respuesta = notificaciones.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/por-usuario/{usuarioId}")
    @Operation(summary = "Listar notificaciones por usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de notificaciones obtenida exitosamente")
    })
    public ResponseEntity<List<NotificacionResponseDTO>> listarPorUsuario(@PathVariable String usuarioId) {
        List<Notificacion> notificaciones = notificacionService.listarPorUsuario(usuarioId);
        List<NotificacionResponseDTO> respuesta = notificaciones.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping
    @Operation(summary = "Enviar nueva notificación")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Notificación enviada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<NotificacionResponseDTO> enviar(@Valid @RequestBody NotificacionRequestDTO dto) {
        Notificacion creada = notificacionService.enviarDesdeDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDto(creada));
    }

    @PutMapping("/{id}/marcar-leida")
    @Operation(summary = "Marcar notificación como leída")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notificación marcada como leída"),
        @ApiResponse(responseCode = "404", description = "Notificación no encontrada")
    })
    public ResponseEntity<NotificacionResponseDTO> marcarLeida(@PathVariable String id) {
        Notificacion actualizada = notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok(mapToResponseDto(actualizada));
    }

    private NotificacionResponseDTO mapToResponseDto(Notificacion notificacion) {
        return NotificacionResponseDTO.builder()
                .id(notificacion.getId())
                .usuarioId(notificacion.getUsuarioId())
                .tipo(notificacion.getTipo() != null ? notificacion.getTipo().name() : null)
                .mensaje(notificacion.getMensaje())
                .leida(notificacion.getLeida())
                .fechaEnvio(notificacion.getFechaEnvio() != null ? notificacion.getFechaEnvio().toString() : null)
                .build();
    }
}
