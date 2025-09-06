// Router SPA para navegación sin recargar página
import { updateState, getState, getCourseById, navLinks } from './data.js';

class SPARouter {
    constructor() {
        this.routes = {
            '/': () => this.loadHome(),
            '/home': () => this.loadHome(),
            '/cursos': () => this.loadCursos(),
            '/curso': () => this.loadCourse(),
            '/mikrotik': () => this.loadMikrotik(),
            '/cochabamba': () => this.redirectExternal('https://www.upds.edu.bo/sede/cochabamba/'),
            '/facultades': () => this.loadFacultades(),
            '/facultades/ciencias-salud': () => this.loadFacultad('ciencias-salud'),
            '/facultades/ingenieria': () => this.loadFacultad('ingenieria'),
            '/facultades/ciencias-empresariales': () => this.loadFacultad('ciencias-empresariales'),
            '/facultades/ciencias-juridicas': () => this.loadFacultad('ciencias-juridicas'),
            '/academias': () => this.loadAcademias(),
            '/academias/mikrotik': () => this.loadAcademia('mikrotik'),
            '/academias/huawei': () => this.loadAcademia('huawei'),
        };
        
        this.currentRoute = window.location.pathname;
        this.mainSection = null; // Referencia al contenedor principal
        this.init();
    }

    init() {
        // Obtener referencia al contenedor principal
        this.mainSection = document.getElementById('main-section');
        if (!this.mainSection) {
            console.error('❌ [ROUTER] No se encontró el elemento #main-section');
            return;
        }

        console.log('✅ [ROUTER] Contenedor principal encontrado:', this.mainSection);
        
        // Interceptar clicks en enlaces
        document.addEventListener('click', (e) => {
            const link = e.target.matches('a') ? e.target : e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Interceptar clicks en navegación principal (upds-nav-link)
            if (link.classList.contains('upds-nav-link')) {
                e.preventDefault();
                
                // Obtener el índice del enlace clickeado
                const navTop = document.querySelector(".upds-nav-top");
                if (navTop) {
                    const navLinks = navTop.querySelectorAll('.upds-nav-link');
                    const clickedIndex = Array.from(navLinks).indexOf(link);
                    if (clickedIndex !== -1) {
                        // Actualizar el índice del header
                        window.DATA.headIndex = clickedIndex;
                        // Actualizar la posición de la flecha inmediatamente
                        this.updateHeaderArrow();
                        // Actualizar los breadcrumbs
                        this.updateHeaderBreadcrumbs();
                    }
                }
                
                // Si no es una navegación externa, continuar con la navegación normal
                if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                    this.navigate(href);
                }
                return;
            }
            
            // Interceptar enlaces de secciones (#section-id)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                this.scrollToSection(href.substring(1)); // Remover el #
                return;
            }
            
            // Interceptar enlaces de páginas
            if (e.target.matches('a[href^="/"]') || e.target.closest('a[href^="/"]')) {
                e.preventDefault();
                
                // No interceptar enlaces externos o de assets
                if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('/assets/')) {
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
        
        // Inicializar navegación del header
        this.initHeaderNavigation();
    }

    initHeaderNavigation() {
        const header = document.querySelector('header');
        if (header) {
            // Crear navegación superior
            let navTop = header.querySelector(".upds-nav-top");
            if (navTop) {
                navTop.innerHTML = `${navLinks.map(link => `<a class="upds-nav-link" href="${link.href}">${link.name}</a>`).join('')}`;
            }
            
            // Crear navegación inferior inicial (se actualizará dinámicamente)
            let navBottom = header.querySelector(".upds-header-contact");
            if (navBottom && window.DATA && window.DATA.headIndex !== undefined) {
                const currentNav = navLinks[window.DATA.headIndex];
                if (currentNav.navs && currentNav.navs.length > 0) {
                    navBottom.innerHTML = `${currentNav.navs.map(link => `<a href="${link.href}" class="upds-contact-link">${link.name}</a>`).join('')}`;
                } else if (currentNav.sections && currentNav.sections.length > 0) {
                    // Si no hay navs pero sí sections (como en Inicio), usar sections
                    navBottom.innerHTML = `${currentNav.sections.map(section => `<a href="#${section.id}" class="upds-section-link hover:text-gray-200 transition-colors">${section.name}</a>`).join('')}`;
                }
            }
            
            // Configurar posicionamiento de la flecha del header
            let navTopLinks = navTop ? navTop.querySelectorAll('a') : [];
            let elementorHeader = document.getElementById("elementor-header");
            
            let resizeHeader = () => {
                if (window.DATA && navTopLinks[window.DATA.headIndex] && elementorHeader) {
                    const link = navTopLinks[window.DATA.headIndex];
                    // Asegurar que la flecha se posiciona correctamente
                    requestAnimationFrame(() => {
                        elementorHeader.style.left = `${link.offsetLeft + link.offsetWidth/2}px`;
                        elementorHeader.classList.add("active");
                    });
                }
            };
            
            // Agregar listener para redimensionamiento
            window.addEventListener('resize', resizeHeader);
            
            // Mejorar el timing para evitar animaciones raras
            if (document.readyState === 'complete') {
                setTimeout(resizeHeader, 150);
            } else {
                window.addEventListener('load', resizeHeader);
            }
            
            // Ejecutar inicialmente
            resizeHeader();
        }
    }

    async loadPageContent(pageName) {
        try {
            console.log(`🔄 [ROUTER] Cargando página: ${pageName}`);
            
            // 1. Preservar la altura actual del contenedor
            const currentHeight = this.mainSection.offsetHeight;
            this.mainSection.style.minHeight = `${currentHeight}px`;
            
            // 2. Hacer invisible el contenido actual manteniendo el espacio
            const currentContent = this.mainSection.firstElementChild;
            if (currentContent) {
                currentContent.style.transition = 'opacity 0.2s ease-out';
                currentContent.style.opacity = '0';
                console.log('👻 [ROUTER] Contenido actual ocultado');
            }
            
            // 3. Mostrar indicador discreto de carga
            this.showLoadingOverlay();
            
            // 4. Pequeño delay para que se complete la transición de ocultado
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // 5. Cargar el nuevo contenido
            const response = await fetch(`/assets/pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            
            // 6. Insertar el nuevo contenido (invisible inicialmente)
            this.mainSection.innerHTML = content;
            const newContent = this.mainSection.firstElementChild;
            
            if (newContent) {
                // Hacer invisible el nuevo contenido inicialmente
                newContent.style.opacity = '0';
                newContent.style.transition = 'opacity 0.3s ease-in';
            }
            
            // 7. Mostrar el contenedor principal y esperar que el DOM se procese
            this.showMainContent();
            
            // 8. Esperar a que el DOM esté completamente procesado
            await this.waitForDOMReady();
            
            // 9. Pequeño delay adicional para asegurar que todo esté renderizado
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // 10. Ocultar indicador de carga
            this.hideLoadingOverlay();
            
            // 11. Mostrar el nuevo contenido con transición suave
            if (newContent) {
                newContent.style.opacity = '1';
                console.log('✨ [ROUTER] Nuevo contenido mostrado');
            }
            
            // 12. Scroll suave hacia arriba después de cargar la nueva página
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                console.log('⬆️ [ROUTER] Scroll suave hacia arriba ejecutado');
            }, 100);
            
            // 13. Remover la altura mínima fija después de que termine la transición
            setTimeout(() => {
                this.mainSection.style.minHeight = '';
            }, 300);
            
            console.log(`✅ [ROUTER] Página ${pageName} cargada correctamente`);
            return true;
            
        } catch (error) {
            console.error(`❌ [ROUTER] Error cargando ${pageName}:`, error);
            
            // En caso de error, limpiar todo
            this.hideLoadingOverlay();
            this.mainSection.style.minHeight = '';
            
            // Si es error 404, redirigir a home
            if (error.message.includes('404') || error.message.includes('Error 404')) {
                console.log(`🏠 [ROUTER] Página ${pageName} no encontrada, redirigiendo a home`);
                this.redirectToHome();
                return true; // Considerar como éxito ya que redirigimos
            } else {
                // Para otros errores, mostrar página de error
                this.showErrorPage(pageName, error);
                return false;
            }
        }
    }

    showLoadingOverlay() {
        // Crear overlay discreto sobre el área de contenido
        const overlay = document.createElement('div');
        overlay.id = 'page-loading-overlay';
        overlay.className = 'absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10';
        overlay.innerHTML = `
            <div class="flex items-center space-x-3 text-gray-600">
                <div class="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                <span class="text-sm font-medium">Cargando...</span>
            </div>
        `;
        
        // Asegurar que el contenedor principal tenga position relative
        this.mainSection.style.position = 'relative';
        this.mainSection.appendChild(overlay);
        
        // Animar entrada
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.2s ease-in';
            overlay.style.opacity = '1';
        }, 10);
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('page-loading-overlay');
        if (overlay) {
            overlay.style.transition = 'opacity 0.2s ease-out';
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
                // Limpiar el position relative si no es necesario
                this.mainSection.style.position = '';
            }, 200);
        }
    }

    // Función para esperar a que el DOM esté completamente procesado
    async waitForDOMReady() {
        return new Promise(resolve => {
            // Usar requestAnimationFrame para asegurar que el navegador haya procesado los cambios
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Double RAF para asegurar que el layout esté completamente calculado
                    resolve();
                });
            });
        });
    }

    showErrorPage(pageName, error) {
        this.mainSection.innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-red-600 mb-4">Error al cargar la página</h2>
                    <p class="text-gray-600 mb-4">No se pudo cargar el contenido de "${pageName}"</p>
                    <p class="text-sm text-gray-500 mb-6">${error.message}</p>
                    <div class="space-x-4">
                        <button onclick="location.reload()" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6">
                            Reintentar
                        </button>
                        <a href="/" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-6">
                            Volver al inicio
                        </a>
                    </div>
                </div>
            </div>
        `;
        this.showMainContent();
    }

    scrollToSection(sectionId) {
        console.log(`🎯 [SCROLL] Navegando a sección: ${sectionId}`);
        const element = document.getElementById(sectionId);
        if (element) {
            // Calcular la posición teniendo en cuenta el header sticky
            const elementPosition = element.offsetTop; // 10px de margen adicional
            
            // Scroll suave
            window.scrollTo({
                top: elementPosition, // Asegurar que no sea negativo
                behavior: 'smooth'
            });
            
            console.log(`✅ [SCROLL] Scroll suave a ${sectionId} completado (posición: ${elementPosition}px)`);
            
            // Actualizar el estado de la sección actual manualmente
            // para que el header se actualice inmediatamente
            if (this.currentRoute === '/' || this.currentRoute === '/home') {
                // Encontrar la sección correspondiente en navLinks
                const homeSections = navLinks[0].sections;
                const section = homeSections.find(s => s.id === sectionId);
                if (section) {
                    this.updateHeaderForHomeSection(section);
                }
            }
        } else {
            console.error(`❌ [SCROLL] Sección no encontrada: ${sectionId}`);
        }
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
            // Ruta no encontrada - redirigir completamente a home
            console.log(`⚠️ [ROUTER] Ruta no encontrada: ${route}, redirigiendo a home`);
            this.redirectToHome();
            return;
        }
        
        // Actualizar flecha del header
        this.updateHeaderArrow();
        this.updateHeaderBreadcrumbs();
    }

    redirectToHome() {
        // Cambiar la URL a home
        this.currentRoute = '/';
        window.history.replaceState({}, '', '/');
        
        // Actualizar el header para home
        this.updateHeaderIndex('/');
        
        // Scroll suave hacia arriba
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Cargar la vista home
        this.loadHome();
        
        // Actualizar UI del header
        this.updateHeaderArrow();
        this.updateHeaderBreadcrumbs();
        
        console.log('🏠 [ROUTER] Redirección a home completada con scroll hacia arriba');
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
            '/cursos': 1,
            '/curso': 1,
            '/facultades': 1,
            '/facultades/ciencias-salud': 1,
            '/facultades/ingenieria': 1,
            '/facultades/ciencias-empresariales': 1,
            '/facultades/ciencias-juridicas': 1,
            '/academias': 1,
            '/academias/mikrotik': 1,
            '/academias/huawei': 1,
            '/cochabamba': 2,
            '/mikrotik': 3
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
                const currentNav = module.navLinks[window.DATA.headIndex];
                const currentNavs = currentNav?.navs || [];
                const currentSections = currentNav?.sections || [];
                
                if (currentNavs.length > 0) {
                    // Mostrar navegación de subcategorías con dropdowns
                    navBottom.innerHTML = currentNavs.map(link => {
                        if (link.submenu && link.submenu.length > 0) {
                            // Crear dropdown para elementos con submenú
                            const submenuHTML = link.submenu.map((subitem, index) => {
                                if (subitem.submenu && subitem.submenu.length > 0) {
                                    // Elemento con submenú anidado
                                    const nestedSubmenuHTML = subitem.submenu.map((nestedItem, nestedIndex) => 
                                        `<a href="${nestedItem.href}" class="nested-dropdown-item block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors ${nestedIndex < subitem.submenu.length - 1 ? 'border-b border-gray-100' : ''}">${nestedItem.name}</a>`
                                    ).join('');
                                    
                                    return `
                                        <div class="nested-dropdown-container relative">
                                            <div class="dropdown-item-with-submenu flex items-center justify-between px-6 py-4 text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer ${index < link.submenu.length - 1 ? 'border-b-2 border-gray-200' : ''}" 
                                                 data-nested-dropdown="${subitem.name}">
                                                <span>${subitem.name}</span>
                                                <svg class="w-4 h-4 transition-transform nested-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </div>
                                            <div class="nested-dropdown-menu absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible transform scale-95 transition-all duration-200 z-50">
                                                <div class="py-1">
                                                    ${nestedSubmenuHTML}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                } else {
                                    // Elemento normal sin submenú anidado
                                    return `<a href="${subitem.href}" class="dropdown-item block px-6 py-4 text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors ${index < link.submenu.length - 1 ? 'border-b-2 border-gray-200' : ''}">${subitem.name}</a>`;
                                }
                            }).join('');
                            
                            return `
                                <div class="dropdown-container relative inline-block">
                                    <button class="upds-contact-link dropdown-trigger hover:text-gray-200 transition-colors flex items-center" 
                                            data-dropdown="${link.name}">
                                        ${link.name}
                                        <svg class="w-4 h-4 ml-1 transition-transform dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div class="dropdown-menu absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible transform scale-95 transition-all duration-200 z-50">
                                        <div class="py-2">
                                            ${submenuHTML}
                                        </div>
                                    </div>
                                </div>
                            `;
                        } else {
                            // Enlace normal sin submenú
                            return `<a href="${link.href}" class="upds-contact-link hover:text-gray-200 transition-colors">${link.name}</a>`;
                        }
                    }).join('');
                    
                    // Inicializar funcionalidad de dropdown después de crear el HTML
                    setTimeout(() => this.initDropdownFunctionality(), 10);
                } else if (currentSections.length > 0) {
                    // Mostrar navegación de secciones (como en Inicio)
                    navBottom.innerHTML = currentSections.map(section => 
                        `<a href="#${section.id}" data-section="${section.id}" class="upds-section-link hover:text-gray-200 transition-colors">${section.name}</a>`
                    ).join('');
                    
                    // Si estamos en home, inicializar scroll detection
                    if (window.DATA.name === 'home') {
                        this.initHomeScrollDetection();
                    }
                } else if (window.DATA.name === 'home') {
                    // Fallback para home si no hay sections definidas
                    this.initHomeSectionNavigation();
                    this.initHomeScrollDetection();
                }
            }
        });
    }

    initHomeScrollDetection() {
        console.log('🔄 [HOME-SECTIONS] Inicializando detección de scroll para secciones');
        
        // Remover listener anterior si existe
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            console.log('🧹 [HOME-SECTIONS] Listener anterior removido');
        }

        // Importar configuración de secciones
        import('./data.js').then(module => {
            const { navLinks } = module;
            const homeSections = navLinks[0].sections; // Obtener secciones de la página de inicio
            console.log('📋 [HOME-SECTIONS] Secciones cargadas:', homeSections.map(s => s.id));
            
            this.scrollListener = () => {
                const scrollY = window.scrollY;
                const scrollPosition = scrollY + 100; // Offset para activar antes
                let currentSection = homeSections[0]; // Default: hero section
                
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
                    console.log('📍 [HOME-SECTIONS] Cambio de sección:', this.currentHomeSection, '→', currentSection.id);
                    this.currentHomeSection = currentSection.id;
                    this.updateHeaderForHomeSection(currentSection);
                }
            };
            
            // Agregar listener
            window.addEventListener('scroll', this.scrollListener);
            console.log('👂 [HOME-SECTIONS] Listener de scroll agregado');
            
            // Ejecutar una vez para inicializar
            this.scrollListener();
        });
    }

    initHomeSectionNavigation() {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🔄 [HOME-SECTIONS] Inicializando navegación de secciones');
            
            // Obtener secciones de navLinks
            const homeSections = navLinks[0].sections;
            
            // Crear enlaces de navegación dinámicamente
            navBottom.innerHTML = homeSections.map(section => 
                `<a href="#${section.id}" data-section="${section.id}" class="upds-section-link hover:text-gray-200 transition-colors">
                    ${section.name}
                </a>`
            ).join('');
            
            console.log('✅ [HOME-SECTIONS] Navegación de secciones inicializada');
        }
    }

    updateHeaderForHomeSection(section) {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🎨 [HOME-SECTIONS] Resaltando sección activa:', section.name);
            
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
                console.log('✅ [HOME-SECTIONS] Sección resaltada:', section.name);
            }
        }
    }

    cleanupScrollDetection() {
        if (this.scrollListener) {
            console.log('🧹 [SECTIONS] Limpiando detección de scroll');
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
            this.currentHomeSection = null;
            this.currentCourseSection = null;
            console.log('✅ [SECTIONS] Scroll detection limpiado');
        }
    }

    // Mantener compatibilidad con el nombre anterior
    cleanupHomeScrollDetection() {
        this.cleanupScrollDetection();
    }

    initCourseScrollDetection(course) {
        console.log('🔄 [COURSE-SECTIONS] Inicializando detección de scroll para página de curso:', course.title);
        
        // Remover listener anterior si existe
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            console.log('🧹 [COURSE-SECTIONS] Listener anterior removido');
        }

        // Configurar navegación específica para curso
        this.initCourseNavigation(course);
        
        // Definir las secciones del curso
        const courseSections = [
            { id: 'course-main-card', name: 'Información' },
            { id: 'instructor-card', name: 'Instructor' },
            { id: 'course-content-card', name: 'Contenido' },
            { id: 'skills-card', name: 'Habilidades' }
        ];
        
        this.scrollListener = () => {
            const scrollY = window.scrollY;
            let currentSection = courseSections[0]; // Default: información del curso
            
            // Encontrar la sección actual basada en scroll
            const scrollPosition = scrollY + 150; // Offset para activar antes
            for (const section of courseSections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const elementTop = element.offsetTop - 100;
                    if (scrollPosition >= elementTop) {
                        currentSection = section;
                    }
                }
            }
            
            // Actualizar header solo si cambió la sección
            if (this.currentCourseSection !== currentSection.id) {
                console.log('📍 [COURSE-SECTIONS] Cambio de sección en curso:', this.currentCourseSection, '→', currentSection.id);
                this.currentCourseSection = currentSection.id;
                this.updateHeaderForCourseSection(currentSection);
            }
        };
        
        // Agregar listener
        window.addEventListener('scroll', this.scrollListener);
        console.log('👂 [COURSE-SECTIONS] Listener de scroll agregado para curso');
        
        // Ejecutar una vez para inicializar
        this.scrollListener();
    }

    initCourseNavigation(course) {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🔄 [COURSE-SECTIONS] Inicializando navegación para curso:', course.title);
            
            // Crear enlaces de navegación para las secciones del curso
            navBottom.innerHTML = `
                <a href="#course-main-card" data-section="course-main-card" class="upds-course-link hover:text-gray-200 transition-colors">
                    Información
                </a>
                <a href="#instructor-card" data-section="instructor-card" class="upds-course-link hover:text-gray-200 transition-colors">
                    Instructor
                </a>
                <a href="#course-content-card" data-section="course-content-card" class="upds-course-link hover:text-gray-200 transition-colors">
                    Contenido
                </a>
                <a href="#skills-card" data-section="skills-card" class="upds-course-link hover:text-gray-200 transition-colors">
                    Habilidades
                </a>
            `;
            
            console.log('✅ [COURSE-SECTIONS] Navegación de curso inicializada');
        }
    }

    updateHeaderForCourseSection(section) {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🎨 [COURSE-SECTIONS] Resaltando sección activa del curso:', section.name);
            
            // Remover clase activa de todos los enlaces
            const allLinks = navBottom.querySelectorAll('.upds-course-link');
            allLinks.forEach(link => {
                link.classList.remove('text-yellow-300', 'font-bold');
                link.classList.add('text-white');
            });
            
            // Agregar clase activa al enlace de la sección actual
            const activeLink = navBottom.querySelector(`[data-section="${section.id}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-white');
                activeLink.classList.add('text-yellow-300', 'font-bold');
                console.log('✅ [COURSE-SECTIONS] Sección de curso resaltada:', section.name);
            }
        }
    }

    async loadHome() {
        updateState({ selectedCourse: null });
        window.DATA.name = "home";
        
        const loaded = await this.loadPageContent('home');
        if (loaded) {
            // Inicializar vista home después de cargar el contenido
            setTimeout(async () => {
                try {
                    const { renderHomeView } = await import('./modules/home.js');
                    renderHomeView();
                    this.initHomeScrollDetection();
                } catch (error) {
                    console.error('❌ [ROUTER] Error al configurar vista home:', error);
                }
            }, 100);
        }
    }

    async loadCourse(params) {
        if (!params) {
            const urlParams = new URLSearchParams(window.location.search);
            params = urlParams;
        }
        
        this.cleanupScrollDetection(); // Limpiar scroll detection anterior
        const courseId = params.get('id');
        
        if (courseId) {
            const course = getCourseById(courseId);
            if (course) {
                updateState({ selectedCourse: course });
                window.DATA.name = "course";
                
                const loaded = await this.loadPageContent('curso');
                if (loaded) {
                    // Renderizar el contenido del curso después de cargar la página
                    setTimeout(async () => {
                        try {
                            const { renderCourseView } = await import('./modules/app.js');
                            renderCourseView(course);
                            this.initCourseScrollDetection(course);
                        } catch (error) {
                            console.error('❌ [ROUTER] Error al renderizar curso:', error);
                        }
                    }, 100);
                }
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
        this.cleanupScrollDetection(); // Limpiar scroll detection de home/curso
        
        const loaded = await this.loadPageContent('mikrotik');
        if (loaded) {
            // Renderizar el contenido de mikrotik después de cargar la página
            setTimeout(async () => {
                try {
                    const { renderCategoryView } = await import('./modules/app.js');
                    renderCategoryView('Mikrotik');
                } catch (error) {
                    console.error('❌ [ROUTER] Error al renderizar mikrotik:', error);
                }
            }, 100);
        }
    }

    async loadCursos() {
        updateState({ selectedCourse: null });
        window.DATA.name = "cursos";
        this.cleanupScrollDetection();
        
        // Por ahora, redirigir a la página principal de cursos (home)
        this.loadHome();
    }

    async loadFacultades() {
        updateState({ selectedCourse: null });
        window.DATA.name = "facultades";
        this.cleanupScrollDetection();
        
        // Por ahora, redirigir a la página principal
        this.loadHome();
    }

    async loadAcademias() {
        updateState({ selectedCourse: null });
        window.DATA.name = "academias";
        this.cleanupScrollDetection();
        
        // Por ahora, redirigir a la página principal
        this.loadHome();
    }

    async loadFacultad(nombre) {
        updateState({ selectedCourse: null });
        window.DATA.name = `facultad-${nombre}`;
        this.cleanupScrollDetection();
        
        const facultadNames = {
            'ciencias-salud': 'Ciencias de la Salud',
            'ingenieria': 'Ingeniería',
            'ciencias-empresariales': 'Ciencias Empresariales',
            'ciencias-juridicas': 'Ciencias Jurídicas'
        };
        
        console.log(`📚 [ROUTER] Cargando Facultad de ${facultadNames[nombre]}`);
        // Por ahora, redirigir a la página principal
        this.loadHome();
    }

    async loadAcademia(nombre) {
        updateState({ selectedCourse: null });
        window.DATA.name = `academia-${nombre}`;
        this.cleanupScrollDetection();
        
        const academiaNames = {
            'mikrotik': 'Mikrotik',
            'huawei': 'Huawei'
        };
        
        console.log(`🎓 [ROUTER] Cargando Academia ${academiaNames[nombre]}`);
        // Por ahora, redirigir a la página principal
        this.loadHome();
    }

    redirectExternal(url) {
        window.open(url, '_blank');
    }

    showMainContent() {
        if (this.mainSection) {
            // Encontrar el elemento main dentro del contenido cargado y mostrarlo
            const mainElement = this.mainSection.querySelector('main');
            if (mainElement && mainElement.classList.contains('hidden')) {
                mainElement.classList.remove('hidden');
                console.log('✅ [ROUTER] Contenido principal mostrado');
            }
        } else {
            console.error('❌ [ROUTER] Elemento #main-section NO encontrado en el DOM');
        }
    }

    // Función para inicializar la funcionalidad de dropdowns
    initDropdownFunctionality() {
        console.log('🔽 [DROPDOWN] Inicializando funcionalidad de dropdowns');
        
        // Limpiar listeners anteriores si existen
        this.cleanupDropdownListeners();
        
        // Obtener todos los triggers de dropdown
        const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
        const dropdownContainers = document.querySelectorAll('.dropdown-container');
        const nestedDropdownTriggers = document.querySelectorAll('.dropdown-item-with-submenu');
        const nestedDropdownContainers = document.querySelectorAll('.nested-dropdown-container');
        
        this.dropdownListeners = [];
        
        dropdownTriggers.forEach(trigger => {
            const container = trigger.closest('.dropdown-container');
            const menu = container.querySelector('.dropdown-menu');
            const arrow = trigger.querySelector('.dropdown-arrow');
            
            if (!container || !menu) return;
            
            // Detectar si es dispositivo móvil
            const isMobile = window.innerWidth < 768;
            
            if (isMobile) {
                // En móviles, usar click
                const clickListener = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Cerrar otros dropdowns
                    dropdownContainers.forEach(otherContainer => {
                        if (otherContainer !== container) {
                            this.closeDropdown(otherContainer);
                        }
                    });
                    
                    // Toggle del dropdown actual
                    this.toggleDropdown(container);
                };
                
                trigger.addEventListener('click', clickListener);
                this.dropdownListeners.push({ element: trigger, event: 'click', listener: clickListener });
            } else {
                // En desktop, usar hover
                const mouseEnterListener = (e) => {
                    // Cerrar otros dropdowns
                    dropdownContainers.forEach(otherContainer => {
                        if (otherContainer !== container) {
                            this.closeDropdown(otherContainer);
                        }
                    });
                    
                    // Abrir el dropdown actual
                    this.openDropdown(container);
                };
                
                const mouseLeaveListener = (e) => {
                    // Usar setTimeout para permitir que el mouse se mueva al dropdown
                    setTimeout(() => {
                        // Verificar si el mouse no está sobre el container o el dropdown
                        const containerHovered = container.matches(':hover');
                        if (!containerHovered) {
                            this.closeDropdown(container);
                        }
                    }, 100);
                };
                
                // También permitir click para navegación en desktop
                const clickListener = (e) => {
                    e.preventDefault();
                    const href = trigger.getAttribute('data-href') || trigger.closest('a')?.getAttribute('href');
                    if (href && href !== '#') {
                        window.location.href = href;
                    }
                };
                
                container.addEventListener('mouseenter', mouseEnterListener);
                container.addEventListener('mouseleave', mouseLeaveListener);
                trigger.addEventListener('click', clickListener);
                
                this.dropdownListeners.push({ element: container, event: 'mouseenter', listener: mouseEnterListener });
                this.dropdownListeners.push({ element: container, event: 'mouseleave', listener: mouseLeaveListener });
                this.dropdownListeners.push({ element: trigger, event: 'click', listener: clickListener });
            }
        });
        
        // Manejar dropdowns anidados
        nestedDropdownTriggers.forEach(trigger => {
            const container = trigger.closest('.nested-dropdown-container');
            const menu = container.querySelector('.nested-dropdown-menu');
            
            if (!container || !menu) return;
            
            // Detectar si es dispositivo móvil
            const isMobile = window.innerWidth < 768;
            
            if (isMobile) {
                // En móviles, usar click
                const clickListener = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Cerrar otros dropdowns anidados
                    nestedDropdownContainers.forEach(otherContainer => {
                        if (otherContainer !== container) {
                            this.closeNestedDropdown(otherContainer);
                        }
                    });
                    
                    // Toggle del dropdown anidado actual
                    this.toggleNestedDropdown(container);
                };
                
                trigger.addEventListener('click', clickListener);
                this.dropdownListeners.push({ element: trigger, event: 'click', listener: clickListener });
            } else {
                // En desktop, usar hover
                const mouseEnterListener = (e) => {
                    // Cerrar otros dropdowns anidados
                    nestedDropdownContainers.forEach(otherContainer => {
                        if (otherContainer !== container) {
                            this.closeNestedDropdown(otherContainer);
                        }
                    });
                    
                    // Abrir el dropdown anidado actual
                    this.openNestedDropdown(container);
                };
                
                const mouseLeaveListener = (e) => {
                    // Usar setTimeout para permitir que el mouse se mueva al dropdown
                    setTimeout(() => {
                        // Verificar si el mouse no está sobre el container o el dropdown
                        const containerHovered = container.matches(':hover');
                        if (!containerHovered) {
                            this.closeNestedDropdown(container);
                        }
                    }, 100);
                };
                
                container.addEventListener('mouseenter', mouseEnterListener);
                container.addEventListener('mouseleave', mouseLeaveListener);
                
                this.dropdownListeners.push({ element: container, event: 'mouseenter', listener: mouseEnterListener });
                this.dropdownListeners.push({ element: container, event: 'mouseleave', listener: mouseLeaveListener });
            }
        });
        
        // Click fuera para cerrar dropdowns (solo para móviles)
        const documentClickListener = (e) => {
            if (!e.target.closest('.dropdown-container')) {
                dropdownContainers.forEach(container => {
                    this.closeDropdown(container);
                });
                nestedDropdownContainers.forEach(container => {
                    this.closeNestedDropdown(container);
                });
            }
        };
        
        document.addEventListener('click', documentClickListener);
        this.dropdownListeners.push({ element: document, event: 'click', listener: documentClickListener });
        
        // Listener para reinicializar cuando cambie el tamaño de ventana
        const resizeListener = () => {
            // Cerrar todos los dropdowns primero
            dropdownContainers.forEach(container => {
                this.closeDropdown(container);
            });
            nestedDropdownContainers.forEach(container => {
                this.closeNestedDropdown(container);
            });
            // Reinicializar después de un pequeño delay
            setTimeout(() => this.initDropdownFunctionality(), 100);
        };
        
        window.addEventListener('resize', resizeListener);
        this.dropdownListeners.push({ element: window, event: 'resize', listener: resizeListener });
        
        console.log(`✅ [DROPDOWN] ${dropdownTriggers.length} dropdowns inicializados`);
    }
    
    toggleDropdown(container) {
        const menu = container.querySelector('.dropdown-menu');
        const arrow = container.querySelector('.dropdown-arrow');
        
        if (!menu) return;
        
        const isOpen = menu.classList.contains('dropdown-open');
        
        if (isOpen) {
            this.closeDropdown(container);
        } else {
            this.openDropdown(container);
        }
    }
    
    openDropdown(container) {
        const menu = container.querySelector('.dropdown-menu');
        const arrow = container.querySelector('.dropdown-arrow');
        
        if (!menu) return;
        
        menu.classList.add('dropdown-open');
        menu.classList.remove('opacity-0', 'invisible', 'scale-95');
        menu.classList.add('opacity-100', 'visible', 'scale-100');
        
        if (arrow) {
            arrow.style.transform = 'rotate(180deg)';
        }
    }
    
    closeDropdown(container) {
        const menu = container.querySelector('.dropdown-menu');
        const arrow = container.querySelector('.dropdown-arrow');
        
        if (!menu) return;
        
        menu.classList.remove('dropdown-open');
        menu.classList.remove('opacity-100', 'visible', 'scale-100');
        menu.classList.add('opacity-0', 'invisible', 'scale-95');
        
        if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
        }
    }
    
    toggleNestedDropdown(container) {
        const menu = container.querySelector('.nested-dropdown-menu');
        const arrow = container.querySelector('.nested-arrow');
        
        if (!menu) return;
        
        const isOpen = menu.classList.contains('nested-dropdown-open');
        
        if (isOpen) {
            this.closeNestedDropdown(container);
        } else {
            this.openNestedDropdown(container);
        }
    }
    
    openNestedDropdown(container) {
        const menu = container.querySelector('.nested-dropdown-menu');
        const arrow = container.querySelector('.nested-arrow');
        
        if (!menu) return;
        
        menu.classList.add('nested-dropdown-open');
        menu.classList.remove('opacity-0', 'invisible', 'scale-95');
        menu.classList.add('opacity-100', 'visible', 'scale-100');
        
        if (arrow) {
            arrow.style.transform = 'rotate(90deg)';
        }
    }
    
    closeNestedDropdown(container) {
        const menu = container.querySelector('.nested-dropdown-menu');
        const arrow = container.querySelector('.nested-arrow');
        
        if (!menu) return;
        
        menu.classList.remove('nested-dropdown-open');
        menu.classList.remove('opacity-100', 'visible', 'scale-100');
        menu.classList.add('opacity-0', 'invisible', 'scale-95');
        
        if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
        }
    }

    cleanupDropdownListeners() {
        if (this.dropdownListeners) {
            this.dropdownListeners.forEach(({ element, event, listener }) => {
                element.removeEventListener(event, listener);
            });
            this.dropdownListeners = [];
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