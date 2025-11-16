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
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> obtenerPorId(@PathVariable String id) {
        Reserva reserva = reservaService.obtenerPorId(id);
        return ResponseEntity.ok(mapToResponseDto(reserva));
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crear(@RequestBody ReservaRequestDTO dto) {
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

        Cancha cancha = canchaRepository.findById(reserva.getCanchaId()).orElse(null);
        Usuario usuario = usuarioRepository.findById(reserva.getUsuarioId()).orElse(null);

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
