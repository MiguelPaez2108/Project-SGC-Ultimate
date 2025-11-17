package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.PagoRequestDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.model.Pago;
import com.project_sgc_ultimate.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final AuditoriaService auditoriaService;

    public List<Pago> listarTodos() {
        return pagoRepository.findAll();
    }

    public List<Pago> listarPorReserva(String reservaId) {
        return pagoRepository.findByReservaId(reservaId);
    }

    public Pago buscarPorId(String id) {
        return pagoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pago no encontrado"));
    }

    @Transactional
    public Pago registrarPagoDesdeDto(PagoRequestDTO dto) {
        Pago pago = Pago.builder()
                .reservaId(dto.getReservaId())
                .monto(dto.getMonto())
                .metodo(Pago.MetodoPago.valueOf(dto.getMetodo()))
                .estado(Pago.EstadoPago.PENDIENTE)
                .fechaPago(LocalDateTime.now())
                .build();

        Pago creado = pagoRepository.save(pago);

        // Auditoría
        auditoriaService.registrar("Pago", creado.getId(), null, Auditoria.Accion.PAGO,
                "Pago registrado: " + creado.getMonto());

        return creado;
    }

    @Transactional
    public Pago actualizarEstado(String id, Pago.EstadoPago nuevoEstado) {
        Pago pago = buscarPorId(id);
        pago.setEstado(nuevoEstado);
        Pago actualizado = pagoRepository.save(pago);

        // Auditoría
        auditoriaService.registrar("Pago", actualizado.getId(), null, Auditoria.Accion.ACTUALIZACION,
                "Estado del pago actualizado a: " + nuevoEstado);

        return actualizado;
    }
}
