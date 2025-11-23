# API Documentation - SGC Ultimate Backend

Documentación detallada de los endpoints de la API REST.

## 📋 Información General

- **Base URL**: `http://localhost:8080/api`
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token
- **Documentación Interactiva**: `http://localhost:8080/swagger-ui.html`

## 🔐 Autenticación

Todos los endpoints (excepto login y register) requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

### POST /auth/register

Registrar un nuevo usuario.

**Request Body:**
```json
{
  "nombreCompleto": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "123456789"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuarioId": "507f1f77bcf86cd799439011",
  "rol": "CLIENTE"
}
```

**Errores:**
- `400 Bad Request` - Datos inválidos
- `409 Conflict` - Email ya registrado

---

### POST /auth/login

Iniciar sesión.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuarioId": "507f1f77bcf86cd799439011",
  "rol": "CLIENTE"
}
```

**Errores:**
- `401 Unauthorized` - Credenciales inválidas
- `403 Forbidden` - Usuario inactivo

---

## 🏟️ Canchas

### GET /canchas

Listar todas las canchas.

**Query Parameters:**
- `tipo` (opcional): Filtrar por tipo de cancha
- `disponible` (opcional): Filtrar por disponibilidad (true/false)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Cancha de Fútbol 1",
    "tipo": "Fútbol",
    "capacidad": 22,
    "precioPorHora": 50.0,
    "disponible": true,
    "descripcion": "Cancha profesional",
    "ubicacion": "Sector A",
    "caracteristicas": ["Césped sintético", "Iluminación"]
  }
]
```

---

### GET /canchas/{id}

Obtener detalles de una cancha específica.

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "nombre": "Cancha de Fútbol 1",
  "tipo": "Fútbol",
  "capacidad": 22,
  "precioPorHora": 50.0,
  "disponible": true,
  "descripcion": "Cancha profesional",
  "ubicacion": "Sector A",
  "caracteristicas": ["Césped sintético", "Iluminación"]
}
```

**Errores:**
- `404 Not Found` - Cancha no encontrada

---

### POST /canchas

Crear una nueva cancha. **[ADMIN]**

**Request Body:**
```json
{
  "nombre": "Cancha de Fútbol 2",
  "tipo": "Fútbol",
  "capacidad": 22,
  "precioPorHora": 55.0,
  "disponible": true,
  "descripcion": "Nueva cancha",
  "ubicacion": "Sector B",
  "caracteristicas": ["Césped natural", "Iluminación LED"]
}
```

**Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439012",
  "nombre": "Cancha de Fútbol 2",
  ...
}
```

**Errores:**
- `400 Bad Request` - Datos inválidos
- `403 Forbidden` - No autorizado (requiere rol ADMIN)

---

### PUT /canchas/{id}

Actualizar una cancha. **[ADMIN]**

**Request Body:**
```json
{
  "nombre": "Cancha de Fútbol 1 - Actualizada",
  "precioPorHora": 60.0,
  "disponible": false
}
```

**Response:** `200 OK`

**Errores:**
- `404 Not Found` - Cancha no encontrada
- `403 Forbidden` - No autorizado

---

### DELETE /canchas/{id}

Eliminar una cancha. **[ADMIN]**

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Cancha no encontrada
- `403 Forbidden` - No autorizado
- `409 Conflict` - Cancha tiene reservas activas

---

## 📅 Reservas

### GET /reservas

Listar reservas del usuario actual.

**Query Parameters:**
- `estado` (opcional): Filtrar por estado (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA)
- `desde` (opcional): Fecha desde (ISO 8601)
- `hasta` (opcional): Fecha hasta (ISO 8601)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "usuarioId": "507f1f77bcf86cd799439011",
    "canchaId": "507f1f77bcf86cd799439012",
    "fechaInicio": "2024-01-20T10:00:00",
    "fechaFin": "2024-01-20T12:00:00",
    "estado": "CONFIRMADA",
    "precioTotal": 100.0,
    "observaciones": "Reserva para partido amistoso"
  }
]
```

---

### GET /reservas/{id}

Obtener detalles de una reserva.

**Response:** `200 OK`

**Errores:**
- `404 Not Found` - Reserva no encontrada
- `403 Forbidden` - No autorizado para ver esta reserva

---

### POST /reservas

Crear una nueva reserva.

**Request Body:**
```json
{
  "canchaId": "507f1f77bcf86cd799439012",
  "fechaInicio": "2024-01-20T10:00:00",
  "fechaFin": "2024-01-20T12:00:00",
  "observaciones": "Reserva para partido amistoso"
}
```

**Response:** `201 Created`

**Errores:**
- `400 Bad Request` - Datos inválidos o cancha no disponible
- `409 Conflict` - Horario ya reservado

---

### PUT /reservas/{id}

Actualizar una reserva.

**Request Body:**
```json
{
  "fechaInicio": "2024-01-20T14:00:00",
  "fechaFin": "2024-01-20T16:00:00",
  "observaciones": "Cambio de horario"
}
```

**Response:** `200 OK`

**Errores:**
- `404 Not Found` - Reserva no encontrada
- `403 Forbidden` - No autorizado
- `409 Conflict` - Nuevo horario no disponible

---

### DELETE /reservas/{id}

Cancelar una reserva.

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Reserva no encontrada
- `403 Forbidden` - No autorizado
- `400 Bad Request` - No se puede cancelar (ya completada o muy próxima)

---

## 💳 Pagos

### GET /pagos

Listar pagos del usuario actual.

**Query Parameters:**
- `estado` (opcional): Filtrar por estado (PENDIENTE, COMPLETADO, FALLIDO, REEMBOLSADO)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439014",
    "reservaId": "507f1f77bcf86cd799439013",
    "monto": 100.0,
    "metodoPago": "TARJETA",
    "estado": "COMPLETADO",
    "fechaPago": "2024-01-15T10:30:00",
    "transaccionId": "TXN123456"
  }
]
```

---

### POST /pagos

Procesar un pago.

**Request Body:**
```json
{
  "reservaId": "507f1f77bcf86cd799439013",
  "monto": 100.0,
  "metodoPago": "TARJETA"
}
```

**Response:** `201 Created`

**Errores:**
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Reserva no encontrada
- `409 Conflict` - Pago ya procesado

---

### PUT /pagos/{id}/confirmar

Confirmar un pago. **[ADMIN]**

**Response:** `200 OK`

**Errores:**
- `404 Not Found` - Pago no encontrado
- `403 Forbidden` - No autorizado
- `400 Bad Request` - Pago ya confirmado

---

## 👥 Usuarios

### GET /usuarios

Listar todos los usuarios. **[ADMIN]**

**Query Parameters:**
- `rol` (opcional): Filtrar por rol (ADMIN, CLIENTE)
- `activo` (opcional): Filtrar por estado (true/false)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "nombreCompleto": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "rol": "CLIENTE",
    "activo": true,
    "fechaRegistro": "2024-01-01T00:00:00"
  }
]
```

---

### GET /usuarios/{id}

Obtener detalles de un usuario.

**Response:** `200 OK`

**Errores:**
- `404 Not Found` - Usuario no encontrado
- `403 Forbidden` - No autorizado

---

### PUT /usuarios/{id}

Actualizar un usuario.

**Request Body:**
```json
{
  "nombreCompleto": "Juan Pérez Actualizado",
  "telefono": "987654321"
}
```

**Response:** `200 OK`

---

### DELETE /usuarios/{id}

Desactivar un usuario. **[ADMIN]**

**Response:** `204 No Content`

---

## 🔔 Notificaciones

### GET /notificaciones

Listar notificaciones del usuario actual.

**Query Parameters:**
- `leida` (opcional): Filtrar por estado (true/false)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439015",
    "usuarioId": "507f1f77bcf86cd799439011",
    "titulo": "Reserva Confirmada",
    "mensaje": "Tu reserva ha sido confirmada",
    "tipo": "RESERVA",
    "leida": false,
    "fechaCreacion": "2024-01-15T10:00:00"
  }
]
```

---

### PUT /notificaciones/{id}/leida

Marcar notificación como leída.

**Response:** `200 OK`

---

## 📊 Auditoría

### GET /auditorias

Ver registros de auditoría. **[ADMIN]**

**Query Parameters:**
- `usuarioId` (opcional): Filtrar por usuario
- `accion` (opcional): Filtrar por acción
- `desde` (opcional): Fecha desde
- `hasta` (opcional): Fecha hasta

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439016",
    "usuarioId": "507f1f77bcf86cd799439011",
    "accion": "CREAR_RESERVA",
    "entidad": "Reserva",
    "entidadId": "507f1f77bcf86cd799439013",
    "detalles": "Reserva creada para Cancha 1",
    "fecha": "2024-01-15T10:00:00",
    "ipAddress": "192.168.1.1"
  }
]
```

---

## ⏰ Horarios

### GET /horarios

Listar horarios disponibles.

**Query Parameters:**
- `canchaId` (opcional): Filtrar por cancha
- `diaSemana` (opcional): Filtrar por día

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439017",
    "canchaId": "507f1f77bcf86cd799439012",
    "diaSemana": "LUNES",
    "horaInicio": "08:00",
    "horaFin": "22:00",
    "disponible": true
  }
]
```

---

## 🏥 Health Check

### GET /health

Verificar estado de la aplicación.

**Response:** `200 OK`
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:00:00"
}
```

---

## 📝 Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Solicitud exitosa sin contenido
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto con el estado actual
- `500 Internal Server Error` - Error del servidor

## 🔒 Roles y Permisos

### CLIENTE
- Ver canchas
- Crear/ver/cancelar sus propias reservas
- Ver/procesar sus propios pagos
- Ver/actualizar su perfil
- Ver sus notificaciones

### ADMIN
- Todos los permisos de CLIENTE
- Gestionar canchas (CRUD)
- Ver todas las reservas
- Confirmar pagos
- Gestionar usuarios
- Ver auditoría
- Gestionar horarios

## 📚 Ejemplos con cURL

### Registro
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCompleto": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "123456789"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Listar Canchas (con token)
```bash
curl -X GET http://localhost:8080/api/canchas \
  -H "Authorization: Bearer <tu_token>"
```

### Crear Reserva
```bash
curl -X POST http://localhost:8080/api/reservas \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "canchaId": "507f1f77bcf86cd799439012",
    "fechaInicio": "2024-01-20T10:00:00",
    "fechaFin": "2024-01-20T12:00:00"
  }'
```

---

**Documentación Interactiva**: Para una experiencia más completa, visita `http://localhost:8080/swagger-ui.html` donde puedes probar todos los endpoints directamente desde el navegador.
