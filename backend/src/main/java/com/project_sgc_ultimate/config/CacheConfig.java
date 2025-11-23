package com.project_sgc_ultimate.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * Configuración de caché para mejorar el rendimiento de la aplicación.
 * Utiliza caché en memoria para datos que se consultan frecuentemente.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Configura el gestor de caché con diferentes cachés para distintos tipos de datos.
     * 
     * Cachés disponibles:
     * - canchas: Para almacenar información de canchas
     * - usuarios: Para almacenar información de usuarios
     * - horarios: Para almacenar horarios disponibles
     * - reservas: Para almacenar reservas activas
     */
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("canchas"),
            new ConcurrentMapCache("usuarios"),
            new ConcurrentMapCache("horarios"),
            new ConcurrentMapCache("reservas"),
            new ConcurrentMapCache("pagos")
        ));
        return cacheManager;
    }
}
