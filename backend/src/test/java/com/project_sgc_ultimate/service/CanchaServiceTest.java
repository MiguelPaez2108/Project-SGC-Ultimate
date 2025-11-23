package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.CanchaRequestDTO;
import com.project_sgc_ultimate.model.Auditoria;
import com.project_sgc_ultimate.model.Cancha;
import com.project_sgc_ultimate.repository.CanchaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CanchaServiceTest {

    @Mock
    private CanchaRepository canchaRepository;

    @Mock
    private AuditoriaService auditoriaService;

    @InjectMocks
    private CanchaService canchaService;

    private Cancha cancha;
    private CanchaRequestDTO canchaRequestDTO;

    @BeforeEach
    void setUp() {
        cancha = Cancha.builder()
                .id("1")
                .nombre("Cancha de Fútbol 1")
                .tipo(Cancha.TipoCancha.FUTBOL_5)
                .ubicacion("Sector A")
                .precioPorHora(new BigDecimal("50.00"))
                .estado(Cancha.EstadoCancha.ACTIVA)
                .techada(false)
                .imagenUrl("https://example.com/cancha1.jpg")
                .build();

        canchaRequestDTO = new CanchaRequestDTO();
        canchaRequestDTO.setNombre("Cancha de Fútbol 1");
        canchaRequestDTO.setTipo("FUTBOL_5");
        canchaRequestDTO.setUbicacion("Sector A");
        canchaRequestDTO.setPrecioPorHora(new BigDecimal("50.00"));
        canchaRequestDTO.setTechada(false);
        canchaRequestDTO.setImagenUrl("https://example.com/cancha1.jpg");
    }

    @Test
    void testListarTodas_Success() {
        // Arrange
        List<Cancha> canchas = Arrays.asList(cancha);
        when(canchaRepository.findAll()).thenReturn(canchas);

        // Act
        List<Cancha> result = canchaService.listarTodas();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Cancha de Fútbol 1", result.get(0).getNombre());
        verify(canchaRepository, times(1)).findAll();
    }

    @Test
    void testListarActivas_Success() {
        // Arrange
        List<Cancha> canchas = Arrays.asList(cancha);
        when(canchaRepository.findByEstado(Cancha.EstadoCancha.ACTIVA)).thenReturn(canchas);

        // Act
        List<Cancha> result = canchaService.listarActivas();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(Cancha.EstadoCancha.ACTIVA, result.get(0).getEstado());
        verify(canchaRepository, times(1)).findByEstado(Cancha.EstadoCancha.ACTIVA);
    }

    @Test
    void testBuscarPorId_Success() {
        // Arrange
        when(canchaRepository.findById("1")).thenReturn(Optional.of(cancha));

        // Act
        Cancha result = canchaService.buscarPorId("1");

        // Assert
        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("Cancha de Fútbol 1", result.getNombre());
        verify(canchaRepository, times(1)).findById("1");
    }

    @Test
    void testBuscarPorId_NotFound() {
        // Arrange
        when(canchaRepository.findById(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            canchaService.buscarPorId("999");
        });
        verify(canchaRepository, times(1)).findById("999");
    }

    @Test
    void testCrearDesdeDto_Success() {
        // Arrange
        when(canchaRepository.findByNombreIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(canchaRepository.save(any(Cancha.class))).thenReturn(cancha);
        doNothing().when(auditoriaService).registrar(anyString(), anyString(), any(), any(Auditoria.Accion.class), anyString());

        // Act
        Cancha result = canchaService.crearDesdeDto(canchaRequestDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Cancha de Fútbol 1", result.getNombre());
        verify(canchaRepository, times(1)).findByNombreIgnoreCase(anyString());
        verify(canchaRepository, times(1)).save(any(Cancha.class));
        verify(auditoriaService, times(1)).registrar(eq("Cancha"), anyString(), any(), eq(Auditoria.Accion.CREACION), anyString());
    }

    @Test
    void testCrearDesdeDto_NombreDuplicado() {
        // Arrange
        when(canchaRepository.findByNombreIgnoreCase(anyString())).thenReturn(Optional.of(cancha));

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            canchaService.crearDesdeDto(canchaRequestDTO);
        });
        verify(canchaRepository, times(1)).findByNombreIgnoreCase(anyString());
        verify(canchaRepository, never()).save(any(Cancha.class));
    }

    @Test
    void testActualizarDesdeDto_Success() {
        // Arrange
        when(canchaRepository.findById("1")).thenReturn(Optional.of(cancha));
        when(canchaRepository.save(any(Cancha.class))).thenReturn(cancha);
        doNothing().when(auditoriaService).registrar(anyString(), anyString(), any(), any(Auditoria.Accion.class), anyString());

        canchaRequestDTO.setNombre("Cancha Actualizada");
        canchaRequestDTO.setPrecioPorHora(new BigDecimal("60.00"));

        // Act
        Cancha result = canchaService.actualizarDesdeDto("1", canchaRequestDTO);

        // Assert
        assertNotNull(result);
        verify(canchaRepository, times(1)).findById("1");
        verify(canchaRepository, times(1)).save(any(Cancha.class));
        verify(auditoriaService, times(1)).registrar(eq("Cancha"), eq("1"), any(), eq(Auditoria.Accion.ACTUALIZACION), anyString());
    }

    @Test
    void testActualizarDesdeDto_NotFound() {
        // Arrange
        when(canchaRepository.findById(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            canchaService.actualizarDesdeDto("999", canchaRequestDTO);
        });
        verify(canchaRepository, times(1)).findById("999");
        verify(canchaRepository, never()).save(any(Cancha.class));
    }

    @Test
    void testEliminar_Success() {
        // Arrange
        when(canchaRepository.findById("1")).thenReturn(Optional.of(cancha));
        when(canchaRepository.save(any(Cancha.class))).thenReturn(cancha);
        doNothing().when(auditoriaService).registrar(anyString(), anyString(), any(), any(Auditoria.Accion.class), anyString());

        // Act
        canchaService.eliminar("1");

        // Assert
        verify(canchaRepository, times(1)).findById("1");
        verify(canchaRepository, times(1)).save(any(Cancha.class));
        verify(auditoriaService, times(1)).registrar(eq("Cancha"), eq("1"), any(), eq(Auditoria.Accion.ELIMINACION), anyString());
    }

    @Test
    void testEliminar_NotFound() {
        // Arrange
        when(canchaRepository.findById(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            canchaService.eliminar("999");
        });
        verify(canchaRepository, times(1)).findById("999");
        verify(canchaRepository, never()).save(any(Cancha.class));
    }
}
