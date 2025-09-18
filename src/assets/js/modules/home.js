// Funciones auxiliares para renderizar vistas SPA

// Importaciones estáticas
import { academies, courses } from '../data.js';
import { createAcademyCard, createCourseCard, createCourseCardSkeleton } from '../components.js';

// Función para renderizar la vista principal (home) - Solo configuración dinámica
export function renderHomeView() {
    // console.log('🏠 [HOME] Configurando vista home');
    
    // El HTML ya está cargado desde home.html, solo configuramos la funcionalidad dinámica
    
    // 1. Cargar y mostrar academias dinámicamente
    const academiasSection = document.getElementById('academias-section');
    if (academiasSection) {
        loadAcademiasSection();
    }
    
    // 2. Cargar y mostrar cursos dinámicamente
    const coursesSection = document.getElementById('courses-section');
    if (coursesSection) {
        loadCoursesSection();
    }
    
    // 3. Configurar botones y eventos
    setupHomeEventListeners();
    
    // 4. Renderizar las academias en la grilla
    renderAcademiasGrid();
    
    // 5. Renderizar los cursos en la grilla
    renderCoursesGrid();
    
    // console.log('✅ [HOME] Vista home configurada');
}

// Funciones auxiliares para home
function loadAcademiasSection() {
    // console.log('🎓 [HOME] Cargando sección de academias');
    // La lógica para cargar academias dinámicamente se maneja en renderAcademiasGrid()
}

function loadCoursesSection() {
    // console.log('📚 [HOME] Cargando sección de cursos');
    // La lógica para cargar cursos dinámicamente se maneja en renderCoursesGrid()
}

function setupHomeEventListeners() {
    // console.log('🎧 [HOME] Configurando event listeners');
    
    // Ya no necesitamos configurar event listeners aquí porque ambos botones 
    // "Explorar cursos" y "Ver todos los cursos" ahora tienen onclick="exploreAllCourses()"
    // que los llevará directamente a /cursos
}

// Función para renderizar la grilla de academias
function renderAcademiasGrid() {
    // console.log('🎓 [ACADEMIAS] Renderizando grilla de academias');
    
    const academiasGrid = document.getElementById('academias-grid');
    
    if (academiasGrid && academies) {
        // Renderizar todas las academias
        const academiasHTML = academies.map(academy => createAcademyCard(academy)).join('');
        
        // Limpiar grilla y agregar todo el HTML de una vez
        academiasGrid.innerHTML = academiasHTML;
        
        // console.log(`✅ [ACADEMIAS] ${academies.length} academias renderizadas`);
    } else {
        console.error('❌ [ACADEMIAS] No se encontró academias-grid o academies data');
    }
}

// Función para renderizar la grilla de cursos
function renderCoursesGrid() {
    // console.log('📚 [COURSES] Renderizando grilla de cursos');
    
    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) {
        console.error('❌ [COURSES] No se encontró courses-grid');
        return;
    }
    
    // Mostrar skeletons mientras cargan los datos
    const skeletonsHTML = Array(3).fill(0).map(() => createCourseCardSkeleton()).join('');
    coursesGrid.innerHTML = skeletonsHTML;
    
    // Cargar datos reales
    if (courses) {
        // Renderizar cursos destacados específicos
        const featuredCourseIds = ['1', '4', '5']; // Curso Mikrotik MTCNA, Curso de Manejo de Cadáveres, Curso de Primeros Auxilios
        const featuredCourses = courses.filter(course => featuredCourseIds.includes(course.id));
        const coursesHTML = featuredCourses.map(course => createCourseCard(course)).join('');
        
        // Reemplazar skeletons con contenido real con un pequeño delay para evitar flash
        setTimeout(() => {
            coursesGrid.innerHTML = coursesHTML;
            // console.log(`✅ [COURSES] ${featuredCourses.length} cursos renderizados`);
        }, 200);
    } else {
        console.error('❌ [COURSES] No se encontraron datos de cursos');
        coursesGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-muted-foreground">Error al cargar los cursos</p>
            </div>
        `;
    }
}
