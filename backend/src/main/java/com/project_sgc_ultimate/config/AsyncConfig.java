package com.project_sgc_ultimate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Configuración para procesamiento asíncrono.
 * Permite ejecutar tareas en segundo plano sin bloquear el hilo principal.
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * Configura el executor para tareas asincronas.
     * Util para envio de notificaciones, procesamiento de pagos, etc.
     */
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
