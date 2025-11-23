package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.ReservaRequestDTO;
import com.project_sgc_ultimate.dto.ReservaResponseDTO;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.CanchaRepository;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import com.project_sgc_ultimate.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listarTodas() {
        List<Reserva> reservas = reservaService.listarTodas();

        List<ReservaResponseDTO> respuesta = reservas.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }

    // ========= NUEVO: Mis reservas (según usuario autenticado) =========
    @GetMapping("/mis")
    public ResponseEntity<List<ReservaResponseDTO>> listarMisReservas() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario no autenticado"
            );
        }

        String email = auth.getName(); // del JWT (sub / username)

        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario autenticado no encontrado"
                ));

        List<Reserva> reservas = reservaService.listarPorUsuario(usuario.getId());

        List<ReservaResponseDTO> respuesta = reservas.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }
    // ================================================================

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> obtenerPorId(@PathVariable String id) {
        Reserva reserva = reservaService.obtenerPorId(id);
        return ResponseEntity.ok(mapToResponseDto(reserva));
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crear(@RequestBody ReservaRequestDTO dto) {
        // Si no viene el usuarioId, lo tomamos del usuario autenticado
        if (dto.getUsuarioId() == null || dto.getUsuarioId().isEmpty()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                String email = auth.getName();
                Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuario autenticado no encontrado"
                        ));
                dto.setUsuarioId(usuario.getId());
            }
        }

        Reserva creada = reservaService.crearDesdeDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDto(creada));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ReservaResponseDTO> actualizarEstado(
            @PathVariable String id,
            @RequestParam("estado") Reserva.EstadoReserva estado
    ) {
        Reserva actualizada = reservaService.actualizarEstado(id, estado);
        return ResponseEntity.ok(mapToResponseDto(actualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        reservaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ====== Mapeo entidad → DTO enriquecido ======

    private ReservaResponseDTO mapToResponseDto(Reserva reserva) {

        Cancha cancha = reserva.getCanchaId() != null ? canchaRepository.findById(reserva.getCanchaId()).orElse(null) : null;
        Usuario usuario = reserva.getUsuarioId() != null ? usuarioRepository.findById(reserva.getUsuarioId()).orElse(null) : null;

        String canchaNombre = cancha != null ? cancha.getNombre() : "Desconocida";
        String usuarioNombre = usuario != null ? usuario.getNombreCompleto() : "Desconocido";

        return ReservaResponseDTO.builder()
                .id(reserva.getId())
                .canchaId(reserva.getCanchaId())
                .canchaNombre(canchaNombre)
                .usuarioId(reserva.getUsuarioId())
                .usuarioNombre(usuarioNombre)
                .estado(reserva.getEstado() != null ? reserva.getEstado().name() : null)
                .precioTotal(reserva.getPrecioTotal())
                .fechaInicio(reserva.getFechaInicio() != null ? reserva.getFechaInicio().toString() : null)
                .fechaFin(reserva.getFechaFin() != null ? reserva.getFechaFin().toString() : null)
                .build();
    }
}
