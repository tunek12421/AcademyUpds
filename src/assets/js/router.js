// Router SPA para navegación sin recargar página
import { updateState, getState, getCourseById } from './data.js';
// Importar funciones de renderizado de manera dinámica para evitar problemas de dependencias circulares

class SPARouter {
    constructor() {
        console.log('🔧 [ROUTER] Creando instancia del router...');
        this.routes = {
            '/': () => this.loadHome(),
            '/home': () => this.loadHome(),
            '/spa.html': () => this.loadHome(),  // Agregar ruta spa.html
            '/curso': () => this.loadCourse(),
            '/mikrotik': () => this.loadMikrotik(),
            '/cochabamba': () => this.redirectExternal('https://www.upds.edu.bo/sede/cochabamba/'),
        };
        
        this.currentRoute = window.location.pathname;
        console.log('📍 [ROUTER] Ruta inicial:', this.currentRoute);
        this.init();
    }

    init() {
        console.log('⚡ [ROUTER] Inicializando router...');
        
        // Interceptar clicks en enlaces
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"]') || e.target.closest('a[href^="/"]')) {
                e.preventDefault();
                const link = e.target.matches('a') ? e.target : e.target.closest('a');
                const href = link.getAttribute('href');
                
                console.log('🖱️ [ROUTER] Click interceptado en:', href);
                
                // No interceptar enlaces externos
                if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                    console.log('🌐 [ROUTER] Enlace externo, no interceptado');
                    return;
                }
                
                this.navigate(href);
            }
        });

        // Manejar botón atrás/adelante del navegador
        window.addEventListener('popstate', () => {
            console.log('⬅️ [ROUTER] Evento popstate detectado');
            this.loadRoute(window.location.pathname + window.location.search);
        });

        // Cargar ruta inicial
        console.log('🚀 [ROUTER] Cargando ruta inicial...');
        this.loadRoute(window.location.pathname + window.location.search);
        console.log('✅ [ROUTER] Router inicializado completamente');
    }

    navigate(path) {
        if (path !== this.currentRoute) {
            this.currentRoute = path;
            window.history.pushState({}, '', path);
            this.loadRoute(path);
        }
    }

    loadRoute(path) {
        console.log('📄 [ROUTER] Cargando ruta:', path);
        
        // Parsear ruta y parámetros
        const [route, queryString] = path.split('?');
        const params = new URLSearchParams(queryString || '');
        
        console.log('🔗 [ROUTER] Ruta parseada:', route);
        console.log('🔗 [ROUTER] Parámetros:', params.toString());
        
        // Actualizar DATA.headIndex basado en la ruta
        this.updateHeaderIndex(route);
        
        // Ejecutar función de ruta
        const routeFunction = this.routes[route];
        if (routeFunction) {
            console.log('✅ [ROUTER] Función de ruta encontrada, ejecutando...');
            routeFunction(params);
        } else {
            console.log('❌ [ROUTER] Ruta no encontrada, fallback a home');
            this.loadHome(); // Fallback a home
        }
        
        // Actualizar flecha del header
        this.updateHeaderArrow();
    }

    updateHeaderIndex(route) {
        // Verificar que window.DATA existe, sino inicializarlo
        if (!window.DATA) {
            console.log('⚠️ [ROUTER] window.DATA no existe, inicializándolo...');
            window.DATA = {
                headIndex: 0,
                name: "home"
            };
        }
        
        const routeToIndex = {
            '/': 0,
            '/home': 0,
            '/spa.html': 0,  // Agregar ruta spa.html
            '/curso': 1,
            '/mikrotik': 3,
            '/cochabamba': 2
        };
        
        const newIndex = routeToIndex[route] || 0;
        console.log('📊 [ROUTER] Actualizando headIndex de', window.DATA.headIndex, 'a', newIndex);
        window.DATA.headIndex = newIndex;
    }

    updateHeaderArrow() {
        // Pequeño delay para asegurar que el DOM esté actualizado
        setTimeout(() => {
            const navTop = document.querySelector(".upds-nav-top");
            const elementorHeader = document.getElementById("elementor-header");
            
            if (navTop && elementorHeader) {
                const link = navTop.querySelectorAll('a')[window.DATA.headIndex];
                if (link) {
                    requestAnimationFrame(() => {
                        elementorHeader.style.left = `${link.offsetLeft + link.offsetWidth/2}px`;
                        elementorHeader.classList.add("active");
                    });
                }
            }
        }, 50);
    }

    async loadHome() {
        console.log('🏠 [ROUTER] Cargando vista HOME...');
        updateState({ selectedCourse: null });
        window.DATA.name = "home";
        this.showMainContent();
        
        try {
            // Importar función dinámicamente
            console.log('📦 [ROUTER] Importando módulo app.js...');
            const { renderHomeView } = await import('./modules/app.js');
            console.log('🎨 [ROUTER] Ejecutando renderHomeView...');
            renderHomeView();
            console.log('✅ [ROUTER] Vista HOME cargada correctamente');
        } catch (error) {
            console.error('❌ [ROUTER] Error al cargar HOME:', error);
        }
    }

    async loadCourse(params) {
        if (!params) {
            const urlParams = new URLSearchParams(window.location.search);
            params = urlParams;
        }
        
        const courseId = params.get('id');
        if (courseId) {
            const course = getCourseById(courseId);
            if (course) {
                updateState({ selectedCourse: course });
                window.DATA.name = "course";
                this.showMainContent();
                
                // Importar función dinámicamente
                const { renderCourseView } = await import('./modules/app.js');
                renderCourseView(course);
            } else {
                this.loadHome(); // Curso no encontrado
            }
        } else {
            this.loadHome(); // Sin ID
        }
    }

    async loadMikrotik() {
        updateState({ selectedCourse: null });
        window.DATA.name = "category";
        this.showMainContent();
        
        // Importar función dinámicamente
        const { renderCategoryView } = await import('./modules/app.js');
        renderCategoryView('Mikrotik');
    }

    redirectExternal(url) {
        window.open(url, '_blank');
    }

    showMainContent() {
        console.log('👁️ [ROUTER] Mostrando contenido principal...');
        const mainElement = document.querySelector('main');
        if (mainElement) {
            console.log('✅ [ROUTER] Elemento main encontrado, removiendo clase hidden');
            mainElement.classList.remove('hidden');
            console.log('✅ [ROUTER] Clases del main después:', mainElement.className);
        } else {
            console.error('❌ [ROUTER] Elemento main NO encontrado en el DOM');
        }
    }

    // Método para navegación programática
    goTo(path) {
        this.navigate(path);
    }
}

// Instancia global del router
let router = null;

// Función para inicializar el router
export function initRouter() {
    if (!router) {
        router = new SPARouter();
    }
    return router;
}

// Función para navegación programática
export function navigateTo(path) {
    if (router) {
        router.goTo(path);
    }
}

// Exportar router para uso externo
export { router };