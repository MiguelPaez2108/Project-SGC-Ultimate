# Performance Optimizations

## Implemented Optimizations

### 1. MongoDB Indexes
- **Location**: `MongoConfig.java`
- **Indexes created**:
  - Cancha: nombre, estado, tipo
  - Reserva: usuarioId, canchaId, fechaInicio, estado
  - Usuario: email (unique), rol
  - Pago: usuarioId, reservaId, fechaPago
  - Auditoria: fecha, usuarioId

### 2. Caching
- **Enabled**: Spring Cache abstraction
- **Configuration**: `@EnableCaching` in MongoConfig
- **Recommended usage**: Add `@Cacheable` to frequently accessed read-only data

Example:
```java
@Cacheable("canchas")
public List<Cancha> getAllCanchas() {
    return canchaRepository.findAll();
}
```

### 3. Query Optimization
- Use projection to fetch only required fields
- Implement pagination for large datasets
- Use compound indexes for complex queries

### 4. Connection Pooling
- MongoDB connection pool configured in `application.properties`
- Default pool size: 100 connections

## Recommendations for Production

### 1. Enable Compression
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/sgc?compressors=snappy
```

### 2. Add Redis for Caching
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 3. Implement Rate Limiting
Use Spring Cloud Gateway or custom interceptor for API rate limiting

### 4. Enable HTTP/2
```properties
server.http2.enabled=true
```

### 5. Use CDN for Static Resources
Serve static files through CDN in production

## Monitoring

### 1. Spring Boot Actuator
Add dependency:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Enable endpoints in `application.properties`:
```properties
management.endpoints.web.exposure.include=health,metrics,info
```

### 2. Metrics
- Monitor response times
- Track error rates
- Monitor database query performance
- Track memory usage

## Load Testing

Use tools like:
- Apache JMeter
- Gatling
- K6

Example JMeter test plan:
1. 100 concurrent users
2. Ramp-up period: 10 seconds
3. Test duration: 5 minutes
4. Monitor response times and error rates
