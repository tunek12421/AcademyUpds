# UPDS - Vanilla JavaScript Version

Una conversión completa del proyecto React original a HTML, CSS y JavaScript vanilla, manteniendo toda la funcionalidad y el diseño visual.

## 📋 Características

- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **Navegación por pestañas** funcional
- ✅ **Sistema de cursos** interactivo
- ✅ **Detalles dinámicos** de cada curso
- ✅ **Instructores y módulos** completos
- ✅ **Interfaz moderna** con componentes reutilizables
- ✅ **Imágenes con fallback** automático
- ✅ **Animaciones y transiciones** suaves

## 🗂️ Estructura del proyecto

```
project_vanilla/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos adicionales
├── js/
│   ├── data.js         # Datos de cursos y estado
│   ├── components.js   # Componentes reutilizables
│   └── app.js          # Lógica principal y eventos
├── assets/             # (vacío - imágenes desde URLs)
└── README.md           # Este archivo
```

## 🚀 Cómo ejecutar

### Opción 1: Servidor local simple
```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Con PHP
php -S localhost:8000
```

### Opción 2: Abrir directamente
Simplemente abre `index.html` en tu navegador web favorito.

### Opción 3: VS Code Live Server
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🎯 Funcionalidades implementadas

### Navegación
- **Pestaña "Información General"**: Vista principal con cursos destacados
- **Pestaña "Detalles del Curso"**: Vista detallada del curso seleccionado

### Interactividad
- **Selección de cursos**: Click en "Ver detalles" cambia a la pestaña de detalles
- **Navegación entre cursos**: En la barra lateral "Otros cursos"
- **Imágenes adaptativas**: Fallback automático si una imagen falla
- **Notificaciones**: Mensajes informativos para acciones

### Componentes
- **Tarjetas de curso** con información completa
- **Sistema de rating** con estrellas
- **Badges** para categorías y niveles
- **Botones** con estados de hover y focus
- **Iconos SVG** integrados

## 🔧 Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados y animaciones
- **Tailwind CSS**: Framework de utilidades CSS (CDN)
- **JavaScript ES6+**: Funcionalidad moderna sin frameworks
- **SVG**: Iconos vectoriales escalables

## 📱 Características responsive

- **Desktop**: Layout completo con sidebar
- **Tablet**: Adaptación de grid y espaciados
- **Mobile**: Vista de una columna optimizada

## 🎨 Personalización

### Cambiar colores del tema
Modifica las variables CSS personalizadas en `index.html` (sección `tailwind.config`):

```javascript
colors: {
    primary: {
        DEFAULT: "tu-color-aqui",
        foreground: "tu-color-aqui",
    },
    // ... más colores
}
```

### Agregar nuevos cursos
Edita el array `courses` en `js/data.js`:

```javascript
const courses = [
    {
        id: '4',
        title: 'Nuevo Curso',
        description: 'Descripción del curso...',
        // ... más propiedades
    }
];
```

### Personalizar componentes
Modifica las funciones en `js/components.js` para cambiar el HTML generado.

## 🔄 Diferencias con la versión React

### Mantenido
- ✅ Diseño visual idéntico
- ✅ Toda la funcionalidad
- ✅ Estructura de datos
- ✅ Responsividad
- ✅ Animaciones y transiciones

### Convertido
- 🔄 `useState` → Variables globales de estado
- 🔄 Componentes React → Funciones que retornan HTML
- 🔄 Props → Parámetros de función
- 🔄 Event handlers → Event listeners nativos
- 🔄 Condicional rendering → Manipulación DOM directa

## 🐛 Resolución de problemas

### Las imágenes no cargan
- Las imágenes tienen fallback automático a placeholders
- Verifica la conexión a internet para las imágenes de Unsplash

### Los estilos no se aplican
- Asegúrate de que Tailwind CSS se carga desde el CDN
- Verifica que `css/styles.css` esté vinculado correctamente

### JavaScript no funciona
- Abre las herramientas de desarrollador (F12)
- Revisa la consola por errores
- Asegúrate de que los archivos JS se cargan en orden

## 📝 Notas de desarrollo

- **Estado global**: Se maneja con el objeto `appState` en `data.js`
- **Renderizado**: Cada cambio de estado re-renderiza solo las partes necesarias
- **Eventos**: Se usan event listeners nativos del DOM
- **Modularidad**: El código está separado en módulos lógicos
- **Performance**: Optimizado para cargas rápidas sin dependencias pesadas

## 🚀 Mejoras futuras posibles

- [ ] Sistema de routing para URLs amigables
- [ ] LocalStorage para persistir el curso seleccionado
- [ ] Sistema de búsqueda y filtros
- [ ] Modo oscuro/claro
- [ ] Animaciones más avanzadas
- [ ] Progressive Web App (PWA)
- [ ] Optimización de imágenes
- [ ] Sistema de comentarios/reseñas

## 📄 Licencia

Este proyecto es una conversión educativa del proyecto React original.# AcademyUpds
