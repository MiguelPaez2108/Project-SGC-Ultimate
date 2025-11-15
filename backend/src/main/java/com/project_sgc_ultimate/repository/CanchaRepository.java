package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Cancha;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CanchaRepository extends MongoRepository<Cancha, String> {

    Optional<Cancha> findByNombreIgnoreCase(String nombre);

    List<Cancha> findByEstado(com.project_sgc_ultimate.model.Cancha.EstadoCancha estado);
}
