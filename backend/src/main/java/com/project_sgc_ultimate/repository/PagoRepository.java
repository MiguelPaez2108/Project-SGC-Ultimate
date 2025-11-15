package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Pago;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoRepository extends MongoRepository<Pago, String> {

    List<Pago> findByReservaId(String reservaId);
}
