package com.project_sgc_ultimate.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "canchas")
public class Cancha {

    @Id
    private String id;

    @NotBlank(message = "El nombre de la cancha es obligatorio.")
    private String nombre;

    @NotNull(message = "El tipo de cancha es obligatorio.")
    private TipoCancha tipo;      // Enum interno

    private String ubicacion;     // Dirección, barrio, etc.

    @NotNull(message = "El precio por hora es obligatorio.")
    @Positive(message = "El precio por hora debe ser mayor que cero.")
    private BigDecimal precioPorHora;

    @NotNull
    private EstadoCancha estado;

    private Boolean techada;      // true/false si es techada

    public enum TipoCancha {
        FUTSAL,
        FUTBOL_5,
        FUTBOL_7,
        FUTBOL_11,
        OTRO
    }

    public enum EstadoCancha {
        ACTIVA,
        INACTIVA,
        MANTENIMIENTO
    }
}

