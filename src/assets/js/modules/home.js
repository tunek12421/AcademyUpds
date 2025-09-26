// Funciones auxiliares para renderizar vistas SPA

// Importaciones estáticas
import { academies, courses } from '../data.js';
import { createAcademyCard, createCourseCard, createCourseCardSkeleton } from '../components.js';

// Función para renderizar la vista principal (home) - Solo configuración dinámica
export async function renderHomeView() {
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

    // 4. Renderizar las academias en la grilla (ahora asíncrono)
    await renderAcademiasGrid();

    // 5. Renderizar los cursos en la grilla (ahora asíncrono)
    await renderCoursesGrid();

    // console.log('✅ [HOME] Vista home configurada');
}

// Funciones auxiliares para home
function loadAcademiasSection() {
    // console.log('🎓 [HOME] Cargando sección de academias');
    // La lógica para cargar academias dinámicamente se maneja en renderAcademiasGrid()
}

// Función específica para cargar academias desde el backend
async function fetchAcademiasFromBackend() {
    try {
        // console.log('🔄 [ACADEMIAS] Cargando academias desde backend...');

        // Endpoint del backend Go corriendo en puerto 8080 con timeout de 2 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 200); // 200ms - súper rápido

        const response = await fetch('http://localhost:8080/api/academies', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const academiasData = await response.json();

        // Transformar datos del backend para compatibilidad con frontend
        const transformedData = academiasData.map(academy => ({
            ...academy,
            coursesCount: academy.courses_count, // Mapear courses_count a coursesCount
            showCourseCount: academy.courses_count > 0 || !academy.disabled // Solo mostrar contador si hay cursos o está habilitada
        }));

        // Ordenar para mantener consistencia con el orden original (MIKROTIK primero, HUAWEI segundo)
        const orderedData = transformedData.sort((a, b) => {
            const order = { 'mikrotik': 1, 'huawei': 2 };
            return (order[a.id] || 999) - (order[b.id] || 999);
        });

        // console.log('✅ [ACADEMIAS] Academias cargadas desde backend:', orderedData);

        return orderedData;
    } catch (error) {
        console.error('❌ [ACADEMIAS] Error al cargar academias desde backend:', error);

        // Fallback: usar datos locales si el backend falla
        console.warn('🔄 [ACADEMIAS] Usando datos locales como fallback');
        return academies; // Importado desde data.js
    }
}

// Función específica para cargar cursos destacados desde el backend
async function fetchFeaturedCoursesFromBackend() {
    try {
        // console.log('🔄 [COURSES] Cargando cursos destacados desde backend...');

        // Endpoint del backend Go corriendo en puerto 8080 con timeout de 2 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 200); // 200ms - súper rápido

        const response = await fetch('http://localhost:8080/api/courses', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const coursesData = await response.json();

        // Filtrar solo los cursos destacados (mismos IDs que antes)
        const featuredCourseIds = ['1', '4', '5']; // Curso Mikrotik MTCNA, Curso de Manejo de Cadáveres, Curso de Primeros Auxilios
        const featuredCourses = coursesData.filter(course => featuredCourseIds.includes(course.id));

        // Transformar datos del backend para compatibilidad con frontend si es necesario
        const transformedCourses = featuredCourses.map(course => ({
            ...course,
            // Mapear campos si hay diferencias entre backend y frontend
            students: course.students || Math.floor(Math.random() * 500) + 100, // Simular estudiantes si no existe
            rating: course.rating || (4.5 + Math.random() * 0.5).toFixed(1), // Simular rating si no existe
            instructor: course.instructor?.name || course.instructor || 'Instructor no especificado',
            instructorBio: course.instructor?.description || 'Información no disponible',
            instructorImage: course.instructor?.image || '/assets/images/instructor/default.jpg'
        }));

        // Ordenar para mantener consistencia (orden específico de los destacados)
        const orderedCourses = transformedCourses.sort((a, b) => {
            const order = { '1': 1, '4': 2, '5': 3 }; // Mikrotik, Manejo de Cadáveres, Primeros Auxilios
            return (order[a.id] || 999) - (order[b.id] || 999);
        });

        // console.log('✅ [COURSES] Cursos destacados cargados desde backend:', orderedCourses);

        return orderedCourses;
    } catch (error) {
        console.error('❌ [COURSES] Error al cargar cursos desde backend:', error);

        // Fallback: usar datos locales si el backend falla
        console.warn('🔄 [COURSES] Usando datos locales como fallback');
        const featuredCourseIds = ['1', '4', '5'];
        return courses.filter(course => featuredCourseIds.includes(course.id));
    }
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

// Función para renderizar la grilla de academias (ahora asíncrona con backend)
async function renderAcademiasGrid() {
    // console.log('🎓 [ACADEMIAS] Renderizando grilla de academias');

    const academiasGrid = document.getElementById('academias-grid');

    if (!academiasGrid) {
        console.error('❌ [ACADEMIAS] No se encontró el elemento academias-grid');
        return;
    }

    try {
        // Mostrar estado de carga
        academiasGrid.innerHTML = `
            <div class="col-span-full flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span class="ml-3 text-muted-foreground">Cargando academias...</span>
            </div>
        `;

        // Cargar academias desde el backend
        const academiasData = await fetchAcademiasFromBackend();

        if (academiasData && academiasData.length > 0) {
            // Renderizar todas las academias
            const academiasHTML = academiasData.map(academy => createAcademyCard(academy)).join('');
            academiasGrid.innerHTML = academiasHTML;

            // console.log(`✅ [ACADEMIAS] ${academiasData.length} academias renderizadas desde backend`);
        } else {
            // No hay academias disponibles
            academiasGrid.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-muted-foreground">No hay academias disponibles en este momento</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ [ACADEMIAS] Error al renderizar academias:', error);

        // Mostrar estado de error
        academiasGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-red-500">Error al cargar las academias</p>
                <button onclick="renderAcademiasGrid()" class="mt-2 text-primary hover:text-primary/90 underline">
                    Intentar de nuevo
                </button>
            </div>
        `;
    }
}

// Función para renderizar la grilla de cursos (ahora asíncrona con backend)
async function renderCoursesGrid() {
    // console.log('📚 [COURSES] Renderizando grilla de cursos');

    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) {
        console.error('❌ [COURSES] No se encontró courses-grid');
        return;
    }

    try {
        // Mostrar skeletons mientras cargan los datos
        const skeletonsHTML = Array(3).fill(0).map(() => createCourseCardSkeleton()).join('');
        coursesGrid.innerHTML = skeletonsHTML;

        // Cargar cursos destacados desde el backend
        const featuredCourses = await fetchFeaturedCoursesFromBackend();

        if (featuredCourses && featuredCourses.length > 0) {
            // Renderizar cursos destacados
            const coursesHTML = featuredCourses.map(course => createCourseCard(course)).join('');

            // Reemplazar skeletons con contenido real con un pequeño delay para evitar flash
            setTimeout(() => {
                coursesGrid.innerHTML = coursesHTML;
                // console.log(`✅ [COURSES] ${featuredCourses.length} cursos destacados renderizados desde backend`);
            }, 200);
        } else {
            // No hay cursos disponibles
            setTimeout(() => {
                coursesGrid.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <p class="text-muted-foreground">No hay cursos destacados disponibles en este momento</p>
                    </div>
                `;
            }, 200);
        }
    } catch (error) {
        console.error('❌ [COURSES] Error al renderizar cursos:', error);

        // Mostrar estado de error
        setTimeout(() => {
            coursesGrid.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-red-500">Error al cargar los cursos destacados</p>
                    <button onclick="renderCoursesGrid()" class="mt-2 text-primary hover:text-primary/90 underline">
                        Intentar de nuevo
                    </button>
                </div>
            `;
        }, 200);
    }
}

// Exportar funciones para acceso global
export { renderAcademiasGrid, renderCoursesGrid };

// Hacer disponibles globalmente para los botones "Intentar de nuevo"
if (typeof window !== 'undefined') {
    window.renderAcademiasGrid = renderAcademiasGrid;
    window.renderCoursesGrid = renderCoursesGrid;
}
