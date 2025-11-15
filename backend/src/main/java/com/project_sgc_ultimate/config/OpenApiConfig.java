package com.project_sgc_ultimate.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "PROJECT SGC ULTIMATE API",
        version = "1.0",
        description = "API RESTful para gestión de reservas, usuarios, canchas y pagos",
        contact = @Contact(name = "Miguel", email = "miguel@example.com"),
        license = @License(name = "MIT", url = "https://opensource.org/licenses/MIT")
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Servidor local de desarrollo")
    }
)
public class OpenApiConfig {
    // No se necesita lógica adicional, solo anotaciones
}
