package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UsuarioControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllUsuarios() throws Exception {
        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetUsuarioById() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setEmail("test@test.com");
        usuario.setNombreCompleto("Test User");
        usuario.setRol(Usuario.RolUsuario.CLIENTE);
        usuario.setActivo(true);
        Usuario saved = usuarioRepository.save(usuario);

        mockMvc.perform(get("/api/usuarios/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@test.com"));

        usuarioRepository.delete(saved);
    }

    @Test
    void testGetUsuarios_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isUnauthorized());
    }
}
