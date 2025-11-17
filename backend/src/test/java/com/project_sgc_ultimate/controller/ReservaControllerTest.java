package com.project_sgc_ultimate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project_sgc_ultimate.dto.ReservaRequestDTO;
import com.project_sgc_ultimate.dto.ReservaResponseDTO;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.model.Reserva;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.CanchaRepository;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import com.project_sgc_ultimate.service.ReservaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservaController.class)
class ReservaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservaService reservaService;

    @MockBean
    private CanchaRepository canchaRepository;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Reserva reserva;
    private ReservaResponseDTO responseDTO;
    private ReservaRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        reserva = Reserva.builder()
                .id("reserva1")
                .canchaId("cancha1")
                .usuarioId("usuario1")
                .fechaInicio(LocalDateTime.now().plusHours(1))
                .fechaFin(LocalDateTime.now().plusHours(2))
                .precioTotal(BigDecimal.valueOf(100))
                .estado(Reserva.EstadoReserva.PENDIENTE)
                .build();

        responseDTO = ReservaResponseDTO.builder()
                .id("reserva1")
                .canchaId("cancha1")
                .canchaNombre("Cancha 1")
                .usuarioId("usuario1")
                .usuarioNombre("Usuario Test")
                .estado("PENDIENTE")
                .precioTotal(BigDecimal.valueOf(100))
                .fechaInicio(reserva.getFechaInicio().toString())
                .fechaFin(reserva.getFechaFin().toString())
                .build();

        requestDTO = new ReservaRequestDTO();
        requestDTO.setCanchaId("cancha1");
        requestDTO.setUsuarioId("usuario1");
        requestDTO.setFechaInicio(reserva.getFechaInicio());
        requestDTO.setFechaFin(reserva.getFechaFin());
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void listarTodas_DeberiaRetornarListaDeReservas() throws Exception {
        when(reservaService.listarTodas()).thenReturn(List.of(reserva));
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(Cancha.builder().nombre("Cancha 1").build()));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(Usuario.builder().nombreCompleto("Usuario Test").build()));

        mockMvc.perform(get("/api/reservas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("reserva1"))
                .andExpect(jsonPath("$[0].canchaNombre").value("Cancha 1"))
                .andExpect(jsonPath("$[0].usuarioNombre").value("Usuario Test"));
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void obtenerPorId_DeberiaRetornarReserva() throws Exception {
        when(reservaService.obtenerPorId("reserva1")).thenReturn(reserva);
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(Cancha.builder().nombre("Cancha 1").build()));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(Usuario.builder().nombreCompleto("Usuario Test").build()));

        mockMvc.perform(get("/api/reservas/reserva1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("reserva1"))
                .andExpect(jsonPath("$.canchaNombre").value("Cancha 1"));
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void crear_DeberiaCrearReserva() throws Exception {
        when(reservaService.crearDesdeDto(any(ReservaRequestDTO.class))).thenReturn(reserva);
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(Cancha.builder().nombre("Cancha 1").build()));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(Usuario.builder().nombreCompleto("Usuario Test").build()));

        mockMvc.perform(post("/api/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("reserva1"));
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void actualizarEstado_DeberiaActualizarEstado() throws Exception {
        when(reservaService.actualizarEstado("reserva1", Reserva.EstadoReserva.CONFIRMADA)).thenReturn(reserva);
        when(canchaRepository.findById("cancha1")).thenReturn(Optional.of(Cancha.builder().nombre("Cancha 1").build()));
        when(usuarioRepository.findById("usuario1")).thenReturn(Optional.of(Usuario.builder().nombreCompleto("Usuario Test").build()));

        mockMvc.perform(put("/api/reservas/reserva1/estado")
                        .param("estado", "CONFIRMADA")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("reserva1"));
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void eliminar_DeberiaEliminarReserva() throws Exception {
        mockMvc.perform(delete("/api/reservas/reserva1").with(csrf()))
                .andExpect(status().isNoContent());
    }
}
