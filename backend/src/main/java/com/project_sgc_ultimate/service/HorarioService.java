package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.model.Horario;
import com.project_sgc_ultimate.repository.HorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioService {

    private final HorarioRepository horarioRepository;

    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }

    public List<Horario> listarPorCancha(String canchaId) {
        return horarioRepository.findByCanchaIdAndActivoTrue(canchaId);
    }

    public Horario buscarPorId(String id) {
        return horarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Horario no encontrado"));
    }

    public Horario crear(Horario horario) {
        if (horario.getActivo() == null) {
            horario.setActivo(true);
        }
        return horarioRepository.save(horario);
    }

    public Horario actualizar(String id, Horario horarioActualizado) {
        Horario existente = buscarPorId(id);

        existente.setCanchaId(horarioActualizado.getCanchaId());
        existente.setDiaSemana(horarioActualizado.getDiaSemana());
        existente.setHoraInicio(horarioActualizado.getHoraInicio());
        existente.setHoraFin(horarioActualizado.getHoraFin());
        existente.setActivo(horarioActualizado.getActivo());

        return horarioRepository.save(existente);
    }

    public void eliminar(String id) {
        Horario existente = buscarPorId(id);
        existente.setActivo(false);
        horarioRepository.save(existente);
    }
}
