# Guía de Despliegue - SGC Ultimate Backend

Esta guía proporciona instrucciones detalladas para desplegar el backend de SGC Ultimate en diferentes entornos.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Despliegue Local](#despliegue-local)
- [Despliegue con Docker](#despliegue-con-docker)
- [Despliegue en Producción](#despliegue-en-producción)
- [Despliegue en Cloud](#despliegue-en-cloud)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Troubleshooting](#troubleshooting)

## 🔧 Requisitos Previos

### Software Necesario
- Java 21 o superior
- Maven 3.6+
- MongoDB 4.4+
- Docker y Docker Compose (opcional)
- Git

### Variables de Entorno Requeridas
```bash
JWT_SECRET=tu_clave_secreta_muy_segura
MONGODB_URI=mongodb://localhost:27017/project_sgc_ultimate
SERVER_PORT=8080
```

## 💻 Despliegue Local

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd backend
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Instalar Dependencias
```bash
./mvnw clean install
```

### 4. Ejecutar la Aplicación
```bash
# Con Maven
./mvnw spring-boot:run

# O con perfil específico
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### 5. Verificar el Despliegue
```bash
curl http://localhost:8080/actuator/health
```

## 🐳 Despliegue con Docker

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener
docker-compose down
```

### Opción 2: Docker Manual

```bash
# Construir imagen
docker build -t sgc-ultimate-backend:latest .

# Ejecutar contenedor
docker run -d \
  --name sgc-backend \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/project_sgc_ultimate \
  -e JWT_SECRET=tu_clave_secreta \
  sgc-ultimate-backend:latest

# Ver logs
docker logs -f sgc-backend
```

## 🚀 Despliegue en Producción

### 1. Preparación

#### Compilar para Producción
```bash
./mvnw clean package -DskipTests -Pprod
```

#### Verificar el JAR
```bash
ls -lh target/*.jar
```

### 2. Configuración de Producción

Crear archivo `application-prod.properties`:
```properties
# Server
server.port=${SERVER_PORT:8080}

# MongoDB
spring.data.mongodb.uri=${MONGODB_URI}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Logging
logging.level.root=WARN
logging.level.com.project_sgc_ultimate=INFO

# Actuator
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=never
```

### 3. Ejecutar en Producción

#### Con systemd (Linux)

Crear archivo `/etc/systemd/system/sgc-backend.service`:
```ini
[Unit]
Description=SGC Ultimate Backend
After=network.target

[Service]
Type=simple
User=sgc
WorkingDirectory=/opt/sgc-backend
ExecStart=/usr/bin/java -jar /opt/sgc-backend/sgc-ultimate-1.0.0.jar --spring.profiles.active=prod
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

Environment="JAVA_OPTS=-Xms512m -Xmx1024m"
Environment="JWT_SECRET=tu_clave_secreta_produccion"
Environment="MONGODB_URI=mongodb://usuario:password@mongodb-server:27017/sgc_prod"

[Install]
WantedBy=multi-user.target
```

Habilitar y ejecutar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable sgc-backend
sudo systemctl start sgc-backend
sudo systemctl status sgc-backend
```

#### Con PM2 (Node.js Process Manager)

```bash
# Instalar PM2
npm install -g pm2

# Crear ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sgc-backend',
    script: 'java',
    args: '-jar target/sgc-ultimate-1.0.0.jar --spring.profiles.active=prod',
    env: {
      JWT_SECRET: 'tu_clave_secreta',
      MONGODB_URI: 'mongodb://localhost:27017/sgc_prod'
    }
  }]
}
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Configurar Nginx como Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.sgcultimate.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.sgcultimate.com

# Renovación automática
sudo certbot renew --dry-run
```

## ☁️ Despliegue en Cloud

### AWS (Elastic Beanstalk)

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init -p java-21 sgc-backend

# Crear ambiente
eb create sgc-prod-env

# Desplegar
eb deploy

# Ver logs
eb logs
```

### Heroku

```bash
# Login
heroku login

# Crear app
heroku create sgc-ultimate-backend

# Configurar variables
heroku config:set JWT_SECRET=tu_clave_secreta
heroku config:set MONGODB_URI=mongodb+srv://...

# Desplegar
git push heroku main

# Ver logs
heroku logs --tail
```

### Google Cloud Platform (App Engine)

Crear `app.yaml`:
```yaml
runtime: java21
instance_class: F2

env_variables:
  JWT_SECRET: "tu_clave_secreta"
  MONGODB_URI: "mongodb://..."

automatic_scaling:
  min_instances: 1
  max_instances: 10
```

Desplegar:
```bash
gcloud app deploy
```

### Azure (App Service)

```bash
# Login
az login

# Crear resource group
az group create --name sgc-rg --location eastus

# Crear app service plan
az appservice plan create --name sgc-plan --resource-group sgc-rg --sku B1 --is-linux

# Crear web app
az webapp create --resource-group sgc-rg --plan sgc-plan --name sgc-backend --runtime "JAVA:21-java21"

# Configurar variables
az webapp config appsettings set --resource-group sgc-rg --name sgc-backend --settings JWT_SECRET=tu_clave

# Desplegar
az webapp deployment source config-zip --resource-group sgc-rg --name sgc-backend --src target/sgc-ultimate-1.0.0.jar
```

## 🗄️ Configuración de Base de Datos

### MongoDB Atlas (Cloud)

1. Crear cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configurar IP whitelist
3. Crear usuario de base de datos
4. Obtener connection string
5. Configurar en variables de entorno:

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/sgc_prod?retryWrites=true&w=majority
```

### MongoDB Local con Autenticación

```bash
# Conectar a MongoDB
mongosh

# Crear usuario admin
use admin
db.createUser({
  user: "sgc_admin",
  pwd: "password_seguro",
  roles: ["readWrite", "dbAdmin"]
})

# Usar en connection string
MONGODB_URI=mongodb://sgc_admin:password_seguro@localhost:27017/sgc_prod?authSource=admin
```

## 📊 Monitoreo y Logs

### Configurar Logs

```bash
# Ver logs en tiempo real
tail -f logs/sgc-ultimate.log

# Ver solo errores
tail -f logs/sgc-ultimate-error.log

# Buscar en logs
grep "ERROR" logs/sgc-ultimate.log
```

### Monitoreo con Actuator

Endpoints disponibles:
- `/actuator/health` - Estado de salud
- `/actuator/info` - Información de la aplicación
- `/actuator/metrics` - Métricas de rendimiento

### Integración con Prometheus

Agregar en `pom.xml`:
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Configurar en `application-prod.properties`:
```properties
management.endpoints.web.exposure.include=health,info,prometheus
management.metrics.export.prometheus.enabled=true
```

## 🔧 Troubleshooting

### Problema: Aplicación no inicia

```bash
# Verificar Java version
java -version

# Verificar puerto disponible
netstat -an | grep 8080

# Ver logs detallados
java -jar target/sgc-ultimate-1.0.0.jar --debug
```

### Problema: No puede conectar a MongoDB

```bash
# Verificar MongoDB está corriendo
systemctl status mongod

# Probar conexión
mongosh mongodb://localhost:27017

# Verificar firewall
sudo ufw status
sudo ufw allow 27017
```

### Problema: Error de memoria

```bash
# Aumentar memoria heap
java -Xms512m -Xmx2048m -jar target/sgc-ultimate-1.0.0.jar
```

### Problema: SSL/TLS errors

```bash
# Verificar certificados
openssl s_client -connect api.sgcultimate.com:443

# Renovar certificados
sudo certbot renew
```

## 📝 Checklist de Despliegue

Antes de desplegar a producción:

- [ ] Cambiar `JWT_SECRET` a valor único y seguro
- [ ] Configurar MongoDB con autenticación
- [ ] Configurar HTTPS/SSL
- [ ] Actualizar todas las dependencias
- [ ] Ejecutar todos los tests
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo
- [ ] Configurar logs
- [ ] Revisar configuración de CORS
- [ ] Configurar rate limiting
- [ ] Documentar proceso de rollback
- [ ] Preparar plan de contingencia

## 🔄 Rollback

Si algo sale mal:

```bash
# Con systemd
sudo systemctl stop sgc-backend
# Restaurar versión anterior
sudo systemctl start sgc-backend

# Con Docker
docker-compose down
docker-compose up -d --build

# Con PM2
pm2 stop sgc-backend
# Restaurar versión anterior
pm2 start sgc-backend
```

## 📞 Soporte

Para problemas de despliegue:
- Email: devops@sgcultimate.com
- Slack: #deployment-support
- Documentación: https://docs.sgcultimate.com

---

**Última actualización**: 2024-01-15
