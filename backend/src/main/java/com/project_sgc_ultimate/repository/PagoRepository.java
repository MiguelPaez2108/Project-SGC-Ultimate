package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Pago;
import com.project_sgc_ultimate.model.Pago.EstadoPago;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PagoRepository extends MongoRepository<Pago, String> {

    List<Pago> findByReservaId(String reservaId);

    List<Pago> findByUsuarioId(String usuarioId);

    boolean existsByReservaIdAndEstado(String reservaId, EstadoPago estado);
}
