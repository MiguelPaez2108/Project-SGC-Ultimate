package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.HorarioRequestDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.model.Horario;
import com.project_sgc_ultimate.repository.HorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioService {

    private final HorarioRepository horarioRepository;
    private final AuditoriaService auditoriaService;

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

    @Transactional
    public Horario crearDesdeDto(HorarioRequestDTO dto) {
        Horario horario = Horario.builder()
                .canchaId(dto.getCanchaId())
                .diaSemana(Horario.DiaSemana.valueOf(dto.getDiaSemana()))
                .horaInicio(LocalTime.parse(dto.getHoraInicio()))
                .horaFin(LocalTime.parse(dto.getHoraFin()))
                .activo(true)
                .build();

        Horario creado = horarioRepository.save(horario);

        // Auditoría
        auditoriaService.registrar("Horario", creado.getId(), null, Auditoria.Accion.CREACION,
                "Horario creado: " + creado.getDiaSemana() + " " + creado.getHoraInicio() + "-" + creado.getHoraFin());

        return creado;
    }

    @Transactional
    public Horario actualizarDesdeDto(String id, HorarioRequestDTO dto) {
        Horario existente = buscarPorId(id);

        existente.setCanchaId(dto.getCanchaId());
        existente.setDiaSemana(Horario.DiaSemana.valueOf(dto.getDiaSemana()));
        existente.setHoraInicio(LocalTime.parse(dto.getHoraInicio()));
        existente.setHoraFin(LocalTime.parse(dto.getHoraFin()));

        Horario actualizado = horarioRepository.save(existente);

        // Auditoría
        auditoriaService.registrar("Horario", actualizado.getId(), null, Auditoria.Accion.ACTUALIZACION,
                "Horario actualizado: " + actualizado.getDiaSemana() + " " + actualizado.getHoraInicio() + "-" + actualizado.getHoraFin());

        return actualizado;
    }

    @Transactional
    public void eliminar(String id) {
        Horario existente = buscarPorId(id);
        existente.setActivo(false);
        horarioRepository.save(existente);

        // Auditoría
        auditoriaService.registrar("Horario", existente.getId(), null, Auditoria.Accion.ELIMINACION,
                "Horario eliminado: " + existente.getDiaSemana() + " " + existente.getHoraInicio() + "-" + existente.getHoraFin());
    }
}
