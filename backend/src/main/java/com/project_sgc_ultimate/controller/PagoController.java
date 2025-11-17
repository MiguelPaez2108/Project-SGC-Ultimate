package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.PagoRequestDTO;
import com.project_sgc_ultimate.dto.PagoResponseDTO;
import com.project_sgc_ultimate.model.Pago;
import com.project_sgc_ultimate.service.PagoService;
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
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los pagos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de pagos obtenida exitosamente")
    })
    public ResponseEntity<List<PagoResponseDTO>> listarTodos() {
        List<Pago> pagos = pagoService.listarTodos();
        List<PagoResponseDTO> respuesta = pagos.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/por-reserva/{reservaId}")
    @Operation(summary = "Listar pagos por reserva")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de pagos obtenida exitosamente")
    })
    public ResponseEntity<List<PagoResponseDTO>> listarPorReserva(@PathVariable String reservaId) {
        List<Pago> pagos = pagoService.listarPorReserva(reservaId);
        List<PagoResponseDTO> respuesta = pagos.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pago por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pago encontrado"),
        @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    })
    public ResponseEntity<PagoResponseDTO> obtenerPorId(@PathVariable String id) {
        Pago pago = pagoService.buscarPorId(id);
        return ResponseEntity.ok(mapToResponseDto(pago));
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo pago")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Pago registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<PagoResponseDTO> registrarPago(@Valid @RequestBody PagoRequestDTO dto) {
        Pago creado = pagoService.registrarPagoDesdeDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDto(creado));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar estado del pago")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado del pago actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    })
    public ResponseEntity<PagoResponseDTO> actualizarEstado(
            @PathVariable String id,
            @RequestParam Pago.EstadoPago estado
    ) {
        Pago actualizado = pagoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(mapToResponseDto(actualizado));
    }

    private PagoResponseDTO mapToResponseDto(Pago pago) {
        return PagoResponseDTO.builder()
                .id(pago.getId())
                .reservaId(pago.getReservaId())
                .monto(pago.getMonto())
                .metodo(pago.getMetodo() != null ? pago.getMetodo().name() : null)
                .estado(pago.getEstado() != null ? pago.getEstado().name() : null)
                .fechaPago(pago.getFechaPago() != null ? pago.getFechaPago().toString() : null)
                .build();
    }
}

