# Guía de Contribución - SGC Ultimate Backend

¡Gracias por tu interés en contribuir al proyecto SGC Ultimate! Esta guía te ayudará a entender cómo puedes colaborar de manera efectiva.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

### Nuestros Estándares

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

## 🤝 ¿Cómo puedo contribuir?

### Reportar Bugs

Los bugs se rastrean como issues de GitHub. Antes de crear un issue:

1. **Verifica** que el bug no haya sido reportado previamente
2. **Usa** la plantilla de bug report
3. **Incluye** información detallada:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Versión de Java, Spring Boot, MongoDB
   - Sistema operativo

### Sugerir Mejoras

Las mejoras también se rastrean como issues. Para sugerir una mejora:

1. **Verifica** que la mejora no haya sido sugerida previamente
2. **Describe** claramente la mejora propuesta
3. **Explica** por qué sería útil para el proyecto
4. **Proporciona** ejemplos de uso si es posible

### Tu Primera Contribución de Código

¿No sabes por dónde empezar? Busca issues etiquetados como:

- `good first issue` - Issues apropiados para principiantes
- `help wanted` - Issues que necesitan ayuda

## 🔧 Configuración del Entorno

### Prerrequisitos

- Java 21
- Maven 3.8+
- MongoDB 6.0+
- Git
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Configuración Inicial

1. **Fork** el repositorio
2. **Clona** tu fork:
   ```bash
   git clone https://github.com/tu-usuario/sgc-ultimate-backend.git
   cd sgc-ultimate-backend/backend
   ```

3. **Configura** el upstream:
   ```bash
   git remote add upstream https://github.com/original/sgc-ultimate-backend.git
   ```

4. **Instala** dependencias:
   ```bash
   ./mvnw clean install
   ```

5. **Configura** variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tus configuraciones
   ```

6. **Ejecuta** la aplicación:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

## 📝 Estándares de Código

### Convenciones de Java

- **Nomenclatura**:
  - Clases: `PascalCase` (ej: `ReservaService`)
  - Métodos: `camelCase` (ej: `crearReserva`)
  - Constantes: `UPPER_SNAKE_CASE` (ej: `MAX_RESERVAS`)
  - Paquetes: `lowercase` (ej: `com.project_sgc_ultimate.service`)

- **Formato**:
  - Indentación: 4 espacios
  - Líneas: máximo 120 caracteres
  - Llaves: estilo Java (misma línea)

### Estructura de Clases

```java
package com.project_sgc_ultimate.service;

import ...

/**
 * Servicio para gestión de reservas
 * 
 * @author Tu Nombre
 * @version 1.0
 */
@Service
@Slf4j
public class ReservaService {
    
    // 1. Constantes
    private static final int MAX_RESERVAS = 10;
    
    // 2. Dependencias inyectadas
    private final ReservaRepository reservaRepository;
    
    // 3. Constructor
    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }
    
    // 4. Métodos públicos
    public ReservaResponseDTO crearReserva(ReservaRequestDTO request) {
        // Implementación
    }
    
    // 5. Métodos privados
    private void validarReserva(ReservaRequestDTO request) {
        // Implementación
    }
}
```

### Documentación

- **JavaDoc** para clases y métodos públicos
- **Comentarios** para lógica compleja
- **README** actualizado con cambios importantes

```java
/**
 * Crea una nueva reserva en el sistema
 * 
 * @param request DTO con los datos de la reserva
 * @return DTO con la reserva creada
 * @throws ReservaException si la cancha no está disponible
 */
public ReservaResponseDTO crearReserva(ReservaRequestDTO request) {
    // Implementación
}
```

### Testing

- **Cobertura mínima**: 80%
- **Nomenclatura**: `testMetodo_Condicion_ResultadoEsperado`
- **Estructura AAA**: Arrange, Act, Assert

```java
@Test
void testCrearReserva_CanchaDisponible_ReservaCreada() {
    // Arrange
    ReservaRequestDTO request = new ReservaRequestDTO();
    when(canchaRepository.findById(anyString())).thenReturn(Optional.of(cancha));
    
    // Act
    ReservaResponseDTO result = reservaService.crearReserva(request);
    
    // Assert
    assertNotNull(result);
    assertEquals("CONFIRMADA", result.getEstado());
    verify(reservaRepository, times(1)).save(any());
}
```

### Manejo de Errores

```java
// Usar excepciones personalizadas
throw new ReservaNotFoundException("Reserva no encontrada: " + id);

// Logging apropiado
log.error("Error al crear reserva: {}", e.getMessage(), e);
log.info("Reserva creada exitosamente: {}", reserva.getId());
log.debug("Detalles de la reserva: {}", reserva);
```

## 🔄 Proceso de Pull Request

### 1. Crear una Rama

```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

Nomenclatura de ramas:
- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `refactor/` - Refactorización
- `docs/` - Documentación
- `test/` - Tests

### 2. Hacer Commits

Usa commits descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: agregar endpoint para cancelar reservas"
git commit -m "fix: corregir validación de fechas en reservas"
git commit -m "docs: actualizar README con nuevos endpoints"
git commit -m "test: agregar tests para ReservaService"
git commit -m "refactor: simplificar lógica de validación"
```

Tipos de commits:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (no afecta código)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

### 3. Mantener Actualizado

```bash
git fetch upstream
git rebase upstream/main
```

### 4. Ejecutar Tests

```bash
# Tests unitarios
./mvnw test

# Tests con cobertura
./mvnw test jacoco:report

# Verificar cobertura en target/site/jacoco/index.html
```

### 5. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego crea el Pull Request en GitHub con:

- **Título descriptivo**
- **Descripción detallada** de los cambios
- **Referencias** a issues relacionados
- **Screenshots** si aplica
- **Checklist** de verificación

### Plantilla de Pull Request

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?
Describe las pruebas realizadas.

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas difíciles
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban mi fix/funcionalidad
- [ ] Los tests unitarios pasan localmente
- [ ] La cobertura de código es >= 80%

## Issues relacionados
Closes #123
```

## 🐛 Reportar Bugs

### Plantilla de Bug Report

```markdown
**Descripción del Bug**
Descripción clara y concisa del bug.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperabas que sucediera.

**Comportamiento Actual**
Descripción de lo que realmente sucede.

**Screenshots**
Si aplica, agrega screenshots.

**Entorno**
- OS: [ej: Windows 11]
- Java: [ej: 21]
- Spring Boot: [ej: 3.5.7]
- MongoDB: [ej: 7.0]

**Contexto Adicional**
Cualquier otra información relevante.
```

## 💡 Sugerir Mejoras

### Plantilla de Feature Request

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema.

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda.

**Describe alternativas que has considerado**
Descripción de soluciones o funcionalidades alternativas.

**Contexto adicional**
Cualquier otra información o screenshots.
```

## 📚 Recursos Adicionales

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Java Best Practices](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html)
- [REST API Best Practices](https://restfulapi.net/)

## ❓ ¿Preguntas?

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Contactar al equipo de desarrollo
- Revisar la documentación existente

## 🙏 Agradecimientos

¡Gracias por contribuir a SGC Ultimate! Tu ayuda hace que este proyecto sea mejor para todos.
