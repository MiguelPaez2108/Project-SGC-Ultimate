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
import org.springframework.security.core.GrantedAuthority;
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

    // =====================
    // GET /api/reservas
    // - ADMIN: ve todas
    // - CLIENTE: solo ve las suyas
    // =====================
    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listarTodas(Authentication authentication) {

        Usuario usuarioActual = obtenerUsuarioActual(authentication);

        boolean esAdmin = tieneRol(authentication, "ROLE_ADMIN");

        List<Reserva> reservas;
        if (esAdmin) {
            reservas = reservaService.listarTodas();
        } else {
            // CLIENTE → solo sus reservas
            reservas = reservaService.listarPorUsuario(usuarioActual.getId());
        }

        List<ReservaResponseDTO> respuesta = reservas.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }

    // =====================
    // GET /api/reservas/{id}
    // - ADMIN: puede ver cualquiera
    // - CLIENTE: solo si la reserva es suya
    // =====================
    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> obtenerPorId(
            @PathVariable String id,
            Authentication authentication
    ) {
        Usuario usuarioActual = obtenerUsuarioActual(authentication);
        boolean esAdmin = tieneRol(authentication, "ROLE_ADMIN");

        Reserva reserva = reservaService.obtenerPorId(id);

        if (!esAdmin && !reserva.getUsuarioId().equals(usuarioActual.getId())) {
            // 403 Forbidden: el cliente intenta ver una reserva que no es suya
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(mapToResponseDto(reserva));
    }

    // =====================
    // POST /api/reservas
    // - CLIENTE / ADMIN
    // - El usuarioId se toma SIEMPRE del token, NO del body
    // =====================
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crear(
            @RequestBody ReservaRequestDTO dto,
            Authentication authentication
    ) {
        Usuario usuarioActual = obtenerUsuarioActual(authentication);

        // Ignoramos cualquier usuarioId que venga del body y usamos el del token
        dto.setUsuarioId(usuarioActual.getId());

        Reserva creada = reservaService.crearDesdeDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDto(creada));
    }

    // =====================
    // PUT /api/reservas/{id}/estado
    // - Por diseño, esto debería ser solo ADMIN (lo controlas en SecurityConfig)
    // =====================
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

    // ====== Helpers de seguridad ======

    private Usuario obtenerUsuarioActual(Authentication authentication) {
        String email = authentication.getName(); // viene del JwtFilter (sub)
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado en BD"));
    }

    private boolean tieneRol(Authentication authentication, String rolBuscado) {
        if (authentication == null) return false;
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals(rolBuscado)) {
                return true;
            }
        }
        return false;
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
