package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditorias")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @GetMapping
    public ResponseEntity<List<Auditoria>> listarTodas() {
        return ResponseEntity.ok(auditoriaService.listarTodas());
    }
}
