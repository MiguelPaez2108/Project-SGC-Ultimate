package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.model.Notificacion;
import com.project_sgc_ultimate.service.NotificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping("/por-usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> listarPorUsuario(@PathVariable String usuarioId) {
        return ResponseEntity.ok(notificacionService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Notificacion> enviar(@Valid @RequestBody Notificacion notificacion) {
        Notificacion creada = notificacionService.enviar(notificacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}/marcar-leida")
    public ResponseEntity<Notificacion> marcarLeida(@PathVariable String id) {
        Notificacion actualizada = notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok(actualizada);
    }
}
