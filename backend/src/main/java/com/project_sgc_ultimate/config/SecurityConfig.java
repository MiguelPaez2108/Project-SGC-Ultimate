package com.project_sgc_ultimate.config;

import com.project_sgc_ultimate.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos
                .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                // Canchas: GET para todos, POST/PUT/DELETE solo ADMIN/EMPLEADO
                .requestMatchers(HttpMethod.GET, "/api/canchas/**").hasAnyRole("CLIENTE", "ADMIN", "EMPLEADO")
                .requestMatchers("/api/canchas/**").hasAnyRole("ADMIN", "EMPLEADO")

                // Reservas: CLIENTE puede crear/ver sus reservas, ADMIN puede ver todas
                .requestMatchers("/api/reservas/**").hasAnyRole("CLIENTE", "ADMIN")

                // Usuarios: solo ADMIN puede listar o modificar
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                // El resto requiere autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
