package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.AuthRequest;
import com.project_sgc_ultimate.dto.AuthResponse;
import com.project_sgc_ultimate.dto.RegisterRequest;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import com.project_sgc_ultimate.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;
    private RegisterRequest registerRequest;
    private AuthRequest authRequest;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id("1")
                .nombreCompleto("Juan Pérez")
                .email("juan@example.com")
                .passwordHash("encodedPassword")
                .telefono("123456789")
                .rol(Usuario.RolUsuario.CLIENTE)
                .activo(true)
                .build();

        registerRequest = new RegisterRequest();
        registerRequest.setNombreCompleto("Juan Pérez");
        registerRequest.setEmail("juan@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setTelefono("123456789");

        authRequest = new AuthRequest();
        authRequest.setEmail("juan@example.com");
        authRequest.setPassword("password123");
    }

    @Test
    void testRegister_Success() {
        // Arrange
        when(usuarioRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(jwtUtil.generarToken(anyString(), anyString())).thenReturn("jwt-token");

        // Act
        AuthResponse result = authService.register(registerRequest);

        // Assert
        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals("1", result.getUsuarioId());
        assertEquals("CLIENTE", result.getRol());
        verify(usuarioRepository, times(1)).findByEmailIgnoreCase("juan@example.com");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
        verify(jwtUtil, times(1)).generarToken(anyString(), anyString());
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        // Arrange
        when(usuarioRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(usuario));

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            authService.register(registerRequest);
        });
        verify(usuarioRepository, times(1)).findByEmailIgnoreCase("juan@example.com");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(usuarioRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generarToken(anyString(), anyString())).thenReturn("jwt-token");

        // Act
        AuthResponse result = authService.login(authRequest);

        // Assert
        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals("1", result.getUsuarioId());
        assertEquals("CLIENTE", result.getRol());
        verify(usuarioRepository, times(1)).findByEmailIgnoreCase("juan@example.com");
        verify(passwordEncoder, times(1)).matches("password123", "encodedPassword");
        verify(jwtUtil, times(1)).generarToken(anyString(), anyString());
    }

    @Test
    void testLogin_InvalidCredentials() {
        // Arrange
        when(usuarioRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            authService.login(authRequest);
        });
        verify(usuarioRepository, times(1)).findByEmailIgnoreCase("juan@example.com");
        verify(passwordEncoder, times(1)).matches("password123", "encodedPassword");
        verify(jwtUtil, never()).generarToken(anyString(), anyString());
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(usuarioRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            authService.login(authRequest);
        });
        verify(usuarioRepository, times(1)).findByEmailIgnoreCase("juan@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generarToken(anyString(), anyString());
    }

    @Test
    void testLogin_InactiveUser() {
        // Arrange
        Usuario inactiveUser = Usuario.builder()
                .id("1")
                .nombreCompleto("Juan Pérez")
                .email("juan@example.com")
                .passwordHash("encodedPassword")
                .telefono("123456789")
                .rol(Usuario.RolUsuario.CLIENTE)
                .activo(false)
                .build();
        
        when(usuarioRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(inactiveUser));

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            authService.login(authRequest);
        });
        verify(usuarioRepository, times(1)).findByEmailIgnoreCase("juan@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }
}
