package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.AuthRequest;
import com.project_sgc_ultimate.dto.AuthResponse;
import com.project_sgc_ultimate.dto.RegisterRequest;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import com.project_sgc_ultimate.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Registro de usuario:
     * - Valida que el correo no exista
     * - Normaliza email
     * - Hashea la contraseña
     * - Asigna rol por defecto CLIENTE si no viene uno
     * - Devuelve token + id + rol del usuario creado
     */
    public AuthResponse register(RegisterRequest request) {
        // Normalizar email
        String emailNormalizado = request.getEmail().trim().toLowerCase();

        // Verificar si el correo ya está registrado
        usuarioRepository.findByEmailIgnoreCase(emailNormalizado)
                .ifPresent(u -> {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "El correo ya está registrado"
                    );
                });

        // Rol por defecto si no se envía
        Usuario.RolUsuario rol = request.getRol() != null
                ? request.getRol()
                : Usuario.RolUsuario.CLIENTE;

        // Construir la entidad Usuario
        Usuario usuario = Usuario.builder()
                .nombreCompleto(request.getNombreCompleto())
                .email(emailNormalizado)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .rol(rol)
                .activo(true)
                .build();

        // Guardar en la BD
        Usuario guardado = usuarioRepository.save(usuario);

        // Generar token JWT
        String token = jwtUtil.generarToken(
                guardado.getEmail(),
                guardado.getRol().name()
        );

        // Devolver respuesta de autenticación
        return new AuthResponse(
                token,
                guardado.getId(),
                guardado.getRol().name()
        );
    }

    /**
     * Login:
     * - Busca usuario por email
     * - Verifica que esté activo
     * - Valida contraseña con BCrypt
     * - Devuelve token + id + rol
     */
    public AuthResponse login(AuthRequest request) {
        String emailNormalizado = request.getEmail().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(emailNormalizado)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario o contraseña incorrectos"
                ));

        // Opcional pero recomendado: bloquear usuarios inactivos
        if (Boolean.FALSE.equals(usuario.getActivo())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario inactivo, contacta con el administrador"
            );
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario o contraseña incorrectos"
            );
        }

        String token = jwtUtil.generarToken(
                usuario.getEmail(),
                usuario.getRol().name()
        );

        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getRol().name()
        );
    }
}
