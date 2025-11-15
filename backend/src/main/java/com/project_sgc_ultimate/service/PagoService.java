package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.model.Pago;
import com.project_sgc_ultimate.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;

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

    public Pago registrarPago(Pago pago) {
        pago.setFechaPago(LocalDateTime.now());
        return pagoRepository.save(pago);
    }

    public Pago actualizarEstado(String id, Pago.EstadoPago nuevoEstado) {
        Pago pago = buscarPorId(id);
        pago.setEstado(nuevoEstado);
        return pagoRepository.save(pago);
    }
}
