// Router SPA para navegación sin recargar página
import { updateState, getState, getCourseById, navLinks } from './data.js';

class SPARouter {
    constructor() {
        // Función centralizada para normalizar nombres a IDs
        this.normalizeToId = (name) => {
            return name.toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[áàäâ]/g, 'a')
                      .replace(/[éèëê]/g, 'e')
                      .replace(/[íìïî]/g, 'i')
                      .replace(/[óòöô]/g, 'o')
                      .replace(/[úùüû]/g, 'u')
                      .replace(/[ñ]/g, 'n')
                      .replace(/[^\w-]/g, '');
        };

        this.routes = {
            '/': () => this.loadHome(),
            '/home': () => this.loadHome(),
            '/cursos': () => this.loadCursos(),
            '/curso': () => this.loadCourse(),
            '/mikrotik': () => this.loadMikrotik(),
            '/facultades': () => this.loadFacultades(),
            '/facultades/ciencias-salud': () => this.loadFacultad('ciencias-salud'),
            '/facultades/ciencias-salud/manejo-cadaveres': () => this.loadCursoFacultad('ciencias-salud', 'manejo-cadaveres'),
            '/facultades/ciencias-salud/primeros-auxilios': () => this.loadCursoFacultad('ciencias-salud', 'primeros-auxilios'),
            '/facultades/ingenieria': () => this.loadFacultad('ingenieria'),
            '/facultades/ingenieria/excel-experto': () => this.loadCursoFacultad('ingenieria', 'excel-experto'),
            '/facultades/ciencias-empresariales': () => this.loadFacultad('ciencias-empresariales'),
            '/facultades/ciencias-empresariales/tributacion-aplicada': () => this.loadCursoFacultad('ciencias-empresariales', 'tributacion-aplicada'),
            '/facultades/ciencias-juridicas': () => this.loadFacultad('ciencias-juridicas'),
            '/facultades/ciencias-juridicas/estrategias-litigacion': () => this.loadCursoFacultad('ciencias-juridicas', 'estrategias-litigacion'),
            '/ciencias-salud': () => this.loadFacultad('ciencias-salud'),
            '/ingenieria': () => this.loadFacultad('ingenieria'),
            '/ciencias-empresariales': () => this.loadFacultad('ciencias-empresariales'),
            '/ciencias-juridicas': () => this.loadFacultad('ciencias-juridicas'),
            '/academias': () => this.loadAcademias(),
            '/academias/mikrotik': () => this.loadAcademia('mikrotik'),
            // '/academias/huawei': () => this.loadAcademia('huawei'), // Temporalmente oculto
        };
        
        this.currentRoute = window.location.pathname;
        this.mainSection = null; // Referencia al contenedor principal
        this.currentCursosSection = null; // Sección actual de cursos
        this.init();
    }

    init() {
        // Obtener referencia al contenedor principal
        this.mainSection = document.getElementById('main-section');
        if (!this.mainSection) {
            console.error('❌ [ROUTER] No se encontró el elemento #main-section');
            return;
        }

        // console.log('✅ [ROUTER] Contenedor principal encontrado:', this.mainSection);
        
        // Interceptar clicks en enlaces (usando capture phase para mayor prioridad)
        // console.log('🎯 [ROUTER] Registrando event listener global de clicks con CAPTURE');
        document.addEventListener('click', (e) => {
            // console.log('🖱️ [DEBUG] CLICK GLOBAL detectado en:', e.target);
            
            // Buscar el enlace más cercano (incluyendo el elemento clickeado)
            const link = e.target.matches('a') ? e.target : e.target.closest('a');
            if (!link) {
                // console.log('❌ [DEBUG] No es un enlace, ignorando');
                return;
            }
            
            const href = link.getAttribute('href');
            
            // DEBUG: Log detallado de todos los clicks en enlaces
            console.log('🖱️ [DEBUG] Click detectado:', {
                href: href,
                target: e.target,
                link: link,
                classes: link.className,
                hasUpdsNavLink: link.classList.contains('upds-nav-link'),
                hasUpdsContactLink: link.classList.contains('upds-contact-link'),
                hasUpdsSectionLink: link.classList.contains('upds-section-link'),
                dataSection: link.getAttribute('data-section'),
                currentRoute: this.currentRoute,
                elementVisible: window.getComputedStyle(link).visibility !== 'hidden',
                elementOpacity: window.getComputedStyle(link).opacity,
                pointerEvents: window.getComputedStyle(link).pointerEvents
            });
            
            // PRIORIDAD 1: Interceptar enlaces de secciones (upds-section-link o #section-id)
            if (link.classList.contains('upds-section-link') || 
                link.classList.contains('upds-contact-link') || 
                (href && href.startsWith('#'))) {
                
                console.log('🔗 [DEBUG] Link de sección detectado - INTERCEPTANDO');
                e.preventDefault();
                e.stopPropagation();
                
                // Obtener el ID de la sección
                let sectionId = '';
                if (href && href.startsWith('#')) {
                    sectionId = href.substring(1); // Remover el #
                } else if (link.hasAttribute('data-section')) {
                    sectionId = link.getAttribute('data-section');
                }
                
                console.log('🎯 [DEBUG] SectionId extraído:', sectionId);

                if (sectionId) {
                    // Verificar si es una sección de curso (course-main-card, instructor-card, course-content-card, skills-card)
                    const courseSections = ['course-main-card', 'instructor-card', 'course-content-card', 'skills-card'];
                    const isCourseSection = courseSections.includes(sectionId);

                    // Verificar si es una sección de cursos usando normalización
                    const cursosCategories = ['Mikrotik', 'Ciencias de la Salud', 'Ingeniería', 'Ciencias Empresariales', 'Ciencias Jurídicas'];
                    const cursosSections = cursosCategories.map(cat => this.normalizeToId(cat) + '-section');
                    const isCursosSection = cursosSections.includes(sectionId);

                    console.log('🔍 [DEBUG] Verificación de secciones:');
                    console.log('   - Sección buscada:', sectionId);
                    console.log('   - Secciones válidas de cursos:', cursosSections);
                    console.log('   - Es sección de cursos?:', isCursosSection);
                    console.log('   - Ruta actual:', this.currentRoute);

                    if (isCourseSection && this.currentRoute && this.currentRoute.includes('/curso/')) {
                        // Si estamos en una página de curso y es una sección de curso, hacer scroll directo
                        console.log('📚 [DEBUG] Estamos en curso, scroll directo a sección de curso:', sectionId);
                        this.scrollToSection(sectionId);
                    } else if (isCursosSection && this.currentRoute === '/cursos') {
                        // Si estamos en la página de cursos y es una sección de cursos, hacer scroll directo
                        console.log('📚 [DEBUG] Estamos en página cursos, scroll directo a sección:', sectionId);
                        this.scrollToSection(sectionId);
                    } else if (isCursosSection && this.currentRoute !== '/cursos') {
                        // Si es una sección de cursos pero no estamos en la página cursos, navegar primero
                        console.log('📍 [DEBUG] Navegando a página cursos primero, luego scroll a:', sectionId);
                        this.navigate('/cursos');
                        setTimeout(() => {
                            console.log('⏰ [DEBUG] Timeout completado, haciendo scroll a:', sectionId);
                            this.scrollToSection(sectionId);
                        }, 500);
                    } else if (this.currentRoute !== '/' && this.currentRoute !== '/home' && !isCourseSection && !isCursosSection) {
                        // Solo navegar a home si no estamos allí y NO es una sección de curso o cursos
                        console.log('📍 [DEBUG] No estamos en home, navegando primero...');
                        this.navigate('/');
                        setTimeout(() => {
                            console.log('⏰ [DEBUG] Timeout completado, haciendo scroll a:', sectionId);
                            this.scrollToSection(sectionId);
                        }, 300);
                    } else {
                        console.log('🏠 [DEBUG] Scroll directo a sección:', sectionId);
                        // Hacer scroll directamente
                        this.scrollToSection(sectionId);
                    }
                } else {
                    console.warn('⚠️ [DEBUG] No se pudo extraer sectionId del enlace');
                }
                return;
            }
            
            // Interceptar clicks en navegación principal (upds-nav-link)
            if (link.classList.contains('upds-nav-link')) {
                // console.log('🎯 [DEBUG] Navegación principal detectada (upds-nav-link)');
                // Caso especial para Cochabamba - abrir enlace externo directamente
                if (href && href.includes('cochabamba')) {
                    window.open('https://www.upds.edu.bo/sede/cochabamba/', '_blank');
                    return; // No prevenir default, no cambiar navegación interna
                }
                
                e.preventDefault();
                
                // Obtener el índice del enlace clickeado
                const navTop = document.querySelector(".upds-nav-top");
                if (navTop) {
                    const navLinks = navTop.querySelectorAll('.upds-nav-link');
                    const clickedIndex = Array.from(navLinks).indexOf(link);
                    // console.log('🔢 [DEBUG] Click en navegable:', {
                    //     linkText: link.textContent,
                    //     clickedIndex: clickedIndex,
                    //     totalLinks: navLinks.length,
                    //     currentHeadIndex: window.DATA.headIndex
                    // });
                    if (clickedIndex !== -1) {
                        // Actualizar el índice del header
                        // console.log(`🎯 [DEBUG] Actualizando headIndex de ${window.DATA.headIndex} a ${clickedIndex}`);
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
            
            // Interceptar enlaces de páginas
            if (e.target.matches('a[href^="/"]') || e.target.closest('a[href^="/"]')) {
                // console.log('📄 [DEBUG] Link de página detectado:', href);
                
                // NUEVO: Actualización inmediata del header para navegación desde dropdown
                if (href === '/mikrotik') {
                    // console.log('🎯 [ROUTER] Click en Mikrotik desde dropdown - actualizando header inmediatamente');
                    window.DATA.headIndex = 2; // Índice para Mikrotik
                    this.updateHeaderArrow();
                }
                
                // Caso especial para Cochabamba - abrir enlace externo directamente
                if (href && href.includes('cochabamba')) {
                    e.preventDefault();
                    
                    // Cerrar menú móvil si está abierto (usar las clases correctas)
                    const mobileMenu = document.getElementById('mobile-menu');
                    const mobileToggle = document.getElementById('mobile-toggle');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        if (mobileToggle) {
                            mobileToggle.classList.remove('active');
                        }
                    }
                    
                    window.open('https://www.upds.edu.bo/sede/cochabamba/', '_blank');
                    return;
                }
                
                e.preventDefault();
                
                // No interceptar enlaces externos o de assets
                if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('/assets/')) {
                    return;
                }
                
                // console.log('🚀 [DEBUG] Ejecutando navigate() con href:', href);
                this.navigate(href);
            } else {
                // console.log('❌ [DEBUG] Click no interceptado - no es link de página');
            }
        }, true); // Usar capture phase para interceptar antes que otros listeners

        // Manejar botón atrás/adelante del navegador
        window.addEventListener('popstate', () => {
            this.loadRoute(window.location.pathname + window.location.search);
        });

        // Manejar recarga de página - scroll hacia arriba
        window.addEventListener('beforeunload', () => {
            // Scroll instantáneo hacia arriba antes de que se recargue la página
            window.scrollTo(0, 0);
            console.log('🔄 [ROUTER] Scroll hacia arriba ejecutado antes del reload');
        });
        // Cargar ruta inicial
        this.loadRoute(window.location.pathname + window.location.search);
        
        // Registrar listeners adicionales para elementos dinámicos
        this.setupDynamicEventListeners();
        
        // Inicializar navegación del header
        this.initHeaderNavigation();
        
        // Inicializar detección de sticky header
        this.initStickyHeaderDetection();
        
        // Inicializar menú móvil
        this.initMobileMenu();
    }

    initHeaderNavigation() {
        const header = document.querySelector('header');
        if (header) {
            // Crear navegación superior
            let navTop = header.querySelector(".upds-nav-top");
            if (navTop) {
                navTop.innerHTML = `${navLinks.map(link => `<a class="upds-nav-link" href="${link.href}">${link.name}</a>`).join('')}`;
                
                // DEBUGGING: Agregar event listener específico para Mikrotik
                const mikrotikLink = Array.from(navTop.querySelectorAll('.upds-nav-link')).find(link => link.textContent.trim() === 'Mikrotik');
                if (mikrotikLink) {
                    // console.log('🎯 [DEBUG] Encontrado navegable Mikrotik, agregando listener específico');
                    mikrotikLink.addEventListener('click', (e) => {
                        // console.log('🔥 [DEBUG] CLICK DIRECTO EN MIKROTIK DETECTADO!', {
                        //     target: e.target,
                        //     href: e.target.href,
                        //     index: Array.from(navTop.querySelectorAll('.upds-nav-link')).indexOf(e.target)
                        // });
                        
                        // Forzar actualización inmediata del header
                        e.preventDefault();
                        window.DATA.headIndex = 2;
                        this.updateHeaderArrow();
                        this.updateHeaderBreadcrumbs();
                        this.navigate('/mikrotik');
                    });
                }
            }
            
            // Crear navegación inferior inicial (se actualizará dinámicamente)
            let navBottom = header.querySelector(".upds-header-contact");
            if (navBottom && window.DATA && window.DATA.headIndex !== undefined) {
                const currentNav = navLinks[window.DATA.headIndex];
                if (currentNav.navs && currentNav.navs.length > 0) {
                    navBottom.innerHTML = `${currentNav.navs.map(link => `<a href="${link.href}" class="upds-contact-link">${link.name}</a>`).join('')}`;
                } else if (currentNav.sections && currentNav.sections.length > 0) {
                    // Si no hay navs pero sí sections (como en Inicio), usar sections
                    navBottom.innerHTML = `${currentNav.sections.map(section => `<a href="#${section.id}" data-section="${section.id}" class="upds-section-link hover:text-primary-hover transition-colors">${section.name}</a>`).join('')}`;
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

    initStickyHeaderDetection() {
        // console.log('🔄 [ROUTER] Inicializando detección de sticky header');
        
        const stickySection = document.querySelector('.bg-primary.sticky');
        const stickyLogos = document.getElementById('sticky-logos');
        
        if (!stickySection || !stickyLogos) {
            console.warn('⚠️ [ROUTER] No se encontraron elementos sticky header necesarios');
            return;
        }
        
        let isSticky = false;
        
        const handleScroll = () => {
            const stickyRect = stickySection.getBoundingClientRect();
            const shouldShowLogos = stickyRect.top <= 0;
            
            if (shouldShowLogos && !isSticky) {
                // Activar logos sticky
                isSticky = true;
                stickySection.classList.add('sticky-mode'); // Agregar clase para altura aumentada
                stickyLogos.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
                stickyLogos.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto', 'active');
                console.log('✨ [STICKY] Logos activados');
                
            } else if (!shouldShowLogos && isSticky) {
                // Desactivar logos sticky
                isSticky = false;
                stickySection.classList.remove('sticky-mode'); // Quitar clase de altura aumentada
                stickyLogos.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto', 'active');
                stickyLogos.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
                console.log('🔽 [STICKY] Logos desactivados');
            }
        };
        
        // Agregar listener de scroll
        window.addEventListener('scroll', handleScroll);
        
        // Ejecutar una vez para inicializar
        handleScroll();
        
        // console.log('✅ [ROUTER] Detección de sticky header inicializada');
    }

    async loadPageContent(pageName) {
        try {
            // console.log(`🔄 [ROUTER] Cargando página: ${pageName}`);
            
            // 1. Preservar la altura actual del contenedor
            const currentHeight = this.mainSection.offsetHeight;
            this.mainSection.style.minHeight = `${currentHeight}px`;
            
            // 2. Hacer invisible el contenido actual manteniendo el espacio
            const currentContent = this.mainSection.firstElementChild;
            if (currentContent) {
                currentContent.style.transition = 'opacity 0.2s ease-out';
                currentContent.style.opacity = '0';
                // console.log('👻 [ROUTER] Contenido actual ocultado');
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
            
            
            // 7. Esperar a que el DOM esté completamente procesado
            await this.waitForDOMReady();
            
            // 8. Pequeño delay adicional para asegurar que todo esté renderizado
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // 9. Mostrar el contenedor principal y esperar que el DOM se procese
            this.showMainContent();
            
            // 10. Ocultar indicador de carga
            this.hideLoadingOverlay();
            
            // 11. Mostrar el nuevo contenido con transición suave
            if (newContent) {
                newContent.style.opacity = '1';
                // console.log('✨ [ROUTER] Nuevo contenido mostrado');
            }
            
            
            // 13. Remover la altura mínima fija después de que termine la transición
            setTimeout(() => {
                this.mainSection.style.minHeight = '';
            }, 300);
            
            // console.log(`✅ [ROUTER] Página ${pageName} cargada correctamente`);
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
        // Crear overlay que solo cubre el área main (no header ni footer)
        const overlay = document.createElement('div');
        overlay.id = 'page-loading-overlay';
        overlay.className = 'absolute inset-0 w-full h-full bg-white bg-opacity-95 z-9';
        
        // Agregar el overlay al mainSection
        this.mainSection.style.position = 'relative';
        this.mainSection.appendChild(overlay);

        // Crear el contenedor del indicador de carga simple con position fixed (independiente)
        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'page-loading-indicator';
        loadingContainer.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 z-[9999] opacity-0 transition-opacity duration-300';
        
        // Crear el spinner simple
        const spinner = document.createElement('div');
        spinner.className = 'w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin';
        
        // Crear el texto
        const loadingText = document.createElement('span');
        loadingText.textContent = 'Cargando...';
        loadingText.className = 'text-gray-600 text-sm font-medium';
        
        // Ensamblar el indicador (horizontal: spinner + texto)
        loadingContainer.appendChild(spinner);
        loadingContainer.appendChild(loadingText);
        
        // Agregar el indicador al body (position fixed)
        document.body.appendChild(loadingContainer);

        // Animar entrada
        requestAnimationFrame(() => {
            loadingContainer.classList.remove('opacity-0');
            loadingContainer.classList.add('opacity-100');
        });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    hideLoadingOverlay() {
        // Ocultar y remover el overlay del área main
        const overlay = document.getElementById('page-loading-overlay');
        if (overlay) {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 300);
        }
        
        // Ocultar y remover el indicador fixed
        const loadingIndicator = document.getElementById('page-loading-indicator');
        if (loadingIndicator) {
            // Animar salida suave
            loadingIndicator.classList.remove('opacity-100');
            loadingIndicator.classList.add('opacity-0');
            
            // Remover del DOM después de la animación
            setTimeout(() => {
                if (loadingIndicator.parentNode) {
                    loadingIndicator.remove();
                }
            }, 300);
        }
        
        // Limpiar el position relative si no es necesario
        this.mainSection.style.position = '';
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
        
        // Función que realiza el scroll
        const performScroll = (attempt = 1) => {
            console.log(`🔍 [SCROLL] Intento ${attempt} - Buscando elemento: #${sectionId}`);
            const element = document.getElementById(sectionId);
            
            if (element) {
                // Calcular la posición teniendo en cuenta el header sticky
                const elementPosition = Math.max(0, element.offsetTop - 80);
                
                console.log(`📍 [SCROLL] Elemento encontrado. Posición calculada: ${elementPosition}px`);
                
                // Scroll suave
                window.scrollTo({
                    top: elementPosition,
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
                        console.log(`🎨 [SCROLL] Actualizando header para sección: ${section.name}`);
                        this.updateHeaderForHomeSection(section);
                    }
                } else if (this.currentRoute && this.currentRoute.includes('/curso/')) {
                    // Si estamos en una página de curso, actualizar header para sección de curso
                    const courseSections = [
                        { id: 'course-main-card', name: 'Información' },
                        { id: 'instructor-card', name: 'Instructor' },
                        { id: 'course-content-card', name: 'Contenido' },
                        { id: 'skills-card', name: 'Habilidades' }
                    ];
                    const section = courseSections.find(s => s.id === sectionId);
                    if (section) {
                        console.log(`🎨 [SCROLL] Actualizando header para sección de curso: ${section.name}`);
                        this.updateHeaderForCourseSection(section);
                    }
                }
                return true;
            } else {
                console.warn(`⚠️ [SCROLL] Intento ${attempt} - Sección no encontrada: ${sectionId}`);
                return false;
            }
        };
        
        // Intentar scroll inmediato
        if (!performScroll(1)) {
            // Si no se encuentra la sección, esperar un poco y reintentar hasta 3 veces
            console.log(`🔄 [SCROLL] Reintentando scroll a ${sectionId} en 200ms...`);
            setTimeout(() => {
                if (!performScroll(2)) {
                    console.log(`🔄 [SCROLL] Segundo reintento a ${sectionId} en 500ms...`);
                    setTimeout(() => {
                        if (!performScroll(3)) {
                            console.error(`❌ [SCROLL] No se pudo encontrar la sección después de 3 intentos: ${sectionId}`);
                            // Como último recurso, intentar scroll al inicio de la página
                            console.log(`🏠 [SCROLL] Fallback: navegando al inicio de la página`);
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }
                    }, 500);
                }
            }, 200);
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
        
        // Verificar si es una ruta de curso y determinar el índice correcto
        if (route === '/curso') {
            // Obtener el ID del curso desde los parámetros de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('id');
            
            if (courseId === '1') {
                // Curso Mikrotik MTCNA debe ir al índice 2 (Mikrotik)
                window.DATA.headIndex = 2;
                return;
            }
        }
        
        const routeToIndex = {
            '/': 0,
            '/home': 0,
            '/spa.html': 0,  // Agregar ruta spa.html
            '/cursos': 1,
            '/curso': 1,
            '/facultades': 1,
            '/facultades/ciencias-salud': 1,
            '/facultades/ciencias-salud/manejo-cadaveres': 1,
            '/facultades/ciencias-salud/primeros-auxilios': 1,
            '/facultades/ingenieria': 1,
            '/facultades/ingenieria/excel-experto': 1,
            '/facultades/ciencias-empresariales': 1,
            '/facultades/ciencias-empresariales/tributacion-aplicada': 1,
            '/facultades/ciencias-juridicas': 1,
            '/facultades/ciencias-juridicas/estrategias-litigacion': 1,
            '/academias': 1,
            '/academias/mikrotik': 1,
            // '/academias/huawei': 1, // Temporalmente oculto
            '/mikrotik': 2,
            // '/huawei': 4, // Temporalmente oculto
            '/ciencias-salud': 1,
            '/ingenieria': 1,
            '/ciencias-empresariales': 1,
            '/ciencias-juridicas': 1
        };
        
        const newIndex = routeToIndex[route] || 0;
        window.DATA.headIndex = newIndex;
    }

    updateHeaderArrow() {
        // Pequeño delay para asegurar que el DOM esté actualizado
        setTimeout(() => {
            const navTop = document.querySelector(".upds-nav-top");
            const elementorHeader=document.getElementById("elementor-header");
            
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
                    // Mostrar navegación de subcategorías como enlaces de sección (sin dropdowns)
                    navBottom.innerHTML = currentNavs.map(link => {
                        // Convertir nombre a ID de sección usando función centralizada
                        const sectionId = this.normalizeToId(link.name) + '-section';

                        // Si estamos en página de cursos, hacer que naveguen a secciones
                        if (window.DATA.name === 'cursos') {
                            return `<a href="#${sectionId}" data-section="${sectionId}" class="upds-section-link hover:text-primary-hover transition-colors">${link.name}</a>`;
                        } else {
                            // En otras páginas, usar navegación normal
                            return `<a href="${link.href}" class="upds-contact-link hover:text-primary-hover transition-colors">${link.name}</a>`;
                        }
                    }).join('');

                    // Si estamos en página de cursos, inicializar detección de scroll para secciones
                    if (window.DATA.name === 'cursos') {
                        setTimeout(() => this.initCursosScrollDetection(), 100);
                    }
                } else if (currentSections.length > 0) {
                    // Mostrar navegación de secciones (como en Inicio)
                    navBottom.innerHTML = currentSections.map(section => 
                        `<a href="#${section.id}" data-section="${section.id}" class="upds-section-link hover:text-primary-hover transition-colors">${section.name}</a>`
                    ).join('');
                    
                    // Si estamos en home, inicializar scroll detection
                    if (window.DATA.name === 'home') {
                        this.initHomeScrollDetection();
                    }
                }
                
                // === FUNCIONALIDAD ESPECIAL PARA PÁGINA DE CURSOS ===
                // Si estamos en la página de cursos, convertir los enlaces del navbar en scrolls a secciones
                if (window.DATA.name === 'cursos') {
                    // Llamar con timeout adicional para asegurar que las secciones estén generadas
                    setTimeout(() => {
                        this.initCursosScrollNavigation();
                    }, 2000);
                } else if (window.DATA.name === 'home') {
                    // Fallback para home si no hay sections definidas
                    this.initHomeSectionNavigation();
                    this.initHomeScrollDetection();
                }
            }
        });
    }

    initCursosScrollDetection() {
        console.log('🔄 [CURSOS-SECTIONS] Inicializando detección de scroll para secciones de cursos');

        // Remover listener anterior si existe
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            console.log('🧹 [CURSOS-SECTIONS] Listener anterior removido');
        }

        // Importar configuración de navegación
        import('./data.js').then(module => {
            const { navLinks } = module;
            const cursosNavigation = navLinks[1]; // navLinks[1] es "Cursos"
            const cursosSections = cursosNavigation.navs || [];

            console.log('📋 [CURSOS-SECTIONS] Secciones cargadas:', cursosSections.map(s => s.name));

            this.scrollListener = () => {
                const scrollY = window.scrollY;
                const scrollPosition = scrollY + 150; // Offset para activar antes
                let currentSection = cursosSections[0]; // Default: primera sección

                // Encontrar la sección actual basada en scroll
                for (const section of cursosSections) {
                    const sectionId = this.normalizeToId(section.name) + '-section';
                    const element = document.getElementById(sectionId);
                    if (element) {
                        const elementTop = element.offsetTop - 150;
                        if (scrollPosition >= elementTop) {
                            currentSection = section;
                        }
                    }
                }

                // Actualizar header solo si cambió la sección
                const currentSectionId = this.normalizeToId(currentSection.name) + '-section';
                if (this.currentCursosSection !== currentSectionId) {
                    console.log('📍 [CURSOS-SECTIONS] Cambio de sección:', this.currentCursosSection, '→', currentSectionId);
                    this.currentCursosSection = currentSectionId;
                    this.updateHeaderForCursosSection(currentSection);
                }
            };

            // Agregar listener
            window.addEventListener('scroll', this.scrollListener);
            console.log('👂 [CURSOS-SECTIONS] Listener de scroll agregado');

            // Ejecutar una vez para inicializar
            this.scrollListener();
        }).catch(error => {
            console.error('❌ [CURSOS-SECTIONS] Error cargando secciones:', error);
        });
    }

    initHomeScrollDetection() {
        // console.log('🔄 [HOME-SECTIONS] Inicializando detección de scroll para secciones');

        // Remover listener anterior si existe
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            // console.log('🧹 [HOME-SECTIONS] Listener anterior removido');
        }

        // Importar configuración de secciones
        import('./data.js').then(module => {
            const { navLinks } = module;
            const homeSections = navLinks[0].sections; // Obtener secciones de la página de inicio
            // console.log('📋 [HOME-SECTIONS] Secciones cargadas:', homeSections.map(s => s.id));
            
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
                    // console.log('📍 [HOME-SECTIONS] Cambio de sección:', this.currentHomeSection, '→', currentSection.id);
                    this.currentHomeSection = currentSection.id;
                    this.updateHeaderForHomeSection(currentSection);
                }
            };
            
            // Agregar listener
            window.addEventListener('scroll', this.scrollListener);
            // console.log('👂 [HOME-SECTIONS] Listener de scroll agregado');
            
            // Ejecutar una vez para inicializar
            this.scrollListener();
        });
    }

    initHomeSectionNavigation() {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            // console.log('🔄 [HOME-SECTIONS] Inicializando navegación de secciones');
            
            // Obtener secciones de navLinks
            const homeSections = navLinks[0].sections;
            
            // Crear enlaces de navegación dinámicamente
            navBottom.innerHTML = homeSections.map(section => 
                `<a href="#${section.id}" data-section="${section.id}" class="upds-section-link hover:text-primary-hover transition-colors">
                    ${section.name}
                </a>`
            ).join('');
            
            // console.log('✅ [HOME-SECTIONS] Navegación de secciones inicializada');
        }
    }

    updateHeaderForHomeSection(section) {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            // console.log('🎨 [HOME-SECTIONS] Resaltando sección activa:', section.name);

            // Remover clase activa de todos los enlaces
            const allLinks = navBottom.querySelectorAll('.upds-section-link');
            allLinks.forEach(link => {
                link.classList.remove('text-primary-hover', 'font-bold');
                link.classList.add('text-white');
            });

            // Agregar clase activa al enlace de la sección actual
            const activeLink = navBottom.querySelector(`[data-section="${section.id}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-white');
                activeLink.classList.add('text-primary-hover', 'font-bold');
                // console.log('✅ [HOME-SECTIONS] Sección resaltada:', section.name);
            }
        }
    }

    updateHeaderForCursosSection(section) {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🎨 [CURSOS-SECTIONS] Resaltando sección activa:', section.name);

            // Remover clase activa de todos los enlaces
            const allLinks = navBottom.querySelectorAll('.upds-section-link');
            allLinks.forEach(link => {
                link.classList.remove('text-primary-hover', 'font-bold', 'text-blue-600', 'bg-blue-50', 'px-3', 'py-1', 'rounded-md');
                link.classList.add('text-white');
            });

            // Encontrar el enlace correspondiente por el texto del nombre de la sección
            const sectionId = this.normalizeToId(section.name) + '-section';
            const activeLink = navBottom.querySelector(`[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-white');
                activeLink.classList.add('text-blue-600', 'font-bold', 'bg-blue-50', 'px-3', 'py-1', 'rounded-md');
                console.log('✅ [CURSOS-SECTIONS] Sección resaltada:', section.name);
            } else {
                console.warn('⚠️ [CURSOS-SECTIONS] No se encontró enlace para sección:', sectionId);
            }
        }
    }

    cleanupScrollDetection() {
        if (this.scrollListener) {
            // console.log('🧹 [SECTIONS] Limpiando detección de scroll');
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
            this.currentHomeSection = null;
            this.currentCourseSection = null;
            this.currentCursosSection = null;
            // console.log('✅ [SECTIONS] Scroll detection limpiado');
        }
    }

    // Mantener compatibilidad con el nombre anterior
    cleanupHomeScrollDetection() {
        this.cleanupScrollDetection();
    }

    // === NAVEGACIÓN POR SCROLL PARA PÁGINA DE CURSOS - VERSIÓN ROBUSTA ===
    initCursosScrollNavigation() {
        console.log('🎯 [CURSOS-SCROLL] Inicializando navegación por scroll ROBUSTA para página de cursos');
        
        // Función para mapear nombres a IDs de sección
        const getSectionId = (linkText) => {
            const mapping = {
                'Mikrotik': 'mikrotik-courses',
                'Ciencias de la Salud': 'ciencias-de-la-salud-courses', 
                'Ingeniería': 'ingenieria-courses',
                'Ciencias Empresariales': 'ciencias-empresariales-courses',
                'Ciencias Jurídicas': 'ciencias-juridicas-courses'
            };
            return mapping[linkText] || null;
        };

        // Función para hacer scroll suave
        const scrollToSection = (sectionId) => {
            console.log(`🎯 [CURSOS-SCROLL] Intentando scroll a: ${sectionId}`);
            
            let targetElement = document.getElementById(sectionId);
            
            // Si no se encuentra, intentar con el ID alternativo (-section en lugar de -courses)
            if (!targetElement) {
                const altSectionId = sectionId.replace('-courses', '-section');
                console.log(`🔄 [CURSOS-SCROLL] Probando ID alternativo: ${altSectionId}`);
                targetElement = document.getElementById(altSectionId);
            }
            
            if (!targetElement) {
                console.warn(`⚠️ [CURSOS-SCROLL] Elemento ${sectionId} no encontrado`);
                // Listar todos los elementos con ID para debug
                const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
                console.log('🔍 [CURSOS-SCROLL] IDs disponibles:', allIds);
                return false;
            }

            console.log(`✅ [CURSOS-SCROLL] Elemento encontrado:`, targetElement.id);

            // Calcular posición con offset
            const headerHeight = 100;
            const elementRect = targetElement.getBoundingClientRect();
            const currentScrollY = window.pageYOffset;
            const targetPosition = currentScrollY + elementRect.top - headerHeight;

            console.log(`📍 [CURSOS-SCROLL] Posiciones:`, {
                elementTop: elementRect.top,
                currentScroll: currentScrollY,
                targetPosition: targetPosition,
                headerOffset: headerHeight
            });

            // Hacer scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Verificar después de 500ms
            setTimeout(() => {
                const newScrollY = window.pageYOffset;
                console.log(`✅ [CURSOS-SCROLL] Scroll completado. Posición actual: ${newScrollY}`);
            }, 500);

            return true;
        };

        // Función principal para configurar enlaces
        const setupScrollLinks = () => {
            console.log('🔧 [CURSOS-SCROLL] Configurando enlaces de scroll...');
            
            // Buscar todos los enlaces del navbar
            const navLinks = document.querySelectorAll('.upds-contact-link');
            console.log(`🔍 [CURSOS-SCROLL] Enlaces encontrados: ${navLinks.length}`);

            if (navLinks.length === 0) {
                console.warn('⚠️ [CURSOS-SCROLL] No se encontraron enlaces del navbar');
                return;
            }

            navLinks.forEach((link, index) => {
                const linkText = link.textContent.trim();
                const sectionId = getSectionId(linkText);
                
                console.log(`� [CURSOS-SCROLL] Procesando enlace ${index + 1}: "${linkText}" → ${sectionId}`);

                if (sectionId) {
                    // Remover event listeners existentes clonando el elemento
                    const newLink = link.cloneNode(true);
                    link.parentNode.replaceChild(newLink, link);

                    // Configurar el nuevo enlace
                    newLink.style.cursor = 'pointer';
                    newLink.removeAttribute('href');
                    newLink.setAttribute('data-scroll-target', sectionId);

                    // Agregar event listener
                    newLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log(`🖱️ [CURSOS-SCROLL] Click en "${linkText}" → scrolling a ${sectionId}`);
                        scrollToSection(sectionId);
                    });

                    console.log(`✅ [CURSOS-SCROLL] Configurado: "${linkText}"`);
                } else {
                    console.log(`❌ [CURSOS-SCROLL] No mapeado: "${linkText}"`);
                }
            });

            console.log('✅ [CURSOS-SCROLL] Configuración de enlaces completada');
        };

        // Función para verificar que las secciones existen
        const verifySections = () => {
            console.log('🔍 [CURSOS-SCROLL] Verificando existencia de secciones...');
            const expectedSections = [
                'mikrotik-courses',
                'ciencias-de-la-salud-courses', 
                'ingenieria-courses',
                'ciencias-empresariales-courses',
                'ciencias-juridicas-courses'
            ];

            expectedSections.forEach(id => {
                const element = document.getElementById(id);
                console.log(`   ${id}: ${element ? '✅ Existe' : '❌ No encontrado'}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    console.log(`      Posición: top=${rect.top}, height=${rect.height}`);
                }
            });
        };

        // Ejecutar con múltiples intentos para asegurar que funcione
        const attempts = [100, 500, 1000, 2000, 3000];
        
        attempts.forEach((delay, index) => {
            setTimeout(() => {
                console.log(`🔄 [CURSOS-SCROLL] Intento ${index + 1} (${delay}ms)`);
                verifySections();
                setupScrollLinks();
            }, delay);
        });

        console.log('🎯 [CURSOS-SCROLL] Sistema de scroll robusto inicializado con múltiples intentos');
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
            
            // Detectar si el curso pertenece a una facultad o academia
            const facultyCategories = [
                'Ciencias de la Salud',
                'Ingeniería', 
                'Ciencias Empresariales',
                'Ciencias Jurídicas'
            ];
            
            const academyCategories = [
                'Mikrotik',
                'Huawei'
            ];
            
            const isFacultyCourse = facultyCategories.includes(course.category);
            const isAcademyCourse = academyCategories.includes(course.category);
            
            if (isFacultyCourse || isAcademyCourse) {
                // Si es un curso de facultad o academia, mostrar navegación completa
                if (isFacultyCourse) {
                    console.log(`📚 [COURSE-SECTIONS] Curso de facultad detectado: ${course.category}`);
                } else {
                    console.log(`🎓 [COURSE-SECTIONS] Curso de academia detectado: ${course.category}`);
                }
                
                // Guardar referencia a this para usar dentro del import
                const self = this;
                
                // Importar estructura de facultades y academias
                import('./data.js').then(module => {
                    const { facultyStructure, academyCourses } = module;
                    
                    // Siempre mostrar los dropdowns de Facultades y Academias
                    // Crear dropdown "Facultades" con sub-dropdowns anidados (igual que el nav original)
                        const allFacultiesHTML = facultyStructure.map((fac, index) => {
                            if (fac.submenu && fac.submenu.length > 0) {
                                // Verificar si esta es la facultad actual
                                const isCurrentFaculty = fac.name === course.category;
                                
                                // Facultad con submenu de cursos (estructura anidada)
                                const nestedSubmenuHTML = fac.submenu.map((courseItem, courseIndex) => {
                                    // Verificar si este es el curso actual
                                    const isCurrentCourse = courseItem.href === `/curso?id=${course.id}`;
                                    
                                    // Estilos para el curso actual: bg-primary-100 + border-left-4 + font-semibold
                                    const currentCourseStyles = isCurrentCourse 
                                        ? 'bg-blue-100 border-l-4 border-blue-500 font-semibold text-blue-700' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary';
                                    
                                    return `<a href="${courseItem.href}" class="nested-dropdown-item block px-4 py-2 text-sm transition-colors ${courseIndex < fac.submenu.length - 1 ? 'border-b border-gray-100' : ''} ${currentCourseStyles}">${courseItem.name}</a>`;
                                }).join('');
                                
                                // Estilos para la facultad actual: bg-primary-50 (fondo azul muy claro)
                                const currentFacultyStyles = isCurrentFaculty 
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary';
                                
                                return `
                                    <div class="nested-dropdown-container relative">
                                        <div class="dropdown-item-with-submenu flex items-center justify-between px-6 py-4 text-base transition-colors cursor-pointer ${index < facultyStructure.length - 1 ? 'border-b-2 border-gray-200' : ''} ${currentFacultyStyles}" 
                                             data-nested-dropdown="${fac.name}">
                                            <span>${fac.name}</span>
                                            <svg class="w-4 h-4 transition-transform nested-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </div>
                                        <div class="nested-dropdown-menu absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible transform scale-95 transition-all duration-200 z-9">
                                            <div class="py-1">
                                                ${nestedSubmenuHTML}
                                            </div>
                                        </div>
                                    </div>
                                `;
                            } else {
                                // Facultad sin submenu (enlace simple)
                                return `<a href="${fac.href}" class="dropdown-item block px-6 py-4 text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors ${index < facultyStructure.length - 1 ? 'border-b-2 border-gray-200' : ''}">${fac.name}</a>`;
                            }
                        }).join('');
                        
                        // Crear dropdown "Academias" con sub-dropdowns anidados
                        const academyStructure = [
                            {name: "Mikrotik", href: "/mikrotik", submenu: module.academyCourses.mikrotik},
                            // Solo mostrar Huawei si está habilitado
                            // {name: "Huawei", href: "/huawei", submenu: module.academyCourses.huawei}
                        ];
                        
                        const allAcademiesHTML = academyStructure.map((academy, index) => {
                            if (academy.submenu && academy.submenu.length > 0) {
                                // Verificar si esta es la academia actual
                                const isCurrentAcademy = academy.name === course.category;
                                
                                // Academia con submenu de cursos (estructura anidada)
                                const nestedSubmenuHTML = academy.submenu.map((courseItem, courseIndex) => {
                                    // Verificar si este es el curso actual
                                    const isCurrentCourse = courseItem.href === `/curso?id=${course.id}`;
                                    
                                    // Estilos para el curso actual: bg-primary-100 + border-left-4 + font-semibold
                                    const currentCourseStyles = isCurrentCourse 
                                        ? 'bg-blue-100 border-l-4 border-blue-500 font-semibold text-blue-700' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary';
                                    
                                    return `<a href="${courseItem.href}" class="nested-dropdown-item block px-4 py-2 text-sm transition-colors ${courseIndex < academy.submenu.length - 1 ? 'border-b border-gray-100' : ''} ${currentCourseStyles}">${courseItem.name}</a>`;
                                }).join('');
                                
                                // Estilos para la academia actual: bg-primary-50 (fondo azul muy claro)
                                const currentAcademyStyles = isCurrentAcademy 
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary';
                                
                                return `
                                    <div class="nested-dropdown-container relative">
                                        <div class="dropdown-item-with-submenu flex items-center justify-between px-6 py-4 text-base transition-colors cursor-pointer ${index < academyStructure.length - 1 ? 'border-b-2 border-gray-200' : ''} ${currentAcademyStyles}" 
                                             data-nested-dropdown="${academy.name}">
                                            <span>${academy.name}</span>
                                            <svg class="w-4 h-4 transition-transform nested-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </div>
                                        <div class="nested-dropdown-menu absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible transform scale-95 transition-all duration-200 z-9">
                                            <div class="py-1">
                                                ${nestedSubmenuHTML}
                                            </div>
                                        </div>
                                    </div>
                                `;
                            } else {
                                // Academia sin submenu (enlace simple)
                                return `<a href="${academy.href}" class="dropdown-item block px-6 py-4 text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors ${index < academyStructure.length - 1 ? 'border-b-2 border-gray-200' : ''}">${academy.name}</a>`;
                            }
                        }).join('');
                        
                        navBottom.innerHTML = `
                            <div class="dropdown-container relative inline-block">
                                <button class="upds-contact-link dropdown-trigger hover:text-primary-hover transition-colors flex items-center" 
                                        data-dropdown="Facultades">
                                    Facultades
                                    <svg class="w-4 h-4 ml-1 transition-transform dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="dropdown-menu absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible transform scale-95 transition-all duration-200 z-9">
                                    <div class="py-2">
                                        ${allFacultiesHTML}
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-container relative inline-block">
                                <button class="upds-contact-link dropdown-trigger hover:text-primary-hover transition-colors flex items-center" 
                                        data-dropdown="Academias">
                                    Academias
                                    <svg class="w-4 h-4 ml-1 transition-transform dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="dropdown-menu absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible transform scale-95 transition-all duration-200 z-9">
                                    <div class="py-2">
                                        ${allAcademiesHTML}
                                    </div>
                                </div>
                            </div>
                            <a href="#course-main-card" data-section="course-main-card" class="upds-course-link hover:text-primary-hover transition-colors">
                                Información
                            </a>
                            <a href="#instructor-card" data-section="instructor-card" class="upds-course-link hover:text-primary-hover transition-colors">
                                Instructor
                            </a>
                            <a href="#course-content-card" data-section="course-content-card" class="upds-course-link hover:text-primary-hover transition-colors">
                                Contenido
                            </a>
                            <a href="#skills-card" data-section="skills-card" class="upds-course-link hover:text-primary-hover transition-colors">
                                Habilidades
                            </a>
                        `;
                        
                        // Inicializar funcionalidad de dropdown después de crear el HTML
                        setTimeout(() => self.initDropdownFunctionality(), 10);
                        
                        console.log(`✅ [COURSE-SECTIONS] Navegación completa inicializada para curso: ${course.title}`);
                }).catch(error => {
                    console.error('❌ [COURSE-SECTIONS] Error cargando estructura de navegación:', error);
                    self.createDefaultCourseNavigation(navBottom);
                });
            } else {
                // Si no es un curso de facultad ni academia, mostrar navegación normal de curso
                this.createDefaultCourseNavigation(navBottom);
            }
        }
    }
    
    createDefaultCourseNavigation(navBottom) {
        navBottom.innerHTML = `
            <a href="#course-main-card" data-section="course-main-card" class="upds-course-link hover:text-primary-hover transition-colors">
                Información
            </a>
            <a href="#instructor-card" data-section="instructor-card" class="upds-course-link hover:text-primary-hover transition-colors">
                Instructor
            </a>
            <a href="#course-content-card" data-section="course-content-card" class="upds-course-link hover:text-primary-hover transition-colors">
                Contenido
            </a>
            <a href="#skills-card" data-section="skills-card" class="upds-course-link hover:text-primary-hover transition-colors">
                Habilidades
            </a>
        `;
        
        console.log('✅ [COURSE-SECTIONS] Navegación de curso por defecto inicializada');
    }

    updateHeaderForCourseSection(section) {
        const navBottom = document.querySelector(".upds-header-contact");
        if (navBottom) {
            console.log('🎨 [COURSE-SECTIONS] Resaltando sección activa del curso:', section.name);
            
            // Remover clase activa de todos los enlaces
            const allLinks = navBottom.querySelectorAll('.upds-course-link');
            allLinks.forEach(link => {
                link.classList.remove('text-primary-hover', 'font-bold');
                link.classList.add('text-white');
            });
            
            // Agregar clase activa al enlace de la sección actual
            const activeLink = navBottom.querySelector(`[data-section="${section.id}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-white');
                activeLink.classList.add('text-primary-hover', 'font-bold');
                console.log('✅ [COURSE-SECTIONS] Sección de curso resaltada:', section.name);
            }
        }
    }

    async loadHome() {
        updateState({ selectedCourse: null });
        window.DATA.name = "home";
        
        // Verificar si ya estamos en la página home específicamente (no solo que haya contenido)
        const currentContent = document.querySelector('#main-section main');
        const isAlreadyHome = currentContent && (
            currentContent.querySelector('#hero-section') || 
            currentContent.querySelector('#courses-section') ||
            currentContent.querySelector('#about-section')
        );
        
        if (isAlreadyHome) {
            // Ya tenemos contenido de home cargado, solo actualizar navegación
            this.updateHeaderArrow();
            this.updateHeaderBreadcrumbs();
            this.initHomeScrollDetection();
            console.log('✅ [ROUTER] Home: Solo actualización de header (sin recarga)');
        } else {
            // No hay contenido de home, cargar desde cero con efecto de carga
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
        
        // Actualizar header INMEDIATAMENTE al inicio
        // console.log('🔄 [ROUTER] Mikrotik: Actualizando header inmediatamente');
        window.DATA.headIndex = 2; // Índice para Mikrotik
        this.updateHeaderArrow();
        this.updateHeaderBreadcrumbs();
        
        // Cargar contenido HTML primero
        const loaded = await this.loadPageContent('mikrotik');
        if (loaded) {
            // Renderizar el contenido de mikrotik después de cargar la página
            setTimeout(async () => {
                try {
                    const { renderCategoryView } = await import('./modules/app.js');
                    renderCategoryView('Mikrotik');
                    
                    // Asegurar que el header se mantiene correcto después del renderizado
                    setTimeout(() => {
                        // console.log('🔄 [ROUTER] Re-verificando header post-renderizado');
                        window.DATA.headIndex = 2; // Re-confirmar
                        this.updateHeaderArrow();
                        this.updateHeaderBreadcrumbs();
                    }, 50);
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
        
        try {
            console.log('🔄 [ROUTER] Cargando página de cursos...');
            
            // Cargar el contenido HTML
            const response = await fetch('/assets/pages/cursos.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            const mainSection = document.querySelector('#main-section');
            
            if (mainSection) {
                mainSection.innerHTML = html;
                
                // Generar todo el contenido dinámicamente
                this.generateCursosContent();
                
                // Actualizar navegación
                this.updateHeaderArrow();
                this.updateHeaderBreadcrumbs();
                
                // Inicializar navegación por scroll después de que todo esté cargado
                setTimeout(() => {
                    this.initCursosScrollNavigation();
                }, 1500); // Dar tiempo adicional para que se generen todas las secciones
                
                console.log('✅ [ROUTER] Página de cursos cargada exitosamente');
            }
            
        } catch (error) {
            console.error('❌ [ROUTER] Error al cargar cursos:', error);
            this.handleError('Error al cargar la página de cursos');
        }
    }

    generateCursosContent() {
        const contentContainer = document.getElementById('cursos-content');
        if (!contentContainer) return;
        
        // Crear la estructura con secciones de Academias y Facultades
        contentContainer.innerHTML = `
            <div class="space-y-16">
                <!-- Page Header -->
                <div class="text-center space-y-4">
                    <h1 class="text-4xl font-bold text-gray-900">Todos los Cursos</h1>
                </div>
                
                <!-- Academias Section -->
                <div id="academias-section" class="rounded-2xl p-6 border border-gray-200">
                    <div class="text-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">Academias Especializadas</h2>
                        <p class="text-gray-700 text-lg">Cursos técnicos especializados en tecnologías específicas</p>
                    </div>
                    <div id="academias-content" class="space-y-8"></div>
                </div>
                
                <!-- Facultades Section -->
                <div id="facultades-section" class="rounded-2xl p-6 border border-gray-200">
                    <div class="text-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">Facultades Universitarias</h2>
                        <p class="text-gray-700 text-lg">Cursos profesionales organizados por áreas académicas tradicionales</p>
                    </div>
                    <div id="facultades-content" class="space-y-8"></div>
                </div>
            </div>
        `;
        
        // Luego cargar las categorías organizadas
        this.loadOrganizedCategories();
    }

    loadOrganizedCategories() {
        // Importar datos y funciones necesarias
        Promise.all([
            import('./data.js'),
            import('./modules/app.js')
        ]).then(([dataModule, appModule]) => {
            const { courses, getCoursesByCategory } = dataModule;
            const { renderCoursesGridByCategory } = appModule;
            
            // Definir categorías de academias y facultades
            const academiasCategories = ['Mikrotik'];
            const facultadesCategories = ['Ciencias de la Salud', 'Ingeniería', 'Ciencias Empresariales', 'Ciencias Jurídicas'];
            
            // Obtener todas las categorías únicas de los cursos
            const allCategories = [...new Set(courses.map(course => course.category))];
            console.log('📋 [ROUTER] Categorías encontradas:', allCategories);
            console.log('📋 [ROUTER] Total de cursos:', courses.length);
            
            // Separar categorías
            const academiasFound = allCategories.filter(cat => academiasCategories.includes(cat));
            const facultadesFound = allCategories.filter(cat => facultadesCategories.includes(cat));
            
            console.log('🎓 [ROUTER] Academias encontradas:', academiasFound);
            console.log('🏛️ [ROUTER] Facultades encontradas:', facultadesFound);
            
            // Renderizar Academias
            this.renderCategorySection('academias-content', academiasFound, getCoursesByCategory, renderCoursesGridByCategory, 'academia');
            
            // Renderizar Facultades
            this.renderCategorySection('facultades-content', facultadesFound, getCoursesByCategory, renderCoursesGridByCategory, 'facultad');
            
        }).catch(error => {
            console.error('❌ [ROUTER] Error al cargar categorías organizadas:', error);
            // Fallback al método anterior si falla
            this.generateCursosContentFallback();
        });
    }

    renderCategorySection(containerId, categories, getCoursesByCategoryFunc, renderFunction, sectionType) {
        const container = document.getElementById(containerId);
        if (!container || categories.length === 0) return;
        
        console.log(`🎨 [ROUTER] Renderizando sección ${sectionType} con categorías:`, categories);
        
        // Generar HTML para cada categoría sin estilos especiales
        let categoriesHTML = '';
        
        categories.forEach(category => {
            const categoryId = this.normalizeToId(category);
            const coursesInCategory = getCoursesByCategoryFunc(category);
            
            categoriesHTML += `
                <div id="${categoryId}-section" class="category-item bg-white rounded-xl p-6 border border-gray-200">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-bold text-gray-800">${category}</h3>
                        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            ${coursesInCategory.length} curso${coursesInCategory.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div id="${categoryId}-courses" class="mb-4"></div>
                </div>
            `;
        });
        
        container.innerHTML = categoriesHTML;
        
        // Renderizar cursos para cada categoría
        categories.forEach(category => {
            const categoryId = this.normalizeToId(category);
            const containerId = `${categoryId}-courses`;
            
            console.log(`🎨 [ROUTER] Renderizando categoría: ${category} en contenedor: ${containerId}`);
            this.renderCategoryUsingExistingFunction(category, containerId, renderFunction, getCoursesByCategoryFunc);
        });
        
        console.log(`✅ [ROUTER] Sección ${sectionType} renderizada con ${categories.length} categorías`);
    }

    renderCategoryUsingExistingFunction(categoryName, containerId, renderFunction, getCoursesByCategoryFunc) {
        console.log(`🎨 [ROUTER] Iniciando renderizado de categoría: "${categoryName}" en contenedor: "${containerId}"`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ [ROUTER] Contenedor no encontrado: ${containerId}`);
            return;
        }
        
        // Filtrar cursos por categoría usando la función importada
        const categoryCourses = getCoursesByCategoryFunc(categoryName);
        console.log(`📊 [ROUTER] Cursos encontrados para "${categoryName}":`, categoryCourses.length);
        
        if (categoryCourses.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">No hay cursos disponibles en esta categoría.</p>';
            console.log(`⚠️ [ROUTER] Sin cursos para categoría: ${categoryName}`);
            return;
        }
        
        // Crear grid adaptativo basado en el número de cursos
        let gridCols = 'md:grid-cols-2 lg:grid-cols-3';
        if (categoryCourses.length === 1) {
            gridCols = 'md:grid-cols-1 lg:grid-cols-1 max-w-2xl mx-auto';
        } else if (categoryCourses.length === 2) {
            gridCols = 'md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto';
        }
        
        // Crear un grid container con ID único para esta categoría
        const uniqueGridId = `courses-grid-${categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
        container.innerHTML = `<div id="${uniqueGridId}" class="grid ${gridCols} gap-8 justify-items-center"></div>`;
        console.log(`🔧 [ROUTER] Creado contenedor grid con ID: ${uniqueGridId}`);
        
        // Temporalmente cambiar el ID del container al esperado por la función
        const gridContainer = document.getElementById(uniqueGridId);
        if (gridContainer) {
            // Guardar el ID original
            const originalId = gridContainer.id;
            // Cambiar temporalmente al ID esperado
            gridContainer.id = 'courses-grid';
            console.log(`🔄 [ROUTER] ID cambiado temporalmente: ${originalId} → courses-grid`);
            
            try {
                // Usar la función importada para renderizar los cursos
                console.log(`⚙️ [ROUTER] Llamando renderFunction para: ${categoryName}`);
                renderFunction(categoryName);
                console.log(`✅ [ROUTER] Categoría ${categoryName} renderizada con ${categoryCourses.length} cursos`);
            } catch (error) {
                console.error(`❌ [ROUTER] Error renderizando ${categoryName}:`, error);
                // Fallback manual si la función falla
                console.log(`🔄 [ROUTER] Usando fallback manual para: ${categoryName}`);
                this.renderCoursesManually(gridContainer, categoryCourses);
            } finally {
                // Restaurar el ID único
                gridContainer.id = originalId;
                console.log(`🔄 [ROUTER] ID restaurado: courses-grid → ${originalId}`);
            }
        } else {
            console.error(`❌ [ROUTER] No se pudo encontrar el grid container: ${uniqueGridId}`);
        }
    }

    renderCoursesManually(container, courses) {
        if (!container) return;

        if (courses.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center col-span-full">No hay cursos disponibles en esta categoría.</p>';
            return;
        }

        // Crear un grid container si no existe
        let gridContainer = container.querySelector('.grid');
        if (!gridContainer) {
            gridContainer = document.createElement('div');

            // Grid adaptativo basado en el número de cursos
            let gridCols = 'md:grid-cols-2 lg:grid-cols-3';
            if (courses.length === 1) {
                gridCols = 'md:grid-cols-1 lg:grid-cols-1 max-w-2xl mx-auto';
            } else if (courses.length === 2) {
                gridCols = 'md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto';
            }

            gridContainer.className = `grid ${gridCols} gap-8 justify-items-center`;
            container.innerHTML = '';
            container.appendChild(gridContainer);
        }

        gridContainer.innerHTML = courses.map(course => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <div class="relative h-48 overflow-hidden">
                    <img src="${course.image || '/assets/images/cursos/default.jpg'}"
                         alt="${course.title}"
                         class="w-full h-full object-cover"
                         onerror="this.src='/assets/images/cursos/default.jpg'">
                    <div class="absolute top-2 right-2">
                        <span class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                            ${course.level || 'Intermedio'}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">${course.title}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${course.description}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            ${course.rating || '4.5'}
                        </span>
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            ${course.students || '0'} estudiantes
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600 text-sm">${course.duration || '8 semanas'}</span>
                        <button onclick="window.router.navigate('/curso?id=${course.id}')"
                                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                            Ver curso
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateCursosContentFallback() {
        const contentContainer = document.getElementById('cursos-content');
        if (!contentContainer) return;
        
        // Crear contenido mínimo en caso de error
        contentContainer.innerHTML = `
            <div class="text-center py-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Todos los Cursos</h1>
                <p class="text-gray-600">Error al cargar las categorías de cursos.</p>
            </div>
        `;
    }

    async loadFacultades() {
        updateState({ selectedCourse: null });
        window.DATA.name = "facultades";
        this.cleanupScrollDetection();
        
        // Verificar si ya estamos en la página home específicamente
        const currentContent = document.querySelector('#main-section main');
        const isAlreadyHome = currentContent && (
            currentContent.querySelector('#hero-section') || 
            currentContent.querySelector('#courses-section') ||
            currentContent.querySelector('#about-section')
        );
        
        if (isAlreadyHome) {
            // Ya tenemos contenido de home cargado, solo actualizar navegación
            this.updateHeaderArrow();
            this.updateHeaderBreadcrumbs();
            console.log('✅ [ROUTER] Facultades: Solo actualización de header (sin recarga)');
        } else {
            // No hay contenido de home, cargar desde cero
            this.loadHome();
        }
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
        
        const categoryMappings = {
            'ciencias-salud': 'Ciencias de la Salud',
            'ingenieria': 'Ingeniería',
            'ciencias-empresariales': 'Ciencias Empresariales',
            'ciencias-juridicas': 'Ciencias Jurídicas'
        };
        
        console.log(`📚 [ROUTER] Cargando Facultad de ${facultadNames[nombre]}`);
        
        const loaded = await this.loadPageContent(nombre);
        if (loaded) {
            // Renderizar el contenido de la facultad después de cargar la página
            setTimeout(async () => {
                try {
                    const { renderCategoryView } = await import('./modules/app.js');
                    renderCategoryView(facultadNames[nombre], categoryMappings[nombre]);
                } catch (error) {
                    console.error(`❌ [ROUTER] Error al renderizar facultad ${nombre}:`, error);
                }
            }, 100);
        }
    }

    async loadAcademia(nombre) {
        updateState({ selectedCourse: null });
        window.DATA.name = `academia-${nombre}`;
        this.cleanupScrollDetection();
        
        const academiaNames = {
            'mikrotik': 'Mikrotik',
            // 'huawei': 'Huawei' // Temporalmente oculto
        };
        
        console.log(`🎓 [ROUTER] Cargando Academia ${academiaNames[nombre]}`);
        // Por ahora, redirigir a la página principal
        this.loadHome();
    }

    async loadCursoFacultad(facultad, curso) {
        updateState({ selectedCourse: null });
        window.DATA.name = `facultad-${facultad}-curso-${curso}`;
        this.cleanupScrollDetection();
        
        const cursoNames = {
            'manejo-cadaveres': 'Curso de Manejo de Cadáveres',
            'primeros-auxilios': 'Curso de Primeros Auxilios',
            'excel-experto': 'Excel Experto',
            'tributacion-aplicada': 'Tributación Aplicada y Llenado de Formularios',
            'estrategias-litigacion': 'Estrategias de Litigación y Simulacros de Audiencias'
        };
        
        const facultadNames = {
            'ciencias-salud': 'Ciencias de la Salud',
            'ingenieria': 'Ingeniería',
            'ciencias-empresariales': 'Ciencias Empresariales',
            'ciencias-juridicas': 'Ciencias Jurídicas'
        };
        
        console.log(`📚 [ROUTER] Cargando ${cursoNames[curso]} de la Facultad de ${facultadNames[facultad]}`);
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
                // console.log('✅ [ROUTER] Contenido principal mostrado');
            }
            // También mostrar el contenedor principal directamente si no hay main
            if (this.mainSection.classList.contains('hidden')) {
                this.mainSection.classList.remove('hidden');
                console.log('✅ [ROUTER] Contenedor principal mostrado');
            }
        } else {
            console.error('❌ [ROUTER] Elemento #main-section NO encontrado en el DOM');
        }
    }

    // Función para inicializar la funcionalidad de dropdowns
    initDropdownFunctionality() {
        // console.log('🔽 [DROPDOWN] Inicializando funcionalidad de dropdowns');
        
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
        
        // console.log(`✅ [DROPDOWN] ${dropdownTriggers.length} dropdowns inicializados`);
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

    // Inicializar funcionalidad del menú móvil
    initMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileToggleSticky = document.getElementById('mobile-menu-toggle-sticky');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileContent = document.getElementById('mobile-menu-content');

        if (!mobileToggle || !mobileMenu || !mobileContent) {
            console.log('📱 [MOBILE-MENU] Elementos del menú móvil no encontrados');
            return;
        }

        // Función para abrir menú móvil dropdown
        const openMobileMenu = () => {
            mobileMenu.classList.add('active');
            mobileToggle.classList.add('active');
            if (mobileToggleSticky) mobileToggleSticky.classList.add('active');
            this.generateMobileMenuContent();
            console.log('📱 [MOBILE-MENU] Menú dropdown abierto');
        };

        // Función para cerrar menú móvil
        const closeMobileMenu = () => {
            mobileMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            if (mobileToggleSticky) mobileToggleSticky.classList.remove('active');
            console.log('📱 [MOBILE-MENU] Menú dropdown cerrado');
        };

        // Toggle del menú
        const toggleMobileMenu = () => {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        };

        // Event listeners
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Event listener para el botón sticky
        if (mobileToggleSticky) {
            mobileToggleSticky.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobileMenu();
            });
        }

        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', (e) => {
            const isToggleClick = mobileToggle.contains(e.target) || (mobileToggleSticky && mobileToggleSticky.contains(e.target));
            if (!mobileMenu.contains(e.target) && !isToggleClick) {
                if (mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });

        // Cerrar menú al presionar escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Cerrar menú cuando se navega
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.mobile-nav-link');
            if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
                setTimeout(() => closeMobileMenu(), 100);
            }
        });

        // Cerrar menú al cambiar el tamaño de ventana a desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 769 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // console.log('📱 [MOBILE-MENU] Funcionalidad dropdown inicializada');
    }

    // Generar contenido del menú móvil
    generateMobileMenuContent() {
        const mobileContent = document.getElementById('mobile-menu-content');
        if (!mobileContent) return;

        // Importar navLinks
        import('./data.js').then(module => {
            const { navLinks } = module;
            
            let mobileMenuHTML = '';

            // PRIMERO: Agregar las secciones de la página actual al inicio
            const currentPageSections = this.getCurrentPageSections();
            if (currentPageSections && currentPageSections.length > 0) {
                mobileMenuHTML += `<div class="mobile-nav-section">`;
                mobileMenuHTML += `<div class="mobile-nav-title">Navegación de Página</div>`;
                currentPageSections.forEach(section => {
                    mobileMenuHTML += `<a href="#${section.id}" class="mobile-nav-link">${section.name}</a>`;
                });
                mobileMenuHTML += `</div>`;
            }

            // SEGUNDO: Agregar las categorías principales
            navLinks.forEach((navItem, index) => {
                if (navItem.name === 'Cochabamba') {
                    // Enlace externo especial
                    mobileMenuHTML += `
                        <div class="mobile-nav-section">
                            <div class="mobile-nav-title">${navItem.name}</div>
                            <a href="/cochabamba" class="mobile-nav-link">
                                <i class="fas fa-external-link-alt mr-2"></i>
                                Visitar sitio web
                            </a>
                        </div>
                    `;
                    return;
                }

                mobileMenuHTML += `<div class="mobile-nav-section">`;
                
                // Título de la sección
                mobileMenuHTML += `<div class="mobile-nav-title">${navItem.name}</div>`;

                // Enlaces principales - mostrar para todas las categorías excepto Inicio
                if (navItem.href && navItem.href !== '/' && navItem.name !== 'Inicio') {
                    mobileMenuHTML += `<a href="${navItem.href}" class="mobile-nav-link">${navItem.name}</a>`;
                }

                // Para Inicio: solo mostrar enlace principal, NO las sections
                if (navItem.name === 'Inicio' && navItem.href) {
                    mobileMenuHTML += `<a href="${navItem.href}" class="mobile-nav-link">Ir al ${navItem.name}</a>`;
                }

                // Secciones (para páginas que NO sean Inicio)
                if (navItem.sections && navItem.sections.length > 0 && navItem.name !== 'Inicio') {
                    navItem.sections.forEach(section => {
                        mobileMenuHTML += `<a href="#${section.id}" class="mobile-nav-link">${section.name}</a>`;
                    });
                }

                // Navegación anidada
                if (navItem.navs && navItem.navs.length > 0) {
                    navItem.navs.forEach(navSubItem => {
                        if (navSubItem.submenu && navSubItem.submenu.length > 0) {
                            // Elemento con submenú - crear dropdown interactivo
                            const sectionId = `mobile-section-${index}-${navSubItem.name.toLowerCase().replace(/\s+/g, '-')}`;
                            
                            mobileMenuHTML += `
                                <div class="mobile-nav-section-header mobile-dropdown-trigger" data-target="${sectionId}">
                                    <span>${navSubItem.name}</span>
                                    <svg class="mobile-dropdown-arrow w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            `;
                            mobileMenuHTML += `<div id="${sectionId}" class="mobile-submenu mobile-dropdown-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">`;
                            
                            navSubItem.submenu.forEach(subItem => {
                                if (subItem.submenu && subItem.submenu.length > 0) {
                                    // Submenú anidado - crear dropdown anidado
                                    const subSectionId = `mobile-subsection-${index}-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`;
                                    
                                    mobileMenuHTML += `
                                        <div class="mobile-nav-subsection-header mobile-dropdown-trigger" data-target="${subSectionId}">
                                            <span>${subItem.name}</span>
                                            <svg class="mobile-dropdown-arrow w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    `;
                                    mobileMenuHTML += `<div id="${subSectionId}" class="mobile-submenu mobile-dropdown-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">`;
                                    subItem.submenu.forEach(nestedItem => {
                                        mobileMenuHTML += `<a href="${nestedItem.href}" class="mobile-nav-link">${nestedItem.name}</a>`;
                                    });
                                    mobileMenuHTML += `</div>`;
                                } else {
                                    mobileMenuHTML += `<a href="${subItem.href}" class="mobile-nav-link">${subItem.name}</a>`;
                                }
                            });
                            
                            mobileMenuHTML += `</div>`;
                        } else {
                            // Enlace simple
                            mobileMenuHTML += `<a href="${navSubItem.href}" class="mobile-nav-link">${navSubItem.name}</a>`;
                        }
                    });
                }

                mobileMenuHTML += `</div>`;
            });

            mobileContent.innerHTML = mobileMenuHTML;
            
            // Inicializar funcionalidad de dropdowns móviles
            this.initMobileDropdowns();
            
            console.log('📱 [MOBILE-MENU] Contenido generado con secciones dinámicas al inicio');
        }).catch(error => {
            console.error('❌ [MOBILE-MENU] Error generando contenido:', error);
        });
    }

    // Nueva función para obtener las secciones de la página actual
    getCurrentPageSections() {
        // Detectar qué tipo de página estamos viendo
        const currentPath = window.location.pathname;
        
        if (currentPath === '/' || currentPath === '/home') {
            // Para la página de inicio, detectar las secciones reales del DOM
            const homeSections = [];
            
            // Buscar secciones comunes de la página de inicio
            const sectionSelectors = [
                { id: 'hero', name: 'Inicio' },
                { id: 'featured-courses', name: 'Cursos Destacados' },
                { id: 'about', name: 'Acerca de' },
                { id: 'contact', name: 'Contacto' },
                { id: 'testimonials', name: 'Testimonios' }
            ];
            
            sectionSelectors.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    homeSections.push(section);
                }
            });
            
            return homeSections.length > 0 ? homeSections : null;
        }
        
        return null;
    }

    // Inicializar funcionalidad de dropdowns móviles
    initMobileDropdowns() {
        const triggers = document.querySelectorAll('.mobile-dropdown-trigger');
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = trigger.getAttribute('data-target');
                const content = document.getElementById(targetId);
                const arrow = trigger.querySelector('.mobile-dropdown-arrow');
                
                if (content && arrow) {
                    const isOpen = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
                    
                    if (isOpen) {
                        // Cerrar
                        content.style.maxHeight = '0px';
                        arrow.style.transform = 'rotate(0deg)';
                    } else {
                        // Abrir - calcular altura necesaria
                        content.style.maxHeight = 'none';
                        const height = content.scrollHeight;
                        content.style.maxHeight = '0px';
                        
                        // Forzar reflow y luego animar
                        requestAnimationFrame(() => {
                            content.style.maxHeight = `${height}px`;
                            arrow.style.transform = 'rotate(180deg)';
                        });
                    }
                }
            });
        });
        
        console.log(`📱 [MOBILE-DROPDOWNS] ${triggers.length} dropdowns móviles inicializados`);
    }

    // Método para navegación programática
    goTo(path) {
        this.navigate(path);
    }
    
    // Configurar event listeners adicionales para elementos dinámicos
    setupDynamicEventListeners() {
        console.log('🔧 [ROUTER] Configurando event listeners dinámicos');
        
        // Función que se ejecuta periódicamente para verificar nuevos elementos
        const checkForNewElements = () => {
            // Buscar todos los enlaces de sección que puedan haberse creado dinámicamente
            const sectionLinks = document.querySelectorAll('.upds-section-link, .upds-contact-link, a[href^="#"]');
            
            sectionLinks.forEach(link => {
                if (!link.hasAttribute('data-router-handled')) {
                    console.log('🆕 [ROUTER] Nuevo enlace de sección encontrado:', link.href, link.className);
                    link.setAttribute('data-router-handled', 'true');
                    
                    // FORZAR CLICKEABILIDAD
                    link.style.position = 'relative';
                    link.style.zIndex = '100';
                    link.style.pointerEvents = 'auto';
                    link.style.cursor = 'pointer';
                    
                    // Agregar event listener específico como respaldo
                    link.addEventListener('click', (e) => {
                        console.log('🔥 [ROUTER] Click directo en enlace de sección:', e.target.href);
                        // El event listener principal debería manejar esto, pero por si acaso
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const href = e.target.getAttribute('href');
                        let sectionId = '';
                        
                        if (href && href.startsWith('#')) {
                            sectionId = href.substring(1);
                        } else if (e.target.hasAttribute('data-section')) {
                            sectionId = e.target.getAttribute('data-section');
                        }
                        
                        if (sectionId) {
                            if (this.currentRoute !== '/' && this.currentRoute !== '/home') {
                                this.navigate('/');
                                setTimeout(() => {
                                    this.scrollToSection(sectionId);
                                }, 300);
                            } else {
                                this.scrollToSection(sectionId);
                            }
                        }
                    }, true);
                }
                
                // FORZAR CLICKEABILIDAD EN CADA CHEQUEO (por si el CSS se resetea)
                link.style.pointerEvents = 'auto';
                link.style.cursor = 'pointer';
            });
            
            // También asegurar que el contenedor sea clickeable
            const headerContact = document.querySelector('.upds-header-contact');
            if (headerContact) {
                headerContact.style.pointerEvents = 'auto';
                headerContact.style.position = 'relative';
                headerContact.style.zIndex = '99';
            }
        };
        
        // Ejecutar inmediatamente
        checkForNewElements();
        
        // Ejecutar cada vez que se modifica el DOM
        const observer = new MutationObserver(() => {
            checkForNewElements();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'href']
        });
        
        // Guardar referencia para cleanup
        this.dynamicObserver = observer;
        
        // Ejecutar chequeo periódico cada 2 segundos para mantener clickeabilidad
        this.clickabilityInterval = setInterval(() => {
            const sectionLinks = document.querySelectorAll('.upds-section-link, .upds-contact-link, a[href^="#"]');
            sectionLinks.forEach(link => {
                link.style.pointerEvents = 'auto';
                link.style.cursor = 'pointer';
            });
            
            const headerContact = document.querySelector('.upds-header-contact');
            if (headerContact) {
                headerContact.style.pointerEvents = 'auto';
            }
        }, 2000);
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