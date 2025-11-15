package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.service.CanchaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/canchas")
@RequiredArgsConstructor
public class CanchaController {

    private final CanchaService canchaService;

    @GetMapping
    public ResponseEntity<List<Cancha>> obtenerTodas() {
        return ResponseEntity.ok(canchaService.listarTodas());
    }

    @GetMapping("/activas")
    public ResponseEntity<List<Cancha>> obtenerActivas() {
        return ResponseEntity.ok(canchaService.listarActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cancha> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(canchaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Cancha> crear(@Valid @RequestBody Cancha cancha) {
        Cancha creada = canchaService.crear(cancha);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cancha> actualizar(
            @PathVariable String id,
            @Valid @RequestBody Cancha cancha
    ) {
        Cancha actualizada = canchaService.actualizar(id, cancha);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        canchaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
