package com.project_sgc_ultimate.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000",  // React con CRA u otros
                        "http://localhost:8080",  // por si sirves algo desde el backend
                        "http://localhost:5173"   // Vite (muy probable que lo uses)
                        // Cuando tengas frontend en producción, agregas algo tipo:
                        // "https://sgc-ultimate-frontend.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
