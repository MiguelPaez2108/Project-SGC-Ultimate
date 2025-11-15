package com.project_sgc_ultimate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF: deshabilitado (solo si tu API es stateless)
            .csrf(csrf -> csrf.disable())

            // Autorización de rutas
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**").permitAll()   // acceso libre a /api/**
                .anyRequest().authenticated()             // el resto requiere autenticación
            )

            // Deshabilitar login por formulario
            .formLogin(form -> form.disable())

            // Deshabilitar autenticación básica
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
