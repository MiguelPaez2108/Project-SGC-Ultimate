# Deployment Guide - SGC Ultimate Frontend

Guía completa para desplegar el frontend de SGC Ultimate en diferentes entornos.

## 📋 Tabla de Contenidos

- [Preparación](#preparación)
- [Variables de Entorno](#variables-de-entorno)
- [Despliegue Local](#despliegue-local)
- [Despliegue con Docker](#despliegue-con-docker)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Despliegue en Netlify](#despliegue-en-netlify)
- [Despliegue en AWS](#despliegue-en-aws)
- [Despliegue en Azure](#despliegue-en-azure)
- [Despliegue en Google Cloud](#despliegue-en-google-cloud)
- [CI/CD](#cicd)
- [Monitoreo](#monitoreo)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Preparación

### Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Acceso al repositorio
- Backend API desplegado y accesible

### Checklist Pre-Despliegue

- [ ] Tests pasando (`npm test`)
- [ ] Build exitoso (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] Backend API funcionando
- [ ] Dominio configurado (si aplica)
- [ ] SSL/TLS configurado (producción)

---

## 🌍 Variables de Entorno

### Desarrollo (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=SGC Ultimate
VITE_JWT_STORAGE_KEY=sgc_token
VITE_ENABLE_ANALYTICS=false
```

### Producción (.env.production)

```env
VITE_API_BASE_URL=https://api.sgcultimate.com/api
VITE_APP_NAME=SGC Ultimate
VITE_JWT_STORAGE_KEY=sgc_token
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GA_TRACKING_ID=your_ga_id
```

---

## 💻 Despliegue Local

### Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Acceder en: http://localhost:3000

### Producción Local

```bash
# Build
npm run build

# Preview
npm run preview
```

---

## 🐳 Despliegue con Docker

### Opción 1: Docker Simple

```bash
# Construir imagen
docker build -t sgc-frontend:latest .

# Ejecutar contenedor
docker run -d \
  --name sgc-frontend \
  -p 80:80 \
  -e VITE_API_BASE_URL=https://api.sgcultimate.com/api \
  sgc-frontend:latest
```

### Opción 2: Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f frontend

# Detener servicios
docker-compose down
```

### Opción 3: Docker con Nginx Personalizado

```bash
# Construir
docker build -t sgc-frontend:prod -f Dockerfile.prod .

# Ejecutar con volumen de configuración
docker run -d \
  --name sgc-frontend \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  sgc-frontend:prod
```

---

## ☁️ Despliegue en Vercel

### Método 1: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Método 2: GitHub Integration

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automático en cada push

### Configuración (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.sgcultimate.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://api.sgcultimate.com/api"
  }
}
```

---

## 🌐 Despliegue en Netlify

### Método 1: Netlify CLI

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Método 2: Git Integration

1. Conectar repositorio en [netlify.com](https://netlify.com)
2. Configurar build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Configurar variables de entorno
4. Deploy automático

### Configuración (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "https://api.sgcultimate.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "no-referrer-when-downgrade"
```

---

## ☁️ Despliegue en AWS

### Opción 1: S3 + CloudFront

```bash
# Build
npm run build

# Instalar AWS CLI
# Configurar credenciales
aws configure

# Crear bucket S3
aws s3 mb s3://sgc-frontend

# Configurar bucket para hosting
aws s3 website s3://sgc-frontend \
  --index-document index.html \
  --error-document index.html

# Subir archivos
aws s3 sync dist/ s3://sgc-frontend --delete

# Crear distribución CloudFront
aws cloudfront create-distribution \
  --origin-domain-name sgc-frontend.s3.amazonaws.com
```

### Opción 2: Elastic Beanstalk

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init -p docker sgc-frontend

# Crear ambiente
eb create sgc-frontend-prod

# Deploy
eb deploy
```

### Opción 3: ECS + Fargate

```bash
# Construir y pushear imagen a ECR
aws ecr create-repository --repository-name sgc-frontend

# Login a ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag y push
docker tag sgc-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/sgc-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sgc-frontend:latest

# Crear servicio ECS (usar AWS Console o CloudFormation)
```

---

## ☁️ Despliegue en Azure

### Opción 1: Azure Static Web Apps

```bash
# Instalar Azure CLI
# Login
az login

# Crear Static Web App
az staticwebapp create \
  --name sgc-frontend \
  --resource-group sgc-rg \
  --source https://github.com/user/repo \
  --location "East US" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### Opción 2: Azure App Service

```bash
# Crear App Service
az webapp create \
  --resource-group sgc-rg \
  --plan sgc-plan \
  --name sgc-frontend \
  --runtime "NODE|20-lts"

# Deploy
az webapp deployment source config \
  --name sgc-frontend \
  --resource-group sgc-rg \
  --repo-url https://github.com/user/repo \
  --branch main \
  --manual-integration
```

---

## ☁️ Despliegue en Google Cloud

### Opción 1: Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### Configuración (firebase.json)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Opción 2: Cloud Run

```bash
# Build y push a Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/sgc-frontend

# Deploy a Cloud Run
gcloud run deploy sgc-frontend \
  --image gcr.io/PROJECT_ID/sgc-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔄 CI/CD

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

Crear `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test
    - npm run build

deploy_production:
  stage: deploy
  image: node:20
  only:
    - main
  script:
    - npm ci
    - npm run build
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=dist --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID
```

---

## 📊 Monitoreo

### Sentry (Error Tracking)

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### Google Analytics

```javascript
// src/utils/analytics.js
export const initGA = () => {
  if (import.meta.env.VITE_GA_TRACKING_ID) {
    window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID);
  }
};
```

### Performance Monitoring

```javascript
// src/utils/performance.js
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
```

---

## 🐛 Troubleshooting

### Build Failures

```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install

# Verificar versión de Node
node --version  # Debe ser 18+

# Build con logs detallados
npm run build -- --debug
```

### CORS Issues

Verificar configuración de proxy en `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

### Environment Variables Not Working

```bash
# Verificar que las variables empiecen con VITE_
VITE_API_BASE_URL=http://localhost:8080/api

# Reiniciar servidor después de cambiar .env
npm run dev
```

### Docker Build Issues

```bash
# Build sin cache
docker build --no-cache -t sgc-frontend .

# Ver logs detallados
docker build --progress=plain -t sgc-frontend .
```

---

## 📝 Checklist Post-Despliegue

- [ ] Aplicación accesible en URL de producción
- [ ] SSL/TLS funcionando (HTTPS)
- [ ] API conectada correctamente
- [ ] Autenticación funcionando
- [ ] Todas las rutas accesibles
- [ ] Imágenes y assets cargando
- [ ] Performance aceptable (Lighthouse > 90)
- [ ] Monitoreo configurado
- [ ] Backups configurados
- [ ] DNS configurado correctamente

---

## 📞 Soporte

Para problemas de despliegue:
- Revisar logs de la plataforma
- Consultar documentación específica de la plataforma
- Contactar al equipo de DevOps

---

**Última actualización**: 2024-01-15
