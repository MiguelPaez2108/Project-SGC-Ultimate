package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.ReservaRequestDTO;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.CanchaRepository;
import com.project_sgc_ultimate.repository.ReservaRepository;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public Reserva obtenerPorId(String id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"
                ));
    }

    public Reserva crearDesdeDto(ReservaRequestDTO dto) {

        // Validar cancha
        Cancha cancha = canchaRepository.findById(dto.getCanchaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cancha no encontrada"
                ));

        // Validar usuario
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"
                ));

        // Validar fechas
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

        // Validar solapamiento
        if (haySolapamiento(cancha.getId(), inicio, fin)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La cancha ya está reservada en ese horario"
            );
        }

        // Calcular precio total (BigDecimal)
        double horasDouble = Duration.between(inicio, fin).toMinutes() / 60.0;
        BigDecimal horas = BigDecimal.valueOf(horasDouble);
        BigDecimal precioTotal = cancha.getPrecioPorHora().multiply(horas);

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
        reserva.setEstado(nuevoEstado);
        return reservaRepository.save(reserva);
    }

    public void eliminar(String id) {
        if (!reservaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada");
        }
        reservaRepository.deleteById(id);
    }

    private boolean haySolapamiento(String canchaId, LocalDateTime inicio, LocalDateTime fin) {
        List<Reserva> reservas = reservaRepository.findAll();

        return reservas.stream()
                .filter(r -> r.getCanchaId().equals(canchaId))
                .anyMatch(r ->
                        r.getFechaInicio().isBefore(fin) &&
                        r.getFechaFin().isAfter(inicio)
                );
    }
}
