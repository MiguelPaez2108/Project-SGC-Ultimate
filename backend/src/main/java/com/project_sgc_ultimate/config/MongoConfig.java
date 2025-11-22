package com.project_sgc_ultimate.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;

@Configuration
@EnableCaching
public class MongoConfig {

    @Bean
    public ApplicationRunner createIndexes(MongoTemplate mongoTemplate) {
        return args -> {

            // Índices para Cancha
            IndexOperations canchaIndexOps = mongoTemplate.indexOps("cancha");
            canchaIndexOps.createIndex(new Index()
                    .on("nombre", org.springframework.data.domain.Sort.Direction.ASC));
            canchaIndexOps.createIndex(new Index()
                    .on("estado", org.springframework.data.domain.Sort.Direction.ASC));
            canchaIndexOps.createIndex(new Index()
                    .on("tipo", org.springframework.data.domain.Sort.Direction.ASC));

            // Índices para Reserva
            IndexOperations reservaIndexOps = mongoTemplate.indexOps("reserva");
            reservaIndexOps.createIndex(new Index()
                    .on("usuarioId", org.springframework.data.domain.Sort.Direction.ASC));
            reservaIndexOps.createIndex(new Index()
                    .on("canchaId", org.springframework.data.domain.Sort.Direction.ASC));
            reservaIndexOps.createIndex(new Index()
                    .on("fechaInicio", org.springframework.data.domain.Sort.Direction.ASC));
            reservaIndexOps.createIndex(new Index()
                    .on("estado", org.springframework.data.domain.Sort.Direction.ASC));

            // Índices para Usuario
            IndexOperations usuarioIndexOps = mongoTemplate.indexOps("usuario");
            usuarioIndexOps.createIndex(new Index()
                    .on("email", org.springframework.data.domain.Sort.Direction.ASC)
                    .unique());
            usuarioIndexOps.createIndex(new Index()
                    .on("rol", org.springframework.data.domain.Sort.Direction.ASC));

            // Índices para Pago
            IndexOperations pagoIndexOps = mongoTemplate.indexOps("pago");
            pagoIndexOps.createIndex(new Index()
                    .on("usuarioId", org.springframework.data.domain.Sort.Direction.ASC));
            pagoIndexOps.createIndex(new Index()
                    .on("reservaId", org.springframework.data.domain.Sort.Direction.ASC));
            pagoIndexOps.createIndex(new Index()
                    .on("fechaPago", org.springframework.data.domain.Sort.Direction.DESC));

            // Índices para Auditoria
            IndexOperations auditoriaIndexOps = mongoTemplate.indexOps("auditoria");
            auditoriaIndexOps.createIndex(new Index()
                    .on("fecha", org.springframework.data.domain.Sort.Direction.DESC));
            auditoriaIndexOps.createIndex(new Index()
                    .on("usuarioId", org.springframework.data.domain.Sort.Direction.ASC));
        };
    }
}
