package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.PagoRequestDTO;
import com.project_sgc_ultimate.dto.PagoResponseDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.model.Pago;
import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.repository.PagoRepository;
import com.project_sgc_ultimate.repository.ReservaRepository;
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
    private final ReservaRepository reservaRepository;
    private final AuditoriaService auditoriaService;

    public List<PagoResponseDTO> listarPorReserva(String reservaId) {
        List<Pago> pagos = pagoRepository.findByReservaId(reservaId);
        return pagos.stream()
                .map(PagoResponseDTO::fromEntity)
                .toList();
    }

    public List<PagoResponseDTO> listarPorUsuario(String usuarioId) {
        List<Pago> pagos = pagoRepository.findByUsuarioId(usuarioId);
        return pagos.stream()
                .map(PagoResponseDTO::fromEntity)
                .toList();
    }

    public PagoResponseDTO obtenerPorId(String id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pago no encontrado"
                ));
        return PagoResponseDTO.fromEntity(pago);
    }

    @Transactional
    public PagoResponseDTO registrarPago(PagoRequestDTO dto) {

        if (dto.getReservaId() == null || dto.getReservaId().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La reservaId es obligatoria"
            );
        }

        Reserva reserva = reservaRepository.findById(dto.getReservaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva asociada al pago no encontrada"
                ));

        if (dto.getMonto() == null || dto.getMonto().signum() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El monto del pago debe ser mayor a 0"
            );
        }

        Pago.MetodoPago metodo;
        try {
            metodo = Pago.MetodoPago.valueOf(dto.getMetodo().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Método de pago inválido"
            );
        }

        Pago pago = Pago.builder()
                .reservaId(reserva.getId())
                .usuarioId(reserva.getUsuarioId())
                .monto(dto.getMonto())
                .metodo(metodo)
                .estado(Pago.EstadoPago.PAGADO)
                .fechaPago(LocalDateTime.now())
                .referencia(dto.getReferencia())
                .build();

        Pago guardado = pagoRepository.save(pago);

        // Auditoría
        auditoriaService.registrar(
                "Pago",
                guardado.getId(),
                reserva.getId(),
                Auditoria.Accion.CREACION,
                "Pago registrado por monto: " + guardado.getMonto()
        );

        return PagoResponseDTO.fromEntity(guardado);
    }
}
