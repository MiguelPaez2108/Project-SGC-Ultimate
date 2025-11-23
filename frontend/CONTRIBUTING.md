# Guía de Contribución - SGC Ultimate Frontend

¡Gracias por tu interés en contribuir a SGC Ultimate! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Guía de Estilo](#guía-de-estilo)

---

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de la participación en nuestro proyecto una experiencia libre de acoso para todos, independientemente de edad, tamaño corporal, discapacidad, etnia, identidad y expresión de género, nivel de experiencia, nacionalidad, apariencia personal, raza, religión o identidad y orientación sexual.

### Comportamiento Esperado

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

- Uso de lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes o ataques personales
- Acoso público o privado
- Publicar información privada de otros sin permiso
- Otra conducta que podría considerarse inapropiada

---

## 🤝 Cómo Contribuir

### Tipos de Contribuciones

Aceptamos varios tipos de contribuciones:

1. **Reportar Bugs** 🐛
2. **Sugerir Mejoras** 💡
3. **Mejorar Documentación** 📚
4. **Escribir Código** 💻
5. **Revisar Pull Requests** 👀
6. **Escribir Tests** 🧪

### Proceso General

1. **Fork** el repositorio
2. **Crea** una rama desde `main`
3. **Haz** tus cambios
4. **Escribe** tests si es necesario
5. **Asegúrate** que los tests pasen
6. **Commit** tus cambios
7. **Push** a tu fork
8. **Abre** un Pull Request

---

## 🔧 Configuración del Entorno

### Requisitos

- Node.js 18+
- npm 9+ o yarn 1.22+
- Git
- Editor de código (recomendado: VS Code)

### Instalación

```bash
# 1. Fork y clonar el repositorio
git clone https://github.com/tu-usuario/sgc-ultimate-frontend.git
cd sgc-ultimate-frontend

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Ejecutar tests
npm test
```

### Extensiones Recomendadas (VS Code)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag"
  ]
}
```

---

## 📏 Estándares de Código

### JavaScript/React

#### Convenciones de Nombres

```javascript
// Componentes: PascalCase
const UserProfile = () => { }

// Funciones: camelCase
const getUserData = () => { }

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'

// Archivos de componentes: PascalCase.jsx
// UserProfile.jsx

// Archivos de utilidades: camelCase.js
// formatters.js
```

#### Estructura de Componentes

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import './ComponentName.css'

/**
 * Descripción del componente
 * @param {Object} props - Props del componente
 */
const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState(null)
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // 3. Handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // 4. Render helpers
  const renderContent = () => {
    // Render logic
  }
  
  // 5. Return
  return (
    <div className="component-name">
      {renderContent()}
    </div>
  )
}

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}

// Default props
ComponentName.defaultProps = {
  prop2: 0,
}

export default ComponentName
```

#### Hooks Personalizados

```javascript
// useCustomHook.js
import { useState, useEffect } from 'react'

/**
 * Hook personalizado para...
 * @param {*} param - Descripción del parámetro
 * @returns {Object} - Descripción del retorno
 */
export const useCustomHook = (param) => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // Logic
  }, [param])
  
  return { data }
}
```

### CSS

#### Convenciones

```css
/* BEM Methodology */
.block { }
.block__element { }
.block--modifier { }

/* Ejemplo */
.card { }
.card__header { }
.card__body { }
.card--featured { }
```

#### Variables CSS

```css
/* Usar variables CSS para valores reutilizables */
:root {
  --primary-color: #4CAF50;
  --spacing-md: 1rem;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-md);
}
```

### ESLint

Seguir las reglas de ESLint configuradas:

```bash
# Verificar código
npm run lint

# Arreglar automáticamente
npm run lint -- --fix
```

### Prettier

Formatear código automáticamente:

```bash
# Formatear todos los archivos
npm run format
```

---

## 🔄 Proceso de Pull Request

### 1. Crear una Rama

```bash
# Nomenclatura de ramas
git checkout -b feature/nombre-feature
git checkout -b fix/nombre-bug
git checkout -b docs/nombre-doc
git checkout -b refactor/nombre-refactor
```

### 2. Hacer Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<type>(<scope>): <subject>

# Tipos
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Cambios de formato (no afectan código)
refactor: Refactorización de código
test: Agregar o modificar tests
chore: Cambios en build o herramientas

# Ejemplos
git commit -m "feat(auth): add login functionality"
git commit -m "fix(reservas): correct date validation"
git commit -m "docs(readme): update installation steps"
```

### 3. Escribir Tests

```javascript
// ComponentName.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('should handle user interaction', () => {
    // Test logic
  })
})
```

### 4. Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test ComponentName

# Con cobertura
npm run test:coverage
```

### 5. Actualizar Documentación

Si tu cambio afecta la API o el uso:
- Actualizar README.md
- Actualizar comentarios JSDoc
- Agregar ejemplos si es necesario

### 6. Push y PR

```bash
# Push a tu fork
git push origin feature/nombre-feature

# Abrir PR en GitHub
# Usar la plantilla de PR
```

### Template de Pull Request

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?
Describe las pruebas realizadas

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests
- [ ] Los tests nuevos y existentes pasan
- [ ] He actualizado CHANGELOG.md

## Screenshots (si aplica)
```

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verificar que no sea un bug conocido
2. Buscar en issues existentes
3. Intentar reproducir en última versión

### Template de Bug Report

```markdown
**Descripción del Bug**
Descripción clara y concisa del bug

**Pasos para Reproducir**
1. Ir a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Qué esperabas que sucediera

**Comportamiento Actual**
Qué sucedió realmente

**Screenshots**
Si aplica, agregar screenshots

**Entorno**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Versión: [e.g. 1.0.0]

**Contexto Adicional**
Cualquier otra información relevante
```

---

## 💡 Sugerir Mejoras

### Template de Feature Request

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda

**Describe alternativas consideradas**
Otras soluciones o funcionalidades consideradas

**Contexto Adicional**
Screenshots, mockups, etc.
```

---

## 🎨 Guía de Estilo

### Componentes

#### ✅ Hacer

```javascript
// Componentes funcionales con hooks
const UserCard = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
    </div>
  )
}

// Destructuring de props
const Button = ({ onClick, children, variant = 'primary' }) => {
  return <button onClick={onClick}>{children}</button>
}

// Early returns
const UserProfile = ({ user }) => {
  if (!user) return <div>Loading...</div>
  
  return <div>{user.name}</div>
}
```

#### ❌ Evitar

```javascript
// Componentes de clase (usar funcionales)
class UserCard extends React.Component { }

// Props sin destructuring
const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>
}

// Lógica compleja en JSX
return (
  <div>
    {users.filter(u => u.active).map(u => u.name).join(', ')}
  </div>
)
```

### Estado

#### ✅ Hacer

```javascript
// useState para estado local
const [count, setCount] = useState(0)

// useReducer para estado complejo
const [state, dispatch] = useReducer(reducer, initialState)

// Context para estado global
const { user, setUser } = useAuth()
```

#### ❌ Evitar

```javascript
// Mutar estado directamente
state.count = 1 // ❌

// Usar this.state (componentes de clase)
this.setState({ count: 1 }) // ❌
```

### Efectos

#### ✅ Hacer

```javascript
// Especificar dependencias
useEffect(() => {
  fetchData()
}, [userId])

// Cleanup functions
useEffect(() => {
  const subscription = subscribe()
  return () => subscription.unsubscribe()
}, [])
```

#### ❌ Evitar

```javascript
// Sin array de dependencias
useEffect(() => {
  fetchData()
}) // ❌ Se ejecuta en cada render

// Dependencias faltantes
useEffect(() => {
  fetchData(userId)
}, []) // ❌ userId debería estar en dependencias
```

### Manejo de Errores

#### ✅ Hacer

```javascript
// Try-catch en funciones async
const fetchData = async () => {
  try {
    const data = await api.getData()
    setData(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    setError(error.message)
  }
}

// Error boundaries para componentes
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Performance

#### ✅ Hacer

```javascript
// useMemo para cálculos costosos
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// useCallback para funciones
const handleClick = useCallback(() => {
  doSomething(a, b)
}, [a, b])

// React.memo para componentes
export default React.memo(MyComponent)
```

---

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Testing Library](https://testing-library.com/)
- [React Patterns](https://reactpatterns.com/)

---

## ❓ Preguntas

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Contactar al equipo en [email]
- Revisar la documentación existente

---

## 🙏 Agradecimientos

¡Gracias por contribuir a SGC Ultimate! Tu ayuda hace que este proyecto sea mejor para todos.

---

**Última actualización**: 2024-01-15
