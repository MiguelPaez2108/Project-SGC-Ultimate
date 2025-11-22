package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.dto.UsuarioRequestDTO;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(String id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"
                ));
    }

    public Usuario crearDesdeDto(UsuarioRequestDTO dto) {

        usuarioRepository.findByEmailIgnoreCase(dto.getEmail())
                .ifPresent(u -> {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "El correo ya está registrado"
                    );
                });

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setEmail(dto.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        usuario.setActivo(true);

        if (dto.getRol() != null) {
            try {
                usuario.setRol(Usuario.RolUsuario.valueOf(dto.getRol().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Rol inválido. Use ADMIN, CLIENTE o EMPLEADO."
                );
            }
        } else {
            usuario.setRol(Usuario.RolUsuario.CLIENTE);
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarDesdeDto(String id, UsuarioRequestDTO dto) {
        Usuario usuario = obtenerPorId(id);

        if (dto.getNombreCompleto() != null) {
            usuario.setNombreCompleto(dto.getNombreCompleto());
        }

        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(usuario.getEmail())) {
            usuarioRepository.findByEmailIgnoreCase(dto.getEmail())
                    .ifPresent(u -> {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "El correo ya está en uso por otro usuario"
                        );
                    });
            usuario.setEmail(dto.getEmail());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRol() != null) {
            try {
                usuario.setRol(Usuario.RolUsuario.valueOf(dto.getRol().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Rol inválido. Use ADMIN, CLIENTE o EMPLEADO."
                );
            }
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarActivo(String id, Boolean activo) {
        Usuario usuario = obtenerPorId(id);
        usuario.setActivo(activo);
        return usuarioRepository.save(usuario);
    }

    public void eliminar(String id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}
