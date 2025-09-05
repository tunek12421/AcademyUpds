// Router SPA para navegación sin recargar página
import { updateState, getState, getCourseById } from './data.js';
// Importar funciones de renderizado de manera dinámica para evitar problemas de dependencias circulares

class SPARouter {
    constructor() {
        this.routes = {
            '/': () => this.loadHome(),
            '/home': () => this.loadHome(),
            '/spa.html': () => this.loadHome(),  // Agregar ruta spa.html
            '/curso': () => this.loadCourse(),
            '/mikrotik': () => this.loadMikrotik(),
            '/cochabamba': () => this.redirectExternal('https://www.upds.edu.bo/sede/cochabamba/'),
        };
        
        this.currentRoute = window.location.pathname;
        this.init();
    }

    init() {
        
        // Interceptar clicks en enlaces
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"]') || e.target.closest('a[href^="/"]')) {
                e.preventDefault();
                const link = e.target.matches('a') ? e.target : e.target.closest('a');
                const href = link.getAttribute('href');
                
                
                // No interceptar enlaces externos
                if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                    return;
                }
                
                this.navigate(href);
            }
        });

        // Manejar botón atrás/adelante del navegador
        window.addEventListener('popstate', () => {
            this.loadRoute(window.location.pathname + window.location.search);
        });

        // Cargar ruta inicial
        this.loadRoute(window.location.pathname + window.location.search);
    }

    navigate(path) {
        if (path !== this.currentRoute) {
            this.currentRoute = path;
            window.history.pushState({}, '', path);
            this.loadRoute(path);
        }
    }

    loadRoute(path) {
        
        // Parsear ruta y parámetros
        const [route, queryString] = path.split('?');
        const params = new URLSearchParams(queryString || '');
        
        
        // Actualizar DATA.headIndex basado en la ruta
        this.updateHeaderIndex(route);
        
        // Ejecutar función de ruta
        const routeFunction = this.routes[route];
        if (routeFunction) {
            routeFunction(params);
        } else {
            this.loadHome(); // Fallback a home
        }
        
        // Actualizar flecha del header
        this.updateHeaderArrow();
        this.updateHeaderBreadcrumbs();
    }

    updateHeaderIndex(route) {
        // Verificar que window.DATA existe, sino inicializarlo
        if (!window.DATA) {
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

    updateHeaderBreadcrumbs() {
        // Importar navLinks desde data.js
        import('./data.js').then(module => {
            const navBottom = document.querySelector(".upds-header-contact");
            if (navBottom && module.navLinks) {
                const currentNavs = module.navLinks[window.DATA.headIndex]?.navs || [];
                if (currentNavs.length > 0) {
                    // Mostrar breadcrumbs
                    navBottom.innerHTML = currentNavs.map(link => 
                        `<a href="${link.href}" class="upds-contact-link hover:text-gray-200 transition-colors">${link.name}</a>`
                    ).join('');
                } else if (window.DATA.name === 'home') {
                    // Si estamos en home, inicializar navegación de secciones y scroll detection
                    this.initHomeSectionNavigation();
                    this.initHomeScrollDetection();
                } else {
                    // Mostrar información de contacto por defecto
                    navBottom.innerHTML = `
                        <a href="tel:+59161681770" class="upds-contact-link hover:text-gray-200 transition-colors">
                            Tel: +591 61681770
                        </a>
                        <a href="mailto:info@upds.edu.bo" class="upds-contact-link hover:text-gray-200 transition-colors">
                            Email: info@upds.edu.bo
                        </a>
                        <span class="upds-contact-link hidden sm:inline">
                            Dirección: Cochabamba - Bolivia
                        </span>
                    `;
                }
            }
        });
    }

    initHomeScrollDetection() {
        console.log('🔄 [STICKY-HEADER] Inicializando detección de scroll para header sticky');
        
        // Obtener referencias a los elementos del header
        this.whiteHeader = document.querySelector('header > div:first-child');
        this.blueHeader = document.querySelector('header > div:last-child');
        
        if (this.whiteHeader && this.blueHeader) {
            // Calcular la altura de la parte blanca para saber cuándo activar sticky
            this.whiteHeaderHeight = this.whiteHeader.offsetHeight;
            console.log('📏 [STICKY-HEADER] Altura parte blanca:', this.whiteHeaderHeight + 'px');
        }
        
        // Remover listener anterior si existe
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            console.log('🧹 [STICKY-HEADER] Listener anterior removido');
        }

        // Importar configuración de secciones
        import('./data.js').then(module => {
            const { homeSections } = module;
            console.log('📋 [STICKY-HEADER] Secciones cargadas:', homeSections.map(s => s.id));
            
            this.scrollListener = () => {
                const scrollY = window.scrollY;
                const scrollPosition = scrollY + 100; // Offset para activar antes
                let currentSection = homeSections[0]; // Default: hero section
                
                // Control del sticky de la parte azul con transición CSS natural
                if (this.blueHeader) {
                    if (scrollY >= this.whiteHeaderHeight) {
                        // Activar sticky: solo agregar clase para transición CSS
                        if (!this.blueHeader.classList.contains('blue-header-sticky')) {
                            this.blueHeader.classList.add('blue-header-sticky');
                            console.log('🌊 [STICKY-HEADER] Desprendimiento suave iniciado...');
                        }
                    } else {
                        // Desactivar sticky: solo remover clase para transición CSS
                        if (this.blueHeader.classList.contains('blue-header-sticky')) {
                            this.blueHeader.classList.remove('blue-header-sticky');
                            console.log('🌊 [STICKY-HEADER] Reacoplamiento suave iniciado...');
                        }
                    }
                }
                
                // Debug scroll position y elementos (menos frecuente)
                if (scrollY > 0 && scrollY % 200 === 0) {
                    console.log('📏 [STICKY-HEADER] Scroll position:', scrollY);
                }
                
                // Encontrar la sección actual basada en scroll
                for (const section of homeSections) {
                    const element = document.getElementById(section.id);
                    if (element) {
                        const elementTop = element.offsetTop - 100;
                        if (scrollPosition >= elementTop) {
                            currentSection = section;
                        }
                    }
                }
                
                // Actualizar header solo si cambió la sección
                if (this.currentHomeSection !== currentSection.id) {
                    console.log('📍 [STICKY-HEADER] Cambio de sección:', this.currentHomeSection, '→', currentSection.id);
                    this.currentHomeSection = currentSection.id;
                    this.updateHeaderForHomeSection(currentSection);
                }
            };
            
            // Agregar listener
            window.addEventListener('scroll', this.scrollListener);
            console.log('👂 [STICKY-HEADER] Listener de scroll agregado');
            
            // Ejecutar una vez para inicializar
            this.scrollListener();
        });
    }

    initHomeSectionNavigation() {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🔄 [STICKY-HEADER] Inicializando navegación de secciones');
            // Crear enlaces de navegación para todas las secciones
            navBottom.innerHTML = `
                <a href="#hero-section" data-section="hero-section" class="upds-section-link hover:text-gray-200 transition-colors">
                    Inicio
                </a>
                <a href="#courses-section" data-section="courses-section" class="upds-section-link hover:text-gray-200 transition-colors">
                    Cursos
                </a>
                <a href="#about-section" data-section="about-section" class="upds-section-link hover:text-gray-200 transition-colors">
                    Nosotros
                </a>
            `;
            console.log('✅ [STICKY-HEADER] Navegación de secciones inicializada');
        }
    }

    updateHeaderForHomeSection(section) {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🎨 [STICKY-HEADER] Resaltando sección activa:', section.name);
            
            // Remover clase activa de todos los enlaces
            const allLinks = navBottom.querySelectorAll('.upds-section-link');
            allLinks.forEach(link => {
                link.classList.remove('text-yellow-300', 'font-bold');
                link.classList.add('text-white');
            });
            
            // Agregar clase activa al enlace de la sección actual
            const activeLink = navBottom.querySelector(`[data-section="${section.id}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-white');
                activeLink.classList.add('text-yellow-300', 'font-bold');
                console.log('✅ [STICKY-HEADER] Sección resaltada:', section.name);
            }
        }
    }

    cleanupHomeScrollDetection() {
        if (this.scrollListener) {
            console.log('🧹 [STICKY-HEADER] Limpiando detección de scroll');
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
            this.currentHomeSection = null;
            
            // Limpiar estado sticky de la parte azul
            if (this.blueHeader) {
                this.blueHeader.classList.remove('blue-header-sticky');
                console.log('🧹 [STICKY-HEADER] Estado sticky removido de la parte azul');
            }
            
            console.log('✅ [STICKY-HEADER] Scroll detection limpiado');
        }
    }

    async loadHome() {
        updateState({ selectedCourse: null });
        window.DATA.name = "home";
        this.showMainContent();
        
        try {
            // Importar función dinámicamente
            const { renderHomeView } = await import('./modules/app.js');
            renderHomeView();
        } catch (error) {
            console.error('❌ [ROUTER] Error al cargar HOME:', error);
        }
    }

    async loadCourse(params) {
        if (!params) {
            const urlParams = new URLSearchParams(window.location.search);
            params = urlParams;
        }
        
        this.cleanupHomeScrollDetection(); // Limpiar scroll detection de home
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
        this.cleanupHomeScrollDetection(); // Limpiar scroll detection de home
        
        // Importar función dinámicamente
        const { renderCategoryView } = await import('./modules/app.js');
        renderCategoryView('Mikrotik');
    }

    redirectExternal(url) {
        window.open(url, '_blank');
    }

    showMainContent() {
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.classList.remove('hidden');
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