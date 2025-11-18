package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.ReservaRequestDTO;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.model.Horario;
import com.project_sgc_ultimate.model.Pago;
import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.CanchaRepository;
import com.project_sgc_ultimate.repository.HorarioRepository;
import com.project_sgc_ultimate.repository.PagoRepository;
import com.project_sgc_ultimate.repository.ReservaRepository;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;
    private final HorarioRepository horarioRepository;
    private final PagoRepository pagoRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public List<Reserva> listarPorUsuario(String usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    public Reserva obtenerPorId(String id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"
                ));
    }

    public Reserva crearDesdeDto(ReservaRequestDTO dto) {

        // ===== 1) Validar cancha =====
        Cancha cancha = canchaRepository.findById(dto.getCanchaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cancha no encontrada"
                ));

        if (cancha.getPrecioPorHora() == null || cancha.getPrecioPorHora().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cancha no tiene un precio por hora válido"
            );
        }

        // ===== 2) Validar usuario =====
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"
                ));

        // ===== 3) Validar fechas =====
        LocalDateTime inicio = dto.getFechaInicio();
        LocalDateTime fin = dto.getFechaFin();

        if (inicio == null || fin == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Las fechas de inicio y fin son obligatorias"
            );
        }

        if (inicio.isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de inicio no puede ser en el pasado"
            );
        }

        if (!fin.isAfter(inicio)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha/hora de fin debe ser posterior a la de inicio"
            );
        }

        // ===== 4) Validar que la reserva cae dentro de un horario activo de la cancha =====
        validarHorarioDisponible(cancha.getId(), inicio, fin);

        // ===== 5) Validar solapamiento con reservas existentes =====
        if (haySolapamiento(cancha.getId(), inicio, fin)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La cancha ya está reservada en ese horario"
            );
        }

        // ===== 6) Calcular precio total (BigDecimal bien hecho) =====
        Duration duracion = Duration.between(inicio, fin);
        long minutos = duracion.toMinutes();

        if (minutos <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La duración de la reserva debe ser mayor a 0 minutos"
            );
        }

        BigDecimal horas = BigDecimal.valueOf(minutos)
                .divide(BigDecimal.valueOf(60), 2, java.math.RoundingMode.HALF_UP);

        BigDecimal precioTotal = cancha.getPrecioPorHora().multiply(horas);

        // ===== 7) Construir y guardar la reserva =====
        Reserva reserva = Reserva.builder()
                .canchaId(cancha.getId())
                .usuarioId(usuario.getId())
                .fechaInicio(inicio)
                .fechaFin(fin)
                .precioTotal(precioTotal)
                .estado(Reserva.EstadoReserva.PENDIENTE)
                .build();

        return reservaRepository.save(reserva);
    }

    public Reserva actualizarEstado(String id, Reserva.EstadoReserva nuevoEstado) {
        Reserva reserva = obtenerPorId(id);

        // Regla: no se puede marcar COMPLETADA si no tiene un pago PAGADO
        if (nuevoEstado == Reserva.EstadoReserva.COMPLETADA) {
            boolean pagada = pagoRepository.existsByReservaIdAndEstado(
                    reserva.getId(),
                    Pago.EstadoPago.PAGADO
            );

            if (!pagada) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "No se puede completar la reserva porque no tiene un pago registrado como PAGADO"
                );
            }
        }

        reserva.setEstado(nuevoEstado);
        return reservaRepository.save(reserva);
    }

    public void eliminar(String id) {
        if (!reservaRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Reserva no encontrada"
            );
        }
        reservaRepository.deleteById(id);
    }

    /**
     * Verifica si ya existe una reserva que se solape en la misma cancha
     * en estados "activos" (PENDIENTE o CONFIRMADA).
     */
    private boolean haySolapamiento(String canchaId, LocalDateTime inicio, LocalDateTime fin) {

        List<Reserva.EstadoReserva> estadosActivos = List.of(
                Reserva.EstadoReserva.PENDIENTE,
                Reserva.EstadoReserva.CONFIRMADA
        );

        return !reservaRepository
                .findByCanchaIdAndEstadoInAndFechaFinGreaterThanAndFechaInicioLessThan(
                        canchaId,
                        estadosActivos,
                        inicio,
                        fin
                )
                .isEmpty();
    }

    /**
     * Valida que la reserva esté dentro de un horario ACTIVO para esa cancha y día.
     */
    private void validarHorarioDisponible(String canchaId, LocalDateTime inicio, LocalDateTime fin) {

        DayOfWeek dia = inicio.getDayOfWeek();
        Horario.DiaSemana diaHorario = mapDiaSemana(dia);

        List<Horario> horarios = horarioRepository
                .findByCanchaIdAndDiaSemanaAndActivoTrue(canchaId, diaHorario);

        if (horarios.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cancha no tiene horarios configurados para ese día"
            );
        }

        LocalTime horaInicio = inicio.toLocalTime();
        LocalTime horaFin = fin.toLocalTime();

        boolean cubiertoPorAlguno = horarios.stream().anyMatch(h ->
                !horaInicio.isBefore(h.getHoraInicio()) &&
                !horaFin.isAfter(h.getHoraFin())
        );

        if (!cubiertoPorAlguno) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La reserva está fuera del horario permitido para esa cancha"
            );
        }
    }

    private Horario.DiaSemana mapDiaSemana(DayOfWeek dia) {
        switch (dia) {
            case MONDAY:
                return Horario.DiaSemana.LUNES;
            case TUESDAY:
                return Horario.DiaSemana.MARTES;
            case WEDNESDAY:
                return Horario.DiaSemana.MIERCOLES;
            case THURSDAY:
                return Horario.DiaSemana.JUEVES;
            case FRIDAY:
                return Horario.DiaSemana.VIERNES;
            case SATURDAY:
                return Horario.DiaSemana.SABADO;
            case SUNDAY:
                return Horario.DiaSemana.DOMINGO;
            default:
                throw new IllegalArgumentException("Día de la semana no soportado: " + dia);
        }
    }
}
