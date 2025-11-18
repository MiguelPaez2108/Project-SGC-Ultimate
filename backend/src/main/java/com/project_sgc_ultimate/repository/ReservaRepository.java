package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.model.Reserva.EstadoReserva;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservaRepository extends MongoRepository<Reserva, String> {

    List<Reserva> findByUsuarioId(String usuarioId);

    // Para detectar solapamiento de reservas en la misma cancha
    List<Reserva> findByCanchaIdAndEstadoInAndFechaFinGreaterThanAndFechaInicioLessThan(
            String canchaId,
            List<EstadoReserva> estados,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );
}
