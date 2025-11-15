package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Reserva;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends MongoRepository<Reserva, String> {

    List<Reserva> findByCanchaIdAndFecha(String canchaId, LocalDate fecha);

    List<Reserva> findByUsuarioId(String usuarioId);
}
