package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.model.Horario;
import com.project_sgc_ultimate.service.HorarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@RequiredArgsConstructor
public class HorarioController {

    private final HorarioService horarioService;

    @GetMapping
    public ResponseEntity<List<Horario>> listarTodos() {
        return ResponseEntity.ok(horarioService.listarTodos());
    }

    @GetMapping("/por-cancha/{canchaId}")
    public ResponseEntity<List<Horario>> listarPorCancha(@PathVariable String canchaId) {
        return ResponseEntity.ok(horarioService.listarPorCancha(canchaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(horarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Horario> crear(@Valid @RequestBody Horario horario) {
        Horario creado = horarioService.crear(horario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> actualizar(
            @PathVariable String id,
            @Valid @RequestBody Horario horario
    ) {
        Horario actualizado = horarioService.actualizar(id, horario);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        horarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
