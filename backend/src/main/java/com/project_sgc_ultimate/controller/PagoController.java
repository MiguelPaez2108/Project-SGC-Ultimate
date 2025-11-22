package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.PagoRequestDTO;
import com.project_sgc_ultimate.dto.PagoResponseDTO;
import com.project_sgc_ultimate.service.PagoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pago por ID")
    public ResponseEntity<PagoResponseDTO> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(pagoService.obtenerPorId(id));
    }

    @GetMapping("/por-reserva/{reservaId}")
    @Operation(summary = "Listar pagos por reserva")
    public ResponseEntity<List<PagoResponseDTO>> listarPorReserva(@PathVariable String reservaId) {
        return ResponseEntity.ok(pagoService.listarPorReserva(reservaId));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar pagos por usuario")
    public ResponseEntity<List<PagoResponseDTO>> listarPorUsuario(@PathVariable String usuarioId) {
        return ResponseEntity.ok(pagoService.listarPorUsuario(usuarioId));
    }

    // En tu SecurityConfig ya pusiste que SOLO ADMIN puede crear/gestionar pagos
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registrar pago para una reserva")
    public ResponseEntity<PagoResponseDTO> registrarPago(@RequestBody PagoRequestDTO dto) {
        PagoResponseDTO creado = pagoService.registrarPago(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}
