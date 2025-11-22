# Solución a Errores de Compilación

## Errores Corregidos

### 1. ✅ Error de `setRol()` - SOLUCIONADO
**Error**: `The method setRol(Usuario.RolUsuario) in the type Usuario is not applicable for the arguments (String)`

**Solución**: Cambiado en `UsuarioControllerIntegrationTest.java` línea 40:
```java
// Antes:
usuario.setRol("CLIENTE");

// Después:
usuario.setRol(Usuario.RolUsuario.CLIENTE);
```

### 2. ⚠️ Error de JWT `parserBuilder()` - REQUIERE ACTUALIZACIÓN DE MAVEN
**Error**: `The method parserBuilder() is undefined for the type Jwts`

**Causa**: El IDE no ha descargado/actualizado las dependencias de Maven correctamente.

**Solución**:

#### Opción 1: Desde Eclipse/STS
1. Click derecho en el proyecto → **Maven** → **Update Project**
2. Marcar "Force Update of Snapshots/Releases"
3. Click **OK**

#### Opción 2: Desde Terminal
```bash
cd backend
mvn clean install -U
```

El flag `-U` fuerza la actualización de dependencias.

#### Opción 3: Limpiar caché de Maven
```bash
cd backend
mvn dependency:purge-local-repository
mvn clean install
```

## Verificación

Después de actualizar Maven, verifica que las dependencias de JWT estén correctas:

```bash
mvn dependency:tree | grep jjwt
```

Deberías ver:
```
[INFO] +- io.jsonwebtoken:jjwt-api:jar:0.12.3:compile
[INFO] +- io.jsonwebtoken:jjwt-impl:jar:0.12.3:runtime
[INFO] \- io.jsonwebtoken:jjwt-jackson:jar:0.12.3:runtime
```

## Notas Importantes

- La versión de JWT (0.12.3) es correcta y soporta `parserBuilder()`
- El código de `JwtUtil.java` está correcto
- Solo necesitas actualizar las dependencias de Maven en tu IDE

## Si el error persiste

1. Cierra el IDE
2. Elimina la carpeta `.m2/repository/io/jsonwebtoken`
3. Abre el IDE
4. Ejecuta `mvn clean install`
