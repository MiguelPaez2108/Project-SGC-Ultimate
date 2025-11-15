package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.repository.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    public List<Auditoria> listarTodas() {
        return auditoriaRepository.findAll();
    }

    public Auditoria registrar(String entidad, String entidadId, String usuarioId,
                               Auditoria.Accion accion, String detalle) {

        Auditoria auditoria = Auditoria.builder()
                .entidad(entidad)
                .entidadId(entidadId)
                .usuarioId(usuarioId)
                .accion(accion)
                .fechaHora(LocalDateTime.now())
                .detalle(detalle)
                .build();

        return auditoriaRepository.save(auditoria);
    }
}
