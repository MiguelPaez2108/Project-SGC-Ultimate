package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.UsuarioRequestDTO;
import com.project_sgc_ultimate.dto.UsuarioResponseDTO;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();

        List<UsuarioResponseDTO> respuesta = usuarios.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(@PathVariable String id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(mapToResponseDto(usuario));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crear(@RequestBody UsuarioRequestDTO dto) {
        Usuario creado = usuarioService.crearDesdeDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDto(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @PathVariable String id,
            @RequestBody UsuarioRequestDTO dto
    ) {
        Usuario actualizado = usuarioService.actualizarDesdeDto(id, dto);
        return ResponseEntity.ok(mapToResponseDto(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ====== Mapeo interno entidad → DTO ======

    private UsuarioResponseDTO mapToResponseDto(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombreCompleto(usuario.getNombreCompleto())
                .email(usuario.getEmail())
                .rol(usuario.getRol() != null ? usuario.getRol().name() : null)
                .build();
    }
}
