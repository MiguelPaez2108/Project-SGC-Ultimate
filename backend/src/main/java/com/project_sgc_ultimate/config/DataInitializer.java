package com.project_sgc_ultimate.config;

import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.model.Horario;
import com.project_sgc_ultimate.repository.CanchaRepository;
import com.project_sgc_ultimate.repository.HorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CanchaRepository canchaRepository;
    private final HorarioRepository horarioRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- INICIANDO CARGA DE HORARIOS POR DEFECTO ---");
        List<Cancha> canchas = canchaRepository.findAll();

        int canchaIndex = 0;
        for (Cancha cancha : canchas) {
            // Verificar si la cancha ya tiene horarios para algún día
            // Si no tiene ninguno, le creamos para TODA la semana
            if (horarioRepository.findByCanchaId(cancha.getId()).isEmpty()) {
                System.out.println("Creando horarios para cancha: " + cancha.getNombre());
                crearHorariosParaCancha(cancha, canchaIndex);
                canchaIndex++;
            } else {
                System.out.println("La cancha " + cancha.getNombre() + " ya tiene horarios.");
            }
        }
        System.out.println("--- CARGA DE HORARIOS COMPLETADA ---");
    }

    private void crearHorariosParaCancha(Cancha cancha, int canchaIndex) {
        Horario.DiaSemana[] dias = Horario.DiaSemana.values();

        // Definir diferentes horarios según el tipo de cancha
        LocalTime horaInicio;
        LocalTime horaFin;
        
        // Variar horarios según el índice de la cancha para tener diversidad
        switch (canchaIndex % 5) {
            case 0: // Horario matutino extendido
                horaInicio = LocalTime.of(6, 0);  // 6:00 AM
                horaFin = LocalTime.of(22, 0);    // 10:00 PM
                break;
            case 1: // Horario estándar
                horaInicio = LocalTime.of(8, 0);  // 8:00 AM
                horaFin = LocalTime.of(23, 0);    // 11:00 PM
                break;
            case 2: // Horario vespertino
                horaInicio = LocalTime.of(10, 0); // 10:00 AM
                horaFin = LocalTime.of(24, 0);    // 12:00 AM (medianoche)
                break;
            case 3: // Horario completo
                horaInicio = LocalTime.of(7, 0);  // 7:00 AM
                horaFin = LocalTime.of(23, 30);   // 11:30 PM
                break;
            default: // Horario reducido
                horaInicio = LocalTime.of(9, 0);  // 9:00 AM
                horaFin = LocalTime.of(21, 0);    // 9:00 PM
                break;
        }

        for (Horario.DiaSemana dia : dias) {
            // Ajustar horarios para fines de semana (más amplios)
            LocalTime inicioFinal = horaInicio;
            LocalTime finFinal = horaFin;
            
            if (dia == Horario.DiaSemana.SABADO || dia == Horario.DiaSemana.DOMINGO) {
                // Los fines de semana abren más temprano y cierran más tarde
                inicioFinal = horaInicio.minusHours(1);
                if (inicioFinal.isBefore(LocalTime.of(6, 0))) {
                    inicioFinal = LocalTime.of(6, 0);
                }
                
                finFinal = horaFin.plusHours(1);
                if (finFinal.isAfter(LocalTime.of(24, 0)) || finFinal.equals(LocalTime.of(0, 0))) {
                    finFinal = LocalTime.of(24, 0);
                }
            }
            
            // Los lunes algunas canchas abren más tarde
            if (dia == Horario.DiaSemana.LUNES && canchaIndex % 3 == 0) {
                inicioFinal = horaInicio.plusHours(2);
            }

            Horario horario = Horario.builder()
                    .canchaId(cancha.getId())
                    .diaSemana(dia)
                    .horaInicio(inicioFinal)
                    .horaFin(finFinal)
                    .activo(true)
                    .build();
            
            horarioRepository.save(horario);
        }
    }
}
