# Security Policy

## Supported Versions

Las siguientes versiones de SGC Ultimate Backend están actualmente soportadas con actualizaciones de seguridad:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Si descubres una vulnerabilidad de seguridad en SGC Ultimate Backend, por favor repórtala de manera responsable.

### Cómo Reportar

1. **NO** abras un issue público en GitHub
2. Envía un email a: security@sgcultimate.com (o el email del equipo)
3. Incluye la siguiente información:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Versión afectada
   - Impacto potencial
   - Sugerencias de solución (si las tienes)

### Qué Esperar

- **Confirmación**: Recibirás una confirmación dentro de 48 horas
- **Evaluación**: Evaluaremos la vulnerabilidad en 5-7 días hábiles
- **Actualización**: Te mantendremos informado del progreso
- **Resolución**: Trabajaremos en un parche y lo lanzaremos lo antes posible
- **Crédito**: Te daremos crédito por el descubrimiento (si lo deseas)

## Security Best Practices

### Para Desarrolladores

1. **Nunca commitear secretos**
   - Usar variables de entorno para información sensible
   - Revisar `.gitignore` antes de commitear
   - Usar herramientas como `git-secrets`

2. **Mantener dependencias actualizadas**
   ```bash
   mvn versions:display-dependency-updates
   mvn versions:display-plugin-updates
   ```

3. **Validar entrada de usuario**
   - Usar `@Valid` en DTOs
   - Sanitizar datos antes de procesarlos
   - Implementar rate limiting

4. **Proteger endpoints**
   - Usar `@PreAuthorize` para control de acceso
   - Implementar CORS correctamente
   - Validar tokens JWT

### Para Administradores

1. **Configuración de Producción**
   - Cambiar `JWT_SECRET` por uno único y seguro
   - Usar HTTPS en producción
   - Configurar firewall y rate limiting
   - Habilitar logs de auditoría

2. **Base de Datos**
   - Usar autenticación MongoDB
   - Encriptar conexiones
   - Realizar backups regulares
   - Limitar acceso a la red

3. **Monitoreo**
   - Revisar logs regularmente
   - Configurar alertas de seguridad
   - Monitorear intentos de acceso fallidos
   - Usar herramientas de análisis de vulnerabilidades

## Known Security Considerations

### JWT Tokens
- Los tokens expiran en 24 horas por defecto
- No se almacenan en el servidor (stateless)
- Cambiar `JWT_SECRET` invalida todos los tokens existentes

### Passwords
- Se hashean con BCrypt (factor de costo 10)
- Mínimo 6 caracteres requeridos
- Nunca se almacenan en texto plano

### CORS
- Configurado para permitir solo orígenes específicos en producción
- Métodos HTTP limitados
- Headers controlados

### Rate Limiting
- Recomendado implementar en producción
- Protege contra ataques de fuerza bruta
- Limita requests por IP/usuario

## Security Checklist

Antes de desplegar a producción:

- [ ] Cambiar `JWT_SECRET` a un valor único y seguro
- [ ] Configurar HTTPS/TLS
- [ ] Actualizar todas las dependencias
- [ ] Revisar configuración de CORS
- [ ] Habilitar rate limiting
- [ ] Configurar logs de auditoría
- [ ] Implementar backups automáticos
- [ ] Configurar monitoreo de seguridad
- [ ] Revisar permisos de base de datos
- [ ] Deshabilitar endpoints de debug
- [ ] Configurar firewall
- [ ] Implementar 2FA para administradores (opcional)

## Security Updates

Nos comprometemos a:
- Responder a reportes de seguridad en 48 horas
- Lanzar parches críticos en 7 días
- Mantener esta política actualizada
- Comunicar vulnerabilidades de manera transparente

## Contact

Para consultas de seguridad:
- Email: security@sgcultimate.com
- PGP Key: [Si aplica]

## Acknowledgments

Agradecemos a los siguientes investigadores de seguridad por sus contribuciones:
- [Lista de contribuidores de seguridad]

---

**Última actualización**: 2024-01-15
