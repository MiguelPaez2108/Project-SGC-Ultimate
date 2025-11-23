# API Documentation - SGC Ultimate Backend

Documentación completa de la API REST del Sistema de Gestión de Canchas.

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Canchas](#canchas)
  - [Reservas](#reservas)
  - [Usuarios](#usuarios)
  - [Pagos](#pagos)
  - [Horarios](#horarios)
  - [Notificaciones](#notificaciones)
  - [Auditoría](#auditoría)
- [Códigos de Estado](#códigos-de-estado)
- [Ejemplos de Uso](#ejemplos-de-uso)

## 🌐 Información General

### Base URL
```
http://localhost:8080/api
```

### Formato de Respuesta
Todas las respuestas están en formato JSON.

### Headers Requeridos
```
Content-Type: application/json
Accept: application/json
```

### Autenticación
La mayoría de endpoints requieren autenticación JWT. Incluir el token en el header:
```
Authorization: Bearer <token>
```

## 🔐 Autenticación

### Registrar Usuario

**POST** `/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "987654321"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "CLIENTE",
    "telefono": "987654321",
    "activo": true
  }
}
```

### Iniciar Sesión

**POST** `/auth/login`

Autentica un usuario y devuelve un token JWT.

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
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "CLIENTE"
  }
}
```

### Obtener Usuario Actual

**GET** `/auth/me`

Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "CLIENTE",
  "telefono": "987654321",
  "activo": true
}
```

## ⚽ Canchas

### Listar Canchas

**GET** `/canchas`

Obtiene la lista de todas las canchas.

**Query Parameters:**
- `tipo` (opcional): Filtrar por tipo (FUTBOL, FUTBOL_5, FUTBOL_7, BASQUET, etc.)
- `disponible` (opcional): Filtrar por disponibilidad (true/false)
- `page` (opcional): Número de página (default: 0)
- `size` (opcional): Tamaño de página (default: 10)

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Cancha Principal",
      "tipo": "FUTBOL_7",
      "descripcion": "Cancha de césped sintético",
      "precioHora": 80.00,
      "capacidad": 14,
      "techada": false,
      "disponible": true,
      "imagenes": ["url1.jpg", "url2.jpg"]
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

### Obtener Cancha por ID

**GET** `/canchas/{id}`

Obtiene los detalles de una cancha específica.

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "nombre": "Cancha Principal",
  "tipo": "FUTBOL_7",
  "descripcion": "Cancha de césped sintético de alta calidad",
  "precioHora": 80.00,
  "capacidad": 14,
  "techada": false,
  "disponible": true,
  "imagenes": ["url1.jpg", "url2.jpg"],
  "caracteristicas": ["Iluminación LED", "Vestuarios", "Estacionamiento"]
}
```

### Crear Cancha

**POST** `/canchas` 🔒 *Requiere rol ADMIN*

Crea una nueva cancha.

**Request Body:**
```json
{
  "nombre": "Cancha Nueva",
  "tipo": "FUTBOL_5",
  "descripcion": "Cancha techada con césped sintético",
  "precioHora": 60.00,
  "capacidad": 10,
  "techada": true,
  "disponible": true,
  "imagenes": ["url1.jpg"],
  "caracteristicas": ["Techada", "Iluminación"]
}
```

**Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439012",
  "nombre": "Cancha Nueva",
  "tipo": "FUTBOL_5",
  "precioHora": 60.00,
  "disponible": true
}
```

### Actualizar Cancha

**PUT** `/canchas/{id}` 🔒 *Requiere rol ADMIN*

Actualiza una cancha existente.

**Request Body:**
```json
{
  "nombre": "Cancha Actualizada",
  "precioHora": 70.00,
  "disponible": true
}
```

**Response:** `200 OK`

### Eliminar Cancha

**DELETE** `/canchas/{id}` 🔒 *Requiere rol ADMIN*

Elimina una cancha del sistema.

**Response:** `204 No Content`

## 📅 Reservas

### Listar Mis Reservas

**GET** `/reservas`

Obtiene las reservas del usuario autenticado.

**Query Parameters:**
- `estado` (opcional): Filtrar por estado (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA)
- `fechaDesde` (opcional): Fecha desde (ISO 8601)
- `fechaHasta` (opcional): Fecha hasta (ISO 8601)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "cancha": {
      "id": "507f1f77bcf86cd799439012",
      "nombre": "Cancha Principal"
    },
    "fechaInicio": "2024-01-20T18:00:00Z",
    "fechaFin": "2024-01-20T19:00:00Z",
    "estado": "CONFIRMADA",
    "precioTotal": 80.00,
    "observaciones": "Reserva para partido amistoso"
  }
]
```

### Obtener Reserva por ID

**GET** `/reservas/{id}`

Obtiene los detalles de una reserva específica.

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "usuario": {
    "id": "507f1f77bcf86cd799439013",
    "nombre": "Juan Pérez"
  },
  "cancha": {
    "id": "507f1f77bcf86cd799439012",
    "nombre": "Cancha Principal",
    "tipo": "FUTBOL_7"
  },
  "fechaInicio": "2024-01-20T18:00:00Z",
  "fechaFin": "2024-01-20T19:00:00Z",
  "estado": "CONFIRMADA",
  "precioTotal": 80.00,
  "observaciones": "Reserva para partido amistoso",
  "fechaCreacion": "2024-01-15T10:00:00Z"
}
```

### Crear Reserva

**POST** `/reservas`

Crea una nueva reserva.

**Request Body:**
```json
{
  "canchaId": "507f1f77bcf86cd799439012",
  "fechaInicio": "2024-01-20T18:00:00Z",
  "fechaFin": "2024-01-20T19:00:00Z",
  "observaciones": "Reserva para partido amistoso"
}
```

**Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "canchaId": "507f1f77bcf86cd799439012",
  "fechaInicio": "2024-01-20T18:00:00Z",
  "fechaFin": "2024-01-20T19:00:00Z",
  "estado": "PENDIENTE",
  "precioTotal": 80.00
}
```

### Actualizar Reserva

**PUT** `/reservas/{id}`

Actualiza una reserva existente.

**Request Body:**
```json
{
  "fechaInicio": "2024-01-20T19:00:00Z",
  "fechaFin": "2024-01-20T20:00:00Z",
  "observaciones": "Cambio de horario"
}
```

**Response:** `200 OK`

### Cancelar Reserva

**DELETE** `/reservas/{id}`

Cancela una reserva.

**Response:** `204 No Content`

### Verificar Disponibilidad

**GET** `/reservas/disponibilidad`

Verifica la disponibilidad de una cancha en un horario específico.

**Query Parameters:**
- `canchaId` (requerido): ID de la cancha
- `fechaInicio` (requerido): Fecha y hora de inicio (ISO 8601)
- `fechaFin` (requerido): Fecha y hora de fin (ISO 8601)

**Response:** `200 OK`
```json
{
  "disponible": true,
  "mensaje": "La cancha está disponible en el horario solicitado"
}
```

## 👥 Usuarios

### Listar Usuarios

**GET** `/usuarios` 🔒 *Requiere rol ADMIN*

Obtiene la lista de todos los usuarios.

**Query Parameters:**
- `rol` (opcional): Filtrar por rol (ADMIN, CLIENTE)
- `activo` (opcional): Filtrar por estado (true/false)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "CLIENTE",
    "telefono": "987654321",
    "activo": true,
    "fechaRegistro": "2024-01-01T00:00:00Z"
  }
]
```

### Obtener Usuario por ID

**GET** `/usuarios/{id}` 🔒 *Requiere rol ADMIN*

Obtiene los detalles de un usuario específico.

**Response:** `200 OK`

### Actualizar Usuario

**PUT** `/usuarios/{id}` 🔒 *Requiere rol ADMIN o ser el mismo usuario*

Actualiza la información de un usuario.

**Request Body:**
```json
{
  "nombre": "Juan Carlos Pérez",
  "telefono": "987654322"
}
```

**Response:** `200 OK`

### Eliminar Usuario

**DELETE** `/usuarios/{id}` 🔒 *Requiere rol ADMIN*

Elimina un usuario del sistema.

**Response:** `204 No Content`

## 💳 Pagos

### Listar Mis Pagos

**GET** `/pagos`

Obtiene los pagos del usuario autenticado.

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "reservaId": "507f1f77bcf86cd799439012",
    "monto": 80.00,
    "metodoPago": "TARJETA",
    "estado": "CONFIRMADO",
    "fechaPago": "2024-01-15T10:00:00Z",
    "numeroTransaccion": "TXN123456"
  }
]
```

### Obtener Pago por ID

**GET** `/pagos/{id}`

Obtiene los detalles de un pago específico.

**Response:** `200 OK`

### Registrar Pago

**POST** `/pagos`

Registra un nuevo pago para una reserva.

**Request Body:**
```json
{
  "reservaId": "507f1f77bcf86cd799439012",
  "monto": 80.00,
  "metodoPago": "TARJETA",
  "numeroTransaccion": "TXN123456"
}
```

**Response:** `201 Created`

### Confirmar Pago

**PUT** `/pagos/{id}/confirmar` 🔒 *Requiere rol ADMIN*

Confirma un pago pendiente.

**Response:** `200 OK`

## ⏰ Horarios

### Listar Horarios

**GET** `/horarios`

Obtiene los horarios disponibles.

**Query Parameters:**
- `canchaId` (opcional): Filtrar por cancha
- `diaSemana` (opcional): Filtrar por día (LUNES, MARTES, etc.)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "canchaId": "507f1f77bcf86cd799439012",
    "diaSemana": "LUNES",
    "horaInicio": "08:00",
    "horaFin": "22:00",
    "disponible": true
  }
]
```

### Crear Horario

**POST** `/horarios` 🔒 *Requiere rol ADMIN*

Crea un nuevo horario para una cancha.

**Request Body:**
```json
{
  "canchaId": "507f1f77bcf86cd799439012",
  "diaSemana": "LUNES",
  "horaInicio": "08:00",
  "horaFin": "22:00",
  "disponible": true
}
```

**Response:** `201 Created`

## 🔔 Notificaciones

### Listar Mis Notificaciones

**GET** `/notificaciones`

Obtiene las notificaciones del usuario autenticado.

**Query Parameters:**
- `leida` (opcional): Filtrar por estado de lectura (true/false)

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "titulo": "Reserva Confirmada",
    "mensaje": "Tu reserva para el 20/01/2024 ha sido confirmada",
    "tipo": "RESERVA",
    "leida": false,
    "fechaCreacion": "2024-01-15T10:00:00Z"
  }
]
```

### Marcar como Leída

**PUT** `/notificaciones/{id}/leida`

Marca una notificación como leída.

**Response:** `200 OK`

## 📊 Auditoría

### Listar Registros de Auditoría

**GET** `/auditorias` 🔒 *Requiere rol ADMIN*

Obtiene los registros de auditoría del sistema.

**Query Parameters:**
- `usuarioId` (opcional): Filtrar por usuario
- `accion` (opcional): Filtrar por acción (CREAR, ACTUALIZAR, ELIMINAR)
- `entidad` (opcional): Filtrar por entidad (RESERVA, CANCHA, etc.)
- `fechaDesde` (opcional): Fecha desde
- `fechaHasta` (opcional): Fecha hasta

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "usuarioId": "507f1f77bcf86cd799439012",
    "accion": "CREAR",
    "entidad": "RESERVA",
    "entidadId": "507f1f77bcf86cd799439013",
    "detalles": "Reserva creada para cancha Principal",
    "fecha": "2024-01-15T10:00:00Z",
    "ipAddress": "192.168.1.1"
  }
]
```

## 📡 Health Check

### Verificar Estado

**GET** `/health`

Verifica el estado de la aplicación.

**Response:** `200 OK`
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Solicitud exitosa sin contenido |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: horario no disponible) |
| 500 | Internal Server Error - Error del servidor |

## 🔧 Ejemplos de Uso

### Ejemplo completo: Crear una reserva

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'

# Response: { "token": "eyJhbGc..." }

# 2. Listar canchas disponibles
curl -X GET http://localhost:8080/api/canchas?disponible=true \
  -H "Authorization: Bearer eyJhbGc..."

# 3. Verificar disponibilidad
curl -X GET "http://localhost:8080/api/reservas/disponibilidad?canchaId=507f1f77bcf86cd799439012&fechaInicio=2024-01-20T18:00:00Z&fechaFin=2024-01-20T19:00:00Z" \
  -H "Authorization: Bearer eyJhbGc..."

# 4. Crear reserva
curl -X POST http://localhost:8080/api/reservas \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "canchaId": "507f1f77bcf86cd799439012",
    "fechaInicio": "2024-01-20T18:00:00Z",
    "fechaFin": "2024-01-20T19:00:00Z",
    "observaciones": "Partido amistoso"
  }'

# 5. Registrar pago
curl -X POST http://localhost:8080/api/pagos \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "reservaId": "507f1f77bcf86cd799439011",
    "monto": 80.00,
    "metodoPago": "TARJETA",
    "numeroTransaccion": "TXN123456"
  }'
```

## 📚 Recursos Adicionales

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **Postman Collection**: [Descargar](./postman/SGC-Ultimate.postman_collection.json)

## 🤝 Soporte

Para reportar problemas o solicitar ayuda:
- 📧 Email: api-support@sgcultimate.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-repo/issues)
- 📖 Docs: [Documentación Completa](https://docs.sgcultimate.com)
