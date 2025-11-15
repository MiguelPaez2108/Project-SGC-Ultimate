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
            .csrf().disable()  // Deshabilita CSRF para APIs REST (temporal)
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**").permitAll()  // Permite acceso a /api/* sin login
                .anyRequest().authenticated()
            )
            .formLogin().disable()  // Deshabilita el login por defecto
            .httpBasic().disable();  // Deshabilita autenticación básica
        return http.build();
    }
}