// MongoDB Initialization Script
// Este script se ejecuta automáticamente cuando se inicia MongoDB por primera vez en Docker

// Seleccionar la base de datos
db = db.getSiblingDB('project_sgc_ultimate');

// Crear colecciones con validación de esquema
db.createCollection('usuarios', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['nombreCompleto', 'email', 'passwordHash', 'rol'],
            properties: {
                nombreCompleto: {
                    bsonType: 'string',
                    description: 'Nombre completo del usuario - requerido'
                },
                email: {
                    bsonType: 'string',
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                    description: 'Email válido - requerido'
                },
                passwordHash: {
                    bsonType: 'string',
                    description: 'Hash de la contraseña - requerido'
                },
                telefono: {
                    bsonType: 'string',
                    description: 'Número de teléfono'
                },
                rol: {
                    enum: ['ADMIN', 'CLIENTE'],
                    description: 'Rol del usuario - requerido'
                },
                activo: {
                    bsonType: 'bool',
                    description: 'Estado del usuario'
                }
            }
        }
    }
});

db.createCollection('canchas', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['nombre', 'tipo', 'capacidad', 'precioPorHora'],
            properties: {
                nombre: {
                    bsonType: 'string',
                    description: 'Nombre de la cancha - requerido'
                },
                tipo: {
                    bsonType: 'string',
                    description: 'Tipo de cancha - requerido'
                },
                capacidad: {
                    bsonType: 'int',
                    minimum: 1,
                    description: 'Capacidad de la cancha - requerido'
                },
                precioPorHora: {
                    bsonType: 'double',
                    minimum: 0,
                    description: 'Precio por hora - requerido'
                },
                disponible: {
                    bsonType: 'bool',
                    description: 'Disponibilidad de la cancha'
                }
            }
        }
    }
});

db.createCollection('reservas');
db.createCollection('pagos');
db.createCollection('horarios');
db.createCollection('notificaciones');
db.createCollection('auditorias');

// Crear índices para mejorar el rendimiento
print('Creando índices...');

// Índices para usuarios
db.usuarios.createIndex({ 'email': 1 }, { unique: true });
db.usuarios.createIndex({ 'rol': 1 });
db.usuarios.createIndex({ 'activo': 1 });

// Índices para canchas
db.canchas.createIndex({ 'nombre': 1 });
db.canchas.createIndex({ 'tipo': 1 });
db.canchas.createIndex({ 'disponible': 1 });

// Índices para reservas
db.reservas.createIndex({ 'usuarioId': 1 });
db.reservas.createIndex({ 'canchaId': 1 });
db.reservas.createIndex({ 'fechaInicio': 1 });
db.reservas.createIndex({ 'estado': 1 });
db.reservas.createIndex({ 'canchaId': 1, 'fechaInicio': 1 });

// Índices para pagos
db.pagos.createIndex({ 'reservaId': 1 });
db.pagos.createIndex({ 'estado': 1 });
db.pagos.createIndex({ 'fechaPago': -1 });

// Índices para horarios
db.horarios.createIndex({ 'canchaId': 1 });
db.horarios.createIndex({ 'diaSemana': 1 });

// Índices para notificaciones
db.notificaciones.createIndex({ 'usuarioId': 1 });
db.notificaciones.createIndex({ 'leida': 1 });
db.notificaciones.createIndex({ 'fechaCreacion': -1 });

// Índices para auditorías
db.auditorias.createIndex({ 'usuarioId': 1 });
db.auditorias.createIndex({ 'accion': 1 });
db.auditorias.createIndex({ 'fecha': -1 });

print('Índices creados exitosamente');

// Insertar datos de prueba (opcional - comentar en producción)
print('Insertando datos de prueba...');

// Usuario administrador por defecto
// Contraseña: admin123 (hasheada con BCrypt)
db.usuarios.insertOne({
    nombreCompleto: 'Administrador',
    email: 'admin@sgcultimate.com',
    passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    telefono: '1234567890',
    rol: 'ADMIN',
    activo: true,
    fechaRegistro: new Date()
});

// Canchas de ejemplo
db.canchas.insertMany([
    {
        nombre: 'Cancha de Fútbol 1',
        tipo: 'Fútbol',
        capacidad: 22,
        precioPorHora: 50.0,
        disponible: true,
        descripcion: 'Cancha profesional de fútbol con césped sintético',
        ubicacion: 'Sector A',
        caracteristicas: ['Césped sintético', 'Iluminación', 'Vestuarios']
    },
    {
        nombre: 'Cancha de Básquet 1',
        tipo: 'Básquetbol',
        capacidad: 10,
        precioPorHora: 40.0,
        disponible: true,
        descripcion: 'Cancha techada de básquetbol',
        ubicacion: 'Sector B',
        caracteristicas: ['Techada', 'Piso de madera', 'Tableros profesionales']
    },
    {
        nombre: 'Cancha de Tenis 1',
        tipo: 'Tenis',
        capacidad: 4,
        precioPorHora: 35.0,
        disponible: true,
        descripcion: 'Cancha de tenis con superficie de arcilla',
        ubicacion: 'Sector C',
        caracteristicas: ['Superficie de arcilla', 'Red profesional', 'Iluminación']
    }
]);

// Horarios de ejemplo
const canchas = db.canchas.find().toArray();
const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

canchas.forEach(cancha => {
    diasSemana.forEach(dia => {
        db.horarios.insertOne({
            canchaId: cancha._id.toString(),
            diaSemana: dia,
            horaInicio: '08:00',
            horaFin: '22:00',
            disponible: true
        });
    });
});

print('Datos de prueba insertados exitosamente');
print('Base de datos inicializada correctamente');
print('Usuario admin: admin@sgcultimate.com / admin123');
