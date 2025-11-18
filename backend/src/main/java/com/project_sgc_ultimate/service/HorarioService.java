package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.HorarioRequestDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.model.Horario;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.repository.CanchaRepository;
import com.project_sgc_ultimate.repository.HorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DateTimeException;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioService {

    private final HorarioRepository horarioRepository;
    private final AuditoriaService auditoriaService;
    private final CanchaRepository canchaRepository;

    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }

    public List<Horario> listarPorCancha(String canchaId) {
        return horarioRepository.findByCanchaIdAndActivoTrue(canchaId);
    }

    public Horario buscarPorId(String id) {
        return horarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Horario no encontrado"
                ));
    }

    @Transactional
    public Horario crearDesdeDto(HorarioRequestDTO dto) {

        validarDtoBasico(dto);
        validarCanchaExiste(dto.getCanchaId());

        Horario.DiaSemana diaSemana = parseDiaSemana(dto.getDiaSemana());
        LocalTime horaInicio = parseHora(dto.getHoraInicio(), "horaInicio");
        LocalTime horaFin = parseHora(dto.getHoraFin(), "horaFin");

        if (!horaFin.isAfter(horaInicio)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La horaFin debe ser posterior a la horaInicio"
            );
        }

        Horario horario = Horario.builder()
                .canchaId(dto.getCanchaId())
                .diaSemana(diaSemana)
                .horaInicio(horaInicio)
                .horaFin(horaFin)
                .activo(true)
                .build();

        Horario creado = horarioRepository.save(horario);

        // Auditoría
        auditoriaService.registrar(
                "Horario",
                creado.getId(),
                null,
                Auditoria.Accion.CREACION,
                "Horario creado: " + creado.getDiaSemana() + " " +
                        creado.getHoraInicio() + "-" + creado.getHoraFin()
        );

        return creado;
    }

    @Transactional
    public Horario actualizarDesdeDto(String id, HorarioRequestDTO dto) {

        Horario existente = buscarPorId(id);

        validarDtoBasico(dto);
        validarCanchaExiste(dto.getCanchaId());

        Horario.DiaSemana diaSemana = parseDiaSemana(dto.getDiaSemana());
        LocalTime horaInicio = parseHora(dto.getHoraInicio(), "horaInicio");
        LocalTime horaFin = parseHora(dto.getHoraFin(), "horaFin");

        if (!horaFin.isAfter(horaInicio)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La horaFin debe ser posterior a la horaInicio"
            );
        }

        existente.setCanchaId(dto.getCanchaId());
        existente.setDiaSemana(diaSemana);
        existente.setHoraInicio(horaInicio);
        existente.setHoraFin(horaFin);

        Horario actualizado = horarioRepository.save(existente);

        // Auditoría
        auditoriaService.registrar(
                "Horario",
                actualizado.getId(),
                null,
                Auditoria.Accion.ACTUALIZACION,
                "Horario actualizado: " + actualizado.getDiaSemana() + " " +
                        actualizado.getHoraInicio() + "-" + actualizado.getHoraFin()
        );

        return actualizado;
    }

    @Transactional
    public void eliminar(String id) {
        Horario existente = buscarPorId(id);
        existente.setActivo(false);
        horarioRepository.save(existente);

        // Auditoría
        auditoriaService.registrar(
                "Horario",
                existente.getId(),
                null,
                Auditoria.Accion.ELIMINACION,
                "Horario eliminado: " + existente.getDiaSemana() + " " +
                        existente.getHoraInicio() + "-" + existente.getHoraFin()
        );
    }

    // Helpers internos

    private void validarDtoBasico(HorarioRequestDTO dto) {
        if (dto.getCanchaId() == null || dto.getCanchaId().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El campo canchaId es obligatorio"
            );
        }
        if (dto.getDiaSemana() == null || dto.getDiaSemana().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El campo diaSemana es obligatorio"
            );
        }
        if (dto.getHoraInicio() == null || dto.getHoraInicio().isBlank() ||
            dto.getHoraFin() == null || dto.getHoraFin().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los campos horaInicio y horaFin son obligatorios"
            );
        }
    }

    private void validarCanchaExiste(String canchaId) {
        Cancha cancha = canchaRepository.findById(canchaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cancha no encontrada para el horario"
                ));
    }

    private Horario.DiaSemana parseDiaSemana(String diaSemanaStr) {
        try {
            // Por si te llega en minúsculas desde el frontend
            return Horario.DiaSemana.valueOf(diaSemanaStr.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Valor de diaSemana inválido: " + diaSemanaStr
            );
        }
    }

    private LocalTime parseHora(String horaStr, String campo) {
        try {
            // Espera formato HH:mm o HH:mm:ss (ISO)
            return LocalTime.parse(horaStr);
        } catch (DateTimeException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Formato de " + campo + " inválido. Usa formato HH:mm (ej: 18:30)"
            );
        }
    }
}

