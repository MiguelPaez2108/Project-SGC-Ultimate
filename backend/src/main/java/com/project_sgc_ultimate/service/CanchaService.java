package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.repository.CanchaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CanchaService {

    private final CanchaRepository canchaRepository;

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

    public Cancha crear(Cancha cancha) {
        canchaRepository.findByNombreIgnoreCase(cancha.getNombre())
                .ifPresent(c -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe una cancha con ese nombre");
                });

        if (cancha.getEstado() == null) {
            cancha.setEstado(Cancha.EstadoCancha.ACTIVA);
        }

        return canchaRepository.save(cancha);
    }

    public Cancha actualizar(String id, Cancha canchaActualizada) {
        Cancha existente = buscarPorId(id);

        existente.setNombre(canchaActualizada.getNombre());
        existente.setTipo(canchaActualizada.getTipo());
        existente.setUbicacion(canchaActualizada.getUbicacion());
        existente.setPrecioPorHora(canchaActualizada.getPrecioPorHora());
        existente.setEstado(canchaActualizada.getEstado());
        existente.setTechada(canchaActualizada.getTechada());

        return canchaRepository.save(existente);
    }

    public void eliminar(String id) {
        Cancha existente = buscarPorId(id);
        existente.setEstado(Cancha.EstadoCancha.INACTIVA);
        canchaRepository.save(existente);
    }
}
