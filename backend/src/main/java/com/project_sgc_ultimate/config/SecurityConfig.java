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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // Para APIs REST con JWT, CSRF se desactiva
            .csrf(AbstractHttpConfigurer::disable)

            // Desactivar login form y httpBasic por seguridad (solo JWT)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)

            // No guardamos sesión en el servidor, todo por token
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Autorización por endpoint
            .authorizeHttpRequests(auth -> auth
                // OPTIONS siempre permitido (CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Endpoints públicos (no requieren token)
                .requestMatchers(
                        "/api/health",           // health custom tuyo
                        "/actuator/health",      // health de actuator
                        "/v3/api-docs/**",       // Swagger/OpenAPI
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()

                // Auth solo POST (register / login)
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()

                // Actuator extra (NO públicos por seguridad)
                // Si algún día quieres proteger info/metrics con rol ADMIN,
                // puedes descomentar esto y exponerlos en application.properties:
                // .requestMatchers("/actuator/info", "/actuator/metrics").hasRole("ADMIN")

                // Canchas: GET para CLIENTE / ADMIN / EMPLEADO, resto sólo ADMIN / EMPLEADO
                .requestMatchers(HttpMethod.GET, "/api/canchas/**")
                    .hasAnyRole("CLIENTE", "ADMIN", "EMPLEADO")
                .requestMatchers("/api/canchas/**")
                    .hasAnyRole("ADMIN", "EMPLEADO")

                // Reservas: CLIENTE y ADMIN
                .requestMatchers("/api/reservas/**")
                    .hasAnyRole("CLIENTE", "ADMIN")

                // Pagos: GET -> CLIENTE y ADMIN, resto solo ADMIN
                .requestMatchers(HttpMethod.GET, "/api/pagos/**")
                    .hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/pagos/**")
                    .hasRole("ADMIN")

                // Notificaciones: CLIENTE y ADMIN
                .requestMatchers("/api/notificaciones/**")
                    .hasAnyRole("CLIENTE", "ADMIN")

                // Horarios: GET -> CLIENTE y ADMIN, resto solo ADMIN
                .requestMatchers(HttpMethod.GET, "/api/horarios/**")
                    .hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/horarios/**")
                    .hasRole("ADMIN")

                // Auditorías: solo ADMIN
                .requestMatchers("/api/auditorias/**")
                    .hasRole("ADMIN")

                // Usuarios: sólo ADMIN
                .requestMatchers("/api/usuarios/**")
                    .hasRole("ADMIN")

                // Cualquier otro endpoint requiere autenticación
                .anyRequest().authenticated()
            )

            // Filtro JWT antes del UsernamePasswordAuthenticationFilter
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
