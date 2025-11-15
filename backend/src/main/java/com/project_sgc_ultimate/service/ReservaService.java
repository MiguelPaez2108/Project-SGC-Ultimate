package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public List<Reserva> listarPorUsuario(String usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    public Reserva buscarPorId(String id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));
    }

    public Reserva crear(Reserva reserva) {
        // Validar solape básico en misma cancha y fecha
        List<Reserva> reservasMismoDia = reservaRepository.findByCanchaIdAndFecha(
                reserva.getCanchaId(),
                reserva.getFecha()
        );

        for (Reserva r : reservasMismoDia) {
            if (r.getEstado() == Reserva.EstadoReserva.CANCELADA) continue;

            boolean solapa = intervalosSolapan(
                    reserva.getHoraInicio(), reserva.getHoraFin(),
                    r.getHoraInicio(), r.getHoraFin()
            );

            if (solapa) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "La cancha ya tiene una reserva en ese horario"
                );
            }
        }

        if (reserva.getEstado() == null) {
            reserva.setEstado(Reserva.EstadoReserva.PENDIENTE);
        }

        return reservaRepository.save(reserva);
    }

    public Reserva actualizar(String id, Reserva reservaActualizada) {
        Reserva existente = buscarPorId(id);

        existente.setCanchaId(reservaActualizada.getCanchaId());
        existente.setUsuarioId(reservaActualizada.getUsuarioId());
        existente.setFecha(reservaActualizada.getFecha());
        existente.setHoraInicio(reservaActualizada.getHoraInicio());
        existente.setHoraFin(reservaActualizada.getHoraFin());
        existente.setEstado(reservaActualizada.getEstado());
        existente.setPrecioTotal(reservaActualizada.getPrecioTotal());

        return reservaRepository.save(existente);
    }

    public void cancelar(String id) {
        Reserva existente = buscarPorId(id);
        existente.setEstado(Reserva.EstadoReserva.CANCELADA);
        reservaRepository.save(existente);
    }

    private boolean intervalosSolapan(LocalTime inicio1, LocalTime fin1,
                                      LocalTime inicio2, LocalTime fin2) {
        return inicio1.isBefore(fin2) && inicio2.isBefore(fin1);
    }
}
