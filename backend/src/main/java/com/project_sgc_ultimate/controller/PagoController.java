package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.model.Pago;
import com.project_sgc_ultimate.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @GetMapping
    public ResponseEntity<List<Pago>> listarTodos() {
        return ResponseEntity.ok(pagoService.listarTodos());
    }

    @GetMapping("/por-reserva/{reservaId}")
    public ResponseEntity<List<Pago>> listarPorReserva(@PathVariable String reservaId) {
        return ResponseEntity.ok(pagoService.listarPorReserva(reservaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(pagoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Pago> registrarPago(@Valid @RequestBody Pago pago) {
        Pago creado = pagoService.registrarPago(pago);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Pago> actualizarEstado(
            @PathVariable String id,
            @RequestParam Pago.EstadoPago estado
    ) {
        Pago actualizado = pagoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizado);
    }
}

