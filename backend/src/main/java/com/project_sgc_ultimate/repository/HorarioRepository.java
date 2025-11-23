package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Horario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HorarioRepository extends MongoRepository<Horario, String> {

    List<Horario> findByCanchaId(String canchaId);

    List<Horario> findByCanchaIdAndActivoTrue(String canchaId);

    // OJO: aquí usamos Horario.DiaSemana, NO DayOfWeek
    List<Horario> findByCanchaIdAndDiaSemanaAndActivoTrue(
            String canchaId,
            Horario.DiaSemana diaSemana
    );
}
