# 🚀 Próximos Pasos - SGC Ultimate Backend

Esta guía te ayudará a comenzar a trabajar con el backend después de la configuración inicial.

## 📋 Checklist de Inicio

### 1. ✅ Configuración Inicial

- [ ] **Clonar el repositorio** (si aún no lo has hecho)
  ```bash
  git clone <repository-url>
  cd backend
  ```

- [ ] **Configurar variables de entorno**
  ```bash
  cp .env.example .env
  # Editar .env con tus configuraciones
  ```

- [ ] **Verificar requisitos**
  - Java 21 instalado: `java -version`
  - Maven instalado: `mvn -version` o usar `./mvnw`
  - MongoDB instalado o Docker disponible

### 2. 🐳 Opción A: Inicio Rápido con Docker (Recomendado)

```bash
# Levantar todo el stack (MongoDB + Backend)
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f backend

# Verificar que todo está corriendo
docker-compose ps

# Acceder a la aplicación
curl http://localhost:8080/api/health
```

**Servicios disponibles:**
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081 (usuario: admin, password: admin123)

### 3. 💻 Opción B: Desarrollo Local

```bash
# 1. Iniciar MongoDB (si no usas Docker)
# En Windows: net start MongoDB
# En Linux/Mac: sudo systemctl start mongod

# 2. Instalar dependencias y compilar
./mvnw clean install

# 3. Ejecutar la aplicación
./mvnw spring-boot:run

# O con perfil específico
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### 4. 🧪 Ejecutar Tests

```bash
# Opción 1: Usar el script de testing
chmod +x scripts/test.sh  # Solo en Linux/Mac
./scripts/test.sh coverage

# Opción 2: Usar Maven directamente
./mvnw test

# Opción 3: Tests con cobertura
./mvnw clean test jacoco:report

# Ver reporte de cobertura
# Abrir: target/site/jacoco/index.html
```

### 5. 📚 Explorar la API

Una vez que la aplicación esté corriendo:

1. **Swagger UI**: http://localhost:8080/swagger-ui.html
   - Documentación interactiva
   - Probar endpoints directamente

2. **Crear usuario de prueba**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "nombreCompleto": "Usuario Prueba",
       "email": "test@example.com",
       "password": "password123",
       "telefono": "123456789"
     }'
   ```

3. **Login y obtener token**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

4. **Usar el token en requests**:
   ```bash
   curl -X GET http://localhost:8080/api/canchas \
     -H "Authorization: Bearer <tu_token_aqui>"
   ```

### 6. 🔍 Verificar el Sistema

```bash
# Health check
curl http://localhost:8080/api/health

# Actuator health
curl http://localhost:8080/actuator/health

# Ver métricas (si están habilitadas)
curl http://localhost:8080/actuator/metrics
```

## 📖 Documentación Importante

Antes de comenzar a desarrollar, lee estos documentos:

1. **README.md** - Información general y setup
2. **API.md** - Documentación completa de endpoints
3. **TESTING.md** - Guía de testing
4. **DEPLOYMENT.md** - Guía de despliegue
5. **SECURITY.md** - Políticas de seguridad

## 🛠️ Herramientas de Desarrollo

### Scripts Útiles

```bash
# Iniciar aplicación con verificaciones
./scripts/start.sh dev

# Ejecutar tests
./scripts/test.sh all
./scripts/test.sh coverage
./scripts/test.sh specific CanchaServiceTest

# Limpiar y compilar
./mvnw clean package

# Generar documentación
./mvnw javadoc:javadoc
```

### Perfiles de Spring

- **local**: Desarrollo local con logs detallados
- **dev**: Desarrollo con configuraciones de desarrollo
- **prod**: Producción con configuraciones optimizadas
- **test**: Testing con base de datos en memoria

```bash
# Cambiar perfil
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## 🔧 Configuración del IDE

### IntelliJ IDEA

1. Importar como proyecto Maven
2. Habilitar Lombok plugin
3. Habilitar annotation processing
4. Configurar Java 21 como SDK

### VS Code

1. Instalar extensiones:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Lombok Annotations Support

2. Configurar settings.json:
   ```json
   {
     "java.configuration.updateBuildConfiguration": "automatic",
     "java.compile.nullAnalysis.mode": "automatic"
   }
   ```

## 🐛 Troubleshooting Común

### Puerto 8080 ya en uso
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### MongoDB no conecta
```bash
# Verificar que MongoDB está corriendo
docker-compose ps

# Reiniciar MongoDB
docker-compose restart mongodb

# Ver logs de MongoDB
docker-compose logs mongodb
```

### Tests fallan
```bash
# Limpiar y recompilar
./mvnw clean install

# Verificar que no hay procesos corriendo
# Cerrar aplicaciones que usen el puerto 8080
```

## 📊 Monitoreo y Logs

### Ver logs en tiempo real

```bash
# Con Docker
docker-compose logs -f backend

# Logs locales
tail -f logs/sgc-ultimate.log

# Solo errores
tail -f logs/sgc-ultimate-error.log
```

### Actuator Endpoints

- `/actuator/health` - Estado de salud
- `/actuator/info` - Información de la app
- `/actuator/metrics` - Métricas de rendimiento

## 🎯 Tareas Recomendadas

### Para Desarrolladores Nuevos

1. [ ] Familiarizarse con la estructura del proyecto
2. [ ] Leer la documentación de la API
3. [ ] Ejecutar todos los tests
4. [ ] Probar endpoints con Swagger UI
5. [ ] Revisar el código de ejemplo en los servicios
6. [ ] Crear un endpoint simple de prueba

### Para Desarrollo Continuo

1. [ ] Aumentar cobertura de tests (objetivo: 80%+)
2. [ ] Agregar más tests de integración
3. [ ] Implementar rate limiting
4. [ ] Agregar más validaciones de negocio
5. [ ] Optimizar queries de MongoDB
6. [ ] Implementar caché en endpoints frecuentes
7. [ ] Agregar más logs de auditoría

### Para Producción

1. [ ] Configurar CI/CD (GitHub Actions, Jenkins, etc.)
2. [ ] Configurar monitoreo (Prometheus, Grafana)
3. [ ] Implementar backups automáticos de MongoDB
4. [ ] Configurar alertas de errores
5. [ ] Optimizar configuración de producción
6. [ ] Realizar pruebas de carga
7. [ ] Documentar procedimientos de rollback

## 🔐 Seguridad

### Antes de Producción

- [ ] Cambiar `JWT_SECRET` a un valor único y seguro
- [ ] Configurar HTTPS/SSL
- [ ] Revisar y actualizar dependencias
- [ ] Configurar rate limiting
- [ ] Implementar logging de seguridad
- [ ] Revisar configuración de CORS
- [ ] Habilitar headers de seguridad

## 📞 Soporte

Si encuentras problemas:

1. Revisa la documentación en `/docs`
2. Busca en los issues de GitHub
3. Consulta el TROUBLESHOOTING en DEPLOYMENT.md
4. Contacta al equipo de desarrollo

## 🎉 ¡Listo para Comenzar!

Una vez completados los pasos anteriores, estarás listo para:

- ✅ Desarrollar nuevas funcionalidades
- ✅ Corregir bugs
- ✅ Mejorar el código existente
- ✅ Agregar tests
- ✅ Desplegar a producción

**¡Feliz desarrollo! 🚀**

---

**Última actualización**: 2024-01-15
