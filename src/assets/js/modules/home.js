// Funciones auxiliares para renderizar vistas SPA

// Función para renderizar la vista principal (home) - Solo configuración dinámica
export function renderHomeView() {
    console.log('🏠 [HOME] Configurando vista home');
    
    // El HTML ya está cargado desde home.html, solo configuramos la funcionalidad dinámica
    
    // 1. Cargar y mostrar cursos dinámicamente
    const coursesSection = document.getElementById('courses-section');
    if (coursesSection) {
        loadCoursesSection();
    }
    
    // 2. Configurar botones y eventos
    setupHomeEventListeners();
    
    // 4. Renderizar los cursos en la grilla
    renderCoursesGrid();
    
    console.log('✅ [HOME] Vista home configurada');
}

// Funciones auxiliares para home
function loadCoursesSection() {
    console.log('📚 [HOME] Cargando sección de cursos');
    // La lógica para cargar cursos dinámicamente se maneja en renderCoursesGrid()
}

function setupHomeEventListeners() {
    console.log('🎧 [HOME] Configurando event listeners');
    
    // Configurar todos los botones "Explorar cursos" en el hero
    // Usar un selector válido y buscar por contenido de texto
    const allButtons = document.querySelectorAll('button');
    const exploreButtons = Array.from(allButtons).filter(button => 
        button.textContent.includes('Explorar') || 
        button.getAttribute('onclick')?.includes('exploreAllCourses')
    );
    
    exploreButtons.forEach(button => {
        // Remover el onclick inline
        button.removeAttribute('onclick');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Scroll hacia la sección de cursos
            const coursesSection = document.getElementById('courses-section');
            if (coursesSection) {
                coursesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Función para renderizar la grilla de cursos
function renderCoursesGrid() {
    console.log('📚 [COURSES] Renderizando grilla de cursos');
    
    import('../data.js').then(module => {
        const { courses } = module;
        const coursesGrid = document.getElementById('courses-grid');
        
        if (coursesGrid && courses) {
            // Importar función para crear tarjetas de cursos
            import('../components.js').then(componentsModule => {
                const { createCourseCard } = componentsModule;
                
                // Renderizar cursos destacados (primeros 6)
                const featuredCourses = courses.slice(0, 6);
                const coursesHTML = featuredCourses.map(course => createCourseCard(course)).join('');
                
                // Limpiar grilla y agregar todo el HTML de una vez
                coursesGrid.innerHTML = coursesHTML;
                
                console.log(`✅ [COURSES] ${featuredCourses.length} cursos renderizados`);
            }).catch(error => {
                console.error('❌ [COURSES] Error al importar components:', error);
            });
        } else {
            console.error('❌ [COURSES] No se encontró courses-grid o courses data');
        }
    }).catch(error => {
        console.error('❌ [COURSES] Error al importar data:', error);
    });
}
