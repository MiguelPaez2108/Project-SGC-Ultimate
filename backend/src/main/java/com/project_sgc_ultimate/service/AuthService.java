package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.AuthRequest;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import com.project_sgc_ultimate.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Usuario register(Usuario usuario) {

        usuarioRepository.findByEmailIgnoreCase(usuario.getEmail())
                .ifPresent(u -> { throw new RuntimeException("El correo ya está registrado"); });

        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        usuario.setActivo(true);

        return usuarioRepository.save(usuario);
    }

    public String login(AuthRequest request) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }

        return jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().name());
    }
}
