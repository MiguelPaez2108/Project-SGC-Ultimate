package com.project_sgc_ultimate.controller;

import com.project_sgc_ultimate.dto.AuthRequest;
import com.project_sgc_ultimate.dto.AuthResponse;
import com.project_sgc_ultimate.model.Usuario;
import com.project_sgc_ultimate.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario usuario) {
        Usuario creado = authService.register(usuario);
        return ResponseEntity.ok(creado);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponse(token, null, null));
    }
}
