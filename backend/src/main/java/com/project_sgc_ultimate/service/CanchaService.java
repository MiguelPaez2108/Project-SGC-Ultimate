package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.CanchaRequestDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.repository.CanchaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CanchaService {

    private final CanchaRepository canchaRepository;
    private final AuditoriaService auditoriaService;

    public List<Cancha> listarTodas() {
        return canchaRepository.findAll();
    }

    public List<Cancha> listarActivas() {
        return canchaRepository.findByEstado(Cancha.EstadoCancha.ACTIVA);
    }

    public Cancha buscarPorId(String id) {
        return canchaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cancha no encontrada"));
    }

    @Transactional
    public Cancha crearDesdeDto(CanchaRequestDTO dto) {
        canchaRepository.findByNombreIgnoreCase(dto.getNombre())
                .ifPresent(c -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe una cancha con ese nombre");
                });

        Cancha cancha = Cancha.builder()
                .nombre(dto.getNombre())
                .tipo(Cancha.TipoCancha.valueOf(dto.getTipo()))
                .ubicacion(dto.getUbicacion())
                .precioPorHora(dto.getPrecioPorHora())
                .estado(Cancha.EstadoCancha.ACTIVA)
                .techada(dto.getTechada())
                .build();

        Cancha creada = canchaRepository.save(cancha);

        // Auditoría
        auditoriaService.registrar("Cancha", creada.getId(), null, Auditoria.Accion.CREACION,
                "Cancha creada: " + creada.getNombre());

        return creada;
    }

    @Transactional
    public Cancha actualizarDesdeDto(String id, CanchaRequestDTO dto) {
        Cancha existente = buscarPorId(id);

        existente.setNombre(dto.getNombre());
        existente.setTipo(Cancha.TipoCancha.valueOf(dto.getTipo()));
        existente.setUbicacion(dto.getUbicacion());
        existente.setPrecioPorHora(dto.getPrecioPorHora());
        existente.setTechada(dto.getTechada());

        Cancha actualizada = canchaRepository.save(existente);

        // Auditoría
        auditoriaService.registrar("Cancha", actualizada.getId(), null, Auditoria.Accion.ACTUALIZACION,
                "Cancha actualizada: " + actualizada.getNombre());

        return actualizada;
    }

    @Transactional
    public void eliminar(String id) {
        Cancha existente = buscarPorId(id);
        existente.setEstado(Cancha.EstadoCancha.INACTIVA);
        canchaRepository.save(existente);

        // Auditoría
        auditoriaService.registrar("Cancha", existente.getId(), null, Auditoria.Accion.ELIMINACION,
                "Cancha eliminada: " + existente.getNombre());
    }
}
