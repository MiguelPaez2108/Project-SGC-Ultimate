package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.ReservaRequestDTO;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.CanchaRepository;
import com.project_sgc_ultimate.repository.ReservaRepository;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private CanchaRepository canchaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ReservaService reservaService;

    private ReservaRequestDTO requestDTO;
    private Cancha cancha;
    private Usuario usuario;
    private Reserva reserva;

    @BeforeEach
    void setUp() {
        requestDTO = new ReservaRequestDTO();
        requestDTO.setCanchaId("cancha1");
        requestDTO.setUsuarioId("usuario1");
        requestDTO.setFechaInicio(LocalDateTime.now().plusHours(1));
        requestDTO.setFechaFin(LocalDateTime.now().plusHours(2));

        cancha = Cancha.builder()
                .id("cancha1")
                .nombre("Cancha 1")
                .precioPorHora(BigDecimal.valueOf(50))
                .build();

        usuario = Usuario.builder()
                .id("usuario1")
                .email("test@example.com")
                .build();

        reserva = Reserva.builder()
                .id("reserva1")
                .canchaId("cancha1")
                .usuarioId("usuario1")
                .fechaInicio(requestDTO.getFechaInicio())
                .fechaFin(requestDTO.getFechaFin())
                .precioTotal(BigDecimal.valueOf(50))
                .estado(Reserva.EstadoReserva.PENDIENTE)
                .build();
    }

    @Test
    void crearDesdeDto_DeberiaCrearReservaCorrectamente() {
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(cancha));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(usuario));
        when(reservaRepository.findAll()).thenReturn(List.of());
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reserva);

        Reserva result = reservaService.crearDesdeDto(requestDTO);

        assertNotNull(result);
        assertEquals("cancha1", result.getCanchaId());
        assertEquals("usuario1", result.getUsuarioId());
        assertEquals(BigDecimal.valueOf(50), result.getPrecioTotal());
        verify(reservaRepository).save(any(Reserva.class));
    }

    @Test
    void crearDesdeDto_CanchaNoEncontrada_DeberiaLanzarExcepcion() {
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> reservaService.crearDesdeDto(requestDTO));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Cancha no encontrada", exception.getReason());
    }

    @Test
    void crearDesdeDto_UsuarioNoEncontrado_DeberiaLanzarExcepcion() {
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(cancha));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> reservaService.crearDesdeDto(requestDTO));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Usuario no encontrado", exception.getReason());
    }

    @Test
    void crearDesdeDto_FechaInicioPasado_DeberiaLanzarExcepcion() {
        requestDTO.setFechaInicio(LocalDateTime.now().minusHours(1));
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(cancha));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(usuario));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> reservaService.crearDesdeDto(requestDTO));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("La fecha de inicio no puede ser en el pasado", exception.getReason());
    }

    @Test
    void crearDesdeDto_FechaFinAntesDeInicio_DeberiaLanzarExcepcion() {
        requestDTO.setFechaFin(requestDTO.getFechaInicio().minusHours(1));
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(cancha));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(usuario));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> reservaService.crearDesdeDto(requestDTO));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("La fecha/hora de fin debe ser posterior a la de inicio", exception.getReason());
    }

    @Test
    void crearDesdeDto_Solapamiento_DeberiaLanzarExcepcion() {
        Reserva existingReserva = Reserva.builder()
                .canchaId("cancha1")
                .fechaInicio(requestDTO.getFechaInicio().minusMinutes(30))
                .fechaFin(requestDTO.getFechaFin().plusMinutes(30))
                .build();

        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(cancha));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(usuario));
        when(reservaRepository.findAll()).thenReturn(List.of(existingReserva));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> reservaService.crearDesdeDto(requestDTO));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("La cancha ya está reservada en ese horario", exception.getReason());
    }

    @Test
    void listarTodas_DeberiaRetornarListaDeReservas() {
        when(reservaRepository.findAll()).thenReturn(List.of(reserva));

        List<Reserva> result = reservaService.listarTodas();

        assertEquals(1, result.size());
        assertEquals(reserva, result.get(0));
    }

    @Test
    void obtenerPorId_DeberiaRetornarReserva() {
        when(reservaRepository.findById("reserva1")).thenReturn(Optional.of(reserva));

        Reserva result = reservaService.obtenerPorId("reserva1");

        assertEquals(reserva, result);
    }

    @Test
    void obtenerPorId_ReservaNoEncontrada_DeberiaLanzarExcepcion() {
        when(reservaRepository.findById("reserva1")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> reservaService.obtenerPorId("reserva1"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Reserva no encontrada", exception.getReason());
    }

    @Test
    void actualizarEstado_DeberiaActualizarEstado() {
        when(reservaRepository.findById("reserva1")).thenReturn(Optional.of(reserva));
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reserva);

        Reserva result = reservaService.actualizarEstado("reserva1", Reserva.EstadoReserva.CONFIRMADA);

        assertEquals(Reserva.EstadoReserva.CONFIRMADA, result.getEstado());
        verify(reservaRepository).save(reserva);
    }

    @Test
    void eliminar_DeberiaEliminarReserva() {
        when(reservaRepository.existsById("reserva1")).thenReturn(true);

        assertDoesNotThrow(() -> reservaService.eliminar("reserva1"));
        verify(reservaRepository).deleteById("reserva1");
    }

    @Test
    void eliminar_ReservaNoEncontrada_DeberiaLanzarExcepcion() {
        when(reservaRepository.existsById("reserva1")).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> reservaService.eliminar("reserva1"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Reserva no encontrada", exception.getReason());
    }
}
