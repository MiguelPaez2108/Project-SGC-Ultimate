package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Horario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioRepository extends MongoRepository<Horario, String> {

    List<Horario> findByCanchaIdAndActivoTrue(String canchaId);
}
