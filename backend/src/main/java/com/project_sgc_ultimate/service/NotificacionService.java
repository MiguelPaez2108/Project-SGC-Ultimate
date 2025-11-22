package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.NotificacionRequestDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.model.Notificacion;
import com.project_sgc_ultimate.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final AuditoriaService auditoriaService;

    public List<Notificacion> listarTodas() {
        return notificacionRepository.findAll();
    }

    public List<Notificacion> listarPorUsuario(String usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }

    @Transactional
    public Notificacion enviarDesdeDto(NotificacionRequestDTO dto) {
        Notificacion notificacion = Notificacion.builder()
                .usuarioId(dto.getUsuarioId())
                .tipo(Notificacion.TipoNotificacion.valueOf(dto.getTipo()))
                .mensaje(dto.getMensaje())
                .leida(false)
                .fechaEnvio(LocalDateTime.now())
                .build();

        Notificacion creada = notificacionRepository.save(notificacion);

        // Auditoría
        auditoriaService.registrar("Notificacion", creada.getId(), null, Auditoria.Accion.CREACION,
                "Notificación enviada: " + creada.getMensaje());

        return creada;
    }

    @Transactional
    public Notificacion marcarComoLeida(String id) {
        Notificacion existente = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificación no encontrada"));
        existente.setLeida(true);
        Notificacion actualizada = notificacionRepository.save(existente);

        // Auditoría
        auditoriaService.registrar("Notificacion", actualizada.getId(), null, Auditoria.Accion.ACTUALIZACION,
                "Notificación marcada como leída");

        return actualizada;
    }
}
