package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.model.Notificacion;
import com.project_sgc_ultimate.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;

    public List<Notificacion> listarPorUsuario(String usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }

    public Notificacion enviar(Notificacion notificacion) {
        notificacion.setFechaEnvio(LocalDateTime.now());
        if (notificacion.getLeida() == null) {
            notificacion.setLeida(false);
        }
        return notificacionRepository.save(notificacion);
    }

    public Notificacion marcarComoLeida(String id) {
        Notificacion existente = notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        existente.setLeida(true);
        return notificacionRepository.save(existente);
    }
}
