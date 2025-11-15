package com.project_sgc_ultimate.service;

import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(String id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    public Usuario registrar(Usuario usuario) {
        usuarioRepository.findByEmailIgnoreCase(usuario.getEmail())
                .ifPresent(u -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo ya está registrado");
                });

        usuario.setFechaRegistro(LocalDateTime.now());
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
        if (usuario.getRol() == null) {
            usuario.setRol(Usuario.RolUsuario.CLIENTE);
        }

        // TODO: aquí deberías hashear la contraseña (passwordHash) antes de guardar.
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(String id, Usuario usuarioActualizado) {
        Usuario existente = buscarPorId(id);

        existente.setNombreCompleto(usuarioActualizado.getNombreCompleto());
        existente.setTelefono(usuarioActualizado.getTelefono());
        existente.setRol(usuarioActualizado.getRol());
        existente.setActivo(usuarioActualizado.getActivo());

        return usuarioRepository.save(existente);
    }

    public void desactivar(String id) {
        Usuario existente = buscarPorId(id);
        existente.setActivo(false);
        usuarioRepository.save(existente);
    }
}
