// MongoDB Initialization Script
// This script runs when MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('project_sgc_ultimate');

// Create collections with validation
db.createCollection('usuarios', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'email', 'password', 'rol'],
      properties: {
        nombre: {
          bsonType: 'string',
          description: 'Nombre del usuario - requerido'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Email válido - requerido'
        },
        password: {
          bsonType: 'string',
          description: 'Password hasheado - requerido'
        },
        rol: {
          enum: ['ADMIN', 'CLIENTE'],
          description: 'Rol del usuario - requerido'
        },
        telefono: {
          bsonType: 'string'
        },
        activo: {
          bsonType: 'bool'
        }
      }
    }
  }
});

db.createCollection('canchas', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'tipo', 'precioHora', 'disponible'],
      properties: {
        nombre: {
          bsonType: 'string',
          description: 'Nombre de la cancha - requerido'
        },
        tipo: {
          enum: ['FUTBOL', 'FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'BASQUET', 'VOLEY', 'TENIS', 'PADEL'],
          description: 'Tipo de cancha - requerido'
        },
        precioHora: {
          bsonType: 'double',
          minimum: 0,
          description: 'Precio por hora - requerido'
        },
        disponible: {
          bsonType: 'bool',
          description: 'Disponibilidad - requerido'
        }
      }
    }
  }
});

db.createCollection('reservas', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['usuarioId', 'canchaId', 'fechaInicio', 'fechaFin', 'estado'],
      properties: {
        usuarioId: {
          bsonType: 'string',
          description: 'ID del usuario - requerido'
        },
        canchaId: {
          bsonType: 'string',
          description: 'ID de la cancha - requerido'
        },
        fechaInicio: {
          bsonType: 'date',
          description: 'Fecha de inicio - requerido'
        },
        fechaFin: {
          bsonType: 'date',
          description: 'Fecha de fin - requerido'
        },
        estado: {
          enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'],
          description: 'Estado de la reserva - requerido'
        }
      }
    }
  }
});

db.createCollection('pagos');
db.createCollection('horarios');
db.createCollection('notificaciones');
db.createCollection('auditorias');

// Create indexes for better performance
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ rol: 1 });
db.usuarios.createIndex({ activo: 1 });

db.canchas.createIndex({ nombre: 1 });
db.canchas.createIndex({ tipo: 1 });
db.canchas.createIndex({ disponible: 1 });

db.reservas.createIndex({ usuarioId: 1 });
db.reservas.createIndex({ canchaId: 1 });
db.reservas.createIndex({ fechaInicio: 1, fechaFin: 1 });
db.reservas.createIndex({ estado: 1 });
db.reservas.createIndex({ canchaId: 1, fechaInicio: 1, fechaFin: 1 });

db.pagos.createIndex({ reservaId: 1 });
db.pagos.createIndex({ usuarioId: 1 });
db.pagos.createIndex({ estado: 1 });
db.pagos.createIndex({ fechaPago: 1 });

db.horarios.createIndex({ canchaId: 1 });
db.horarios.createIndex({ diaSemana: 1 });

db.notificaciones.createIndex({ usuarioId: 1 });
db.notificaciones.createIndex({ leida: 1 });
db.notificaciones.createIndex({ fechaCreacion: 1 });

db.auditorias.createIndex({ usuarioId: 1 });
db.auditorias.createIndex({ accion: 1 });
db.auditorias.createIndex({ fecha: 1 });
db.auditorias.createIndex({ entidad: 1 });

print('✅ Database initialized successfully!');
print('📊 Collections created: usuarios, canchas, reservas, pagos, horarios, notificaciones, auditorias');
print('🔍 Indexes created for optimal performance');
