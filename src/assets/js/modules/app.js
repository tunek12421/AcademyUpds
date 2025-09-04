// Importar dependencias
import { 
    courses, 
    updateState, 
    getState,
    appState,
    getCourseById, 
    getCoursesByCategory,
    getOtherCourses,
    loadAllSections 
} from '../data.js';

import {
    createCourseCard,
    createCourseDetails,
    createInstructorCard,
    createCourseContentCard,
    createSkillsCard,
    createPricingCard,
    createOtherCoursesCard,
    createPrerequisitesCard,
    createFAQCard
} from '../components.js';

// Aplicación principal - Manejo de estado y eventos

// Función para mostrar mensajes de error
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-red-500 hover:text-red-700">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto-remover después de 10 segundos
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 10000);
}

// Función para seleccionar curso
function selectCourse(courseId) {
    // Redirigir a la página de detalles del curso
    window.location.href = `/curso.html?id=${courseId}`;
}

// Función para renderizar la vista de categoría
function renderCategoryView(categoryName = "Microtik") {
    // Obtener el contenedor principal
    const mainContainer = document.querySelector('main .space-y-8');
    if (!mainContainer) {
        console.error('No se encontró el contenedor principal');
        return;
    }
    
    // Limpiar contenido anterior
    mainContainer.innerHTML = '';
    
    // Crear la estructura de la vista de categoría
    const categoryHTML = `
        <!-- Page Header -->
        <div class="text-center space-y-4">
            <h1 class="text-4xl font-bold tracking-tight">Cursos de ${categoryName}</h1>
            <p class="text-xl text-muted-foreground">Descubre nuestros cursos especializados en networking y administración de redes</p>
        </div>
        
        <!-- Courses Grid -->
        <div id="courses-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Los cursos se cargarán dinámicamente aquí -->
        </div>
    `;
    
    mainContainer.innerHTML = categoryHTML;
    
    // Después de cargar el HTML, renderizar los cursos
    renderCoursesGrid();
}

// Función para renderizar la grilla de cursos
function renderCoursesGrid() {
    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) return;
    
    const coursesHTML = courses.map(course => createCourseCard(course)).join('');
    coursesGrid.innerHTML = coursesHTML;
}

// Función para renderizar la vista principal (home)
function renderHomeView() {
    // Obtener el contenedor principal
    const mainContainer = document.querySelector('main .space-y-8');
    if (!mainContainer) {
        console.error('No se encontró el contenedor principal');
        return;
    }
    
    // Limpiar contenido anterior
    mainContainer.innerHTML = '';
    
    // Crear la estructura de la vista home
    const homeHTML = `
        <!-- Hero Section -->
        <div class="relative rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1739956802238-2f37aefec7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGFjYWRlbXl8ZW58MXx8fHwxNzU1ODEyMDU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                 alt="Academia online" class="w-full h-96 object-cover" 
                 onerror="this.src='https://via.placeholder.com/1080x384/e5e7eb/6b7280?text=Academia+Online'">
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div class="text-center text-white max-w-2xl px-4">
                    <h2 class="text-4xl font-bold mb-4">Transforma tu carrera con UPDS</h2>
                    <p class="text-lg mb-6 opacity-90">
                        Aprende las habilidades más demandadas del mercado tecnológico con instructores expertos 
                        y proyectos reales que impulsan tu crecimiento profesional.
                    </p>
                    <button onclick="exploreAllCourses()" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-primary-foreground hover:bg-primary/90 h-11 px-8" style="background: var(--color-primary);">
                        Explorar cursos
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4" style="display: none;">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6 text-center">
                    <svg class="h-8 w-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 class="text-2xl font-bold">2,895</h3>
                    <p class="text-muted-foreground">Estudiantes activos</p>
                </div>
            </div>
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6 text-center">
                    <svg class="h-8 w-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                    </svg>
                    <h3 class="text-2xl font-bold">24</h3>
                    <p class="text-muted-foreground">Cursos disponibles</p>
                </div>
            </div>
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6 text-center">
                    <svg class="h-8 w-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                    <h3 class="text-2xl font-bold">95%</h3>
                    <p class="text-muted-foreground">Tasa de satisfacción</p>
                </div>
            </div>
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6 text-center">
                    <svg class="h-8 w-8 mx-auto mb-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="m3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <h3 class="text-2xl font-bold">4.8</h3>
                    <p class="text-muted-foreground">Puntuación promedio</p>
                </div>
            </div>
        </div>

        <!-- Featured Courses -->
        <div>
            <h3 class="text-3xl font-bold mb-6">Cursos destacados</h3>
            <div id="courses-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Los cursos se cargarán dinámicamente -->
            </div>
        </div>

        <!-- About Section -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-8">
                <div class="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 class="text-3xl font-bold mb-4">¿Por qué elegir UPDS?</h3>
                        <div class="space-y-4">
                            <div class="flex items-start gap-3">
                                <svg class="h-5 w-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                </svg>
                                <div>
                                    <h4 class="font-medium mb-1">Instructores expertos</h4>
                                    <p class="text-muted-foreground">
                                        Aprende de profesionales con años de experiencia en la industria
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <svg class="h-5 w-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                                </svg>
                                <div>
                                    <h4 class="font-medium mb-1">Proyectos reales</h4>
                                    <p class="text-muted-foreground">
                                        Desarrolla un portfolio con proyectos que demuestren tus habilidades
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <svg class="h-5 w-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <div>
                                    <h4 class="font-medium mb-1">Comunidad activa</h4>
                                    <p class="text-muted-foreground">
                                        Conecta con otros estudiantes y profesionales del sector
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-muted rounded-lg p-6 text-center">
                        <h4 class="font-medium mb-2">¡Empieza hoy mismo!</h4>
                        <p class="text-muted-foreground mb-4">
                            Únete a miles de estudiantes que ya están transformando su carrera
                        </p>
                        <button onclick="exploreAllCourses()" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out <!-- En lugar de transition-colors --> focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 group" style="background: var(--color-primary);">
                            Ver todos los cursos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    mainContainer.innerHTML = homeHTML;
    // Después de cargar el HTML, renderizar los cursos
    renderCoursesGrid();
}

// Función para renderizar los detalles del curso
function renderCourseDetails() {
    const course = appState.selectedCourse;
    if (!course)return;
    
    // Obtener el contenedor principal
    const mainContainer = document.querySelector('main .space-y-8');
    if (!mainContainer) {
        console.error('No se encontró el contenedor principal');
        return;
    }
    
    // Limpiar contenido anterior
    mainContainer.innerHTML = '';
    
    // Crear la estructura del curso
    try {
        const courseHTML = `
            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <div id="course-main-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createCourseDetails(course)}
                    </div>

                    <!-- Instructor Card -->
                    <div id="instructor-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createInstructorCard(course)}
                    </div>

                    <!-- Course Content -->
                    <div id="course-content-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createCourseContentCard(course)}
                    </div>

                    <!-- Skills -->
                    <div id="skills-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createSkillsCard(course)}
                    </div>

                    <!-- Prerequisites -->
                    ${course.prerequisites ? `<div id="prerequisites-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createPrerequisitesCard(course)}
                    </div>` : ''}

                    <!-- FAQ -->
                    ${course.faq ? `<div id="faq-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createFAQCard(course)}
                    </div>` : ''}
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <div id="pricing-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createPricingCard(course)}
                    </div>

                    <div id="other-courses-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createOtherCoursesCard(getOtherCourses())}
                    </div>
                </div>
            </div>
        `;
        
        mainContainer.innerHTML = courseHTML;
    } catch (error) {
        console.error('Error al renderizar curso:', error);
        mainContainer.innerHTML = `
            <div class="text-center py-8">
                <h2 class="text-2xl font-bold mb-4">Error al cargar el curso</h2>
                <p class="text-muted-foreground">Hubo un problema al cargar los detalles del curso.</p>
                <p class="text-sm text-muted-foreground mt-2">Curso ID: ${course.id}</p>
            </div>
        `;
    }
}

// Función de inicialización
function initializeApp() {
    // Configurar event listeners para los tabs
    const tabGeneral = document.getElementById('tab-general');
    const tabCurso = document.getElementById('tab-curso');
    
    if (tabGeneral) {
        tabGeneral.addEventListener('click', () => switchTab('general'));
    }
    
    if (tabCurso) {
        tabCurso.addEventListener('click', () => switchTab('curso'));
    }
    
    // Renderizar contenido inicial
    renderCoursesGrid();
    renderCourseDetails();
    
    // Configurar tab inicial
    //switchTab(appState.activeTab);
}

// Event listeners para cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

// Función global para manejar errores de imágenes
function handleImageError(img) {
    const fallbackSrc = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=' + encodeURIComponent(img.alt || 'Imagen no disponible');
    img.src = fallbackSrc;
}

// Funciones auxiliares para interacciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para simular inscripción a curso
function enrollInCourse() {
    showNotification('¡Te has inscrito exitosamente al curso!', 'success');
}

// Función para vista previa
function previewCourse() {
    showNotification('Iniciando vista previa del curso...', 'info');
}

// Funciones para navegación (placeholders)
function exploreAllCourses() {
    showNotification('Mostrando todos los cursos disponibles...', 'info');
    window.location.href = '/mikrotik.html';
}

function login() {
    showNotification('Redirigiendo a la página de inicio de sesión...', 'info');
}

// Exportar funciones globales para uso en HTML
window.selectCourse = selectCourse;
window.exploreAllCourses = exploreAllCourses;
window.enrollInCourse = enrollInCourse;
window.previewCourse = previewCourse;
window.login = login;
// Función de inicialización principal
async function loadPageContent() {
    try {
        console.log('Iniciando carga de contenido...');
        
        // Cargar secciones HTML
        await loadAllSections();
        console.log('Secciones HTML cargadas');

        // Verificar si estamos en la vista de curso específico
        console.log('Verificando DATA:', window.DATA);
        switch (DATA.name) {
            case "home":
                console.log('Renderizando vista principal (home)');
                renderHomeView();
                break;
            case "category":
                console.log('Renderizando vista de categoría');
                renderCategoryView();
                break;
            case "course":
                let courseId = new URLSearchParams(window.location.search).get('id')||1;
                console.log(`Buscando curso con ID: ${courseId}`);
                const course = getCourseById(courseId);
                console.log('Curso encontrado:', course);
                if (course) {
                    updateState({ selectedCourse: course });
                    console.log('Estado actualizado, renderizando curso...');
                    renderCourseDetails();
                } else {
                    console.error(`Curso con ID ${courseId} no encontrado`);
                    const firstCourse = courses[0];
                    if (firstCourse) {
                        console.log('Mostrando primer curso como fallback:', firstCourse);
                        updateState({ selectedCourse: firstCourse });
                        renderCourseDetails();
                    } else {
                        showErrorMessage(`Curso con ID ${courseId} no encontrado`);
                    }
                }
                break;
            default: 
                renderHomeView();
                break;
        }
        // Configurar event listeners
        setupEventListeners();
        console.log('Event listeners configurados');
        
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showErrorMessage('Error al cargar la aplicación: ' + error.message);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para botones de cursos (se añaden dinámicamente)
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-course-id]')) {
            const courseId = e.target.getAttribute('data-course-id');
            selectCourse(courseId);
        }
    });
}

// Exportar funciones principales
export {
    selectCourse,
    renderCoursesGrid,
    renderCategoryView,
    renderHomeView,
    renderCourseDetails,
    enrollInCourse,
    previewCourse,
    exploreAllCourses,
    login,
    handleImageError,
    loadPageContent
};
