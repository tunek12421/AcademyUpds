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
    createOtherCoursesCard
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
    const course = getCourseById(courseId);
    if (course) {
        updateState({ selectedCourse: course });
        renderCourseDetails();
    } else {
        console.error(`Curso ${courseId} no encontrado`);
    }
}

// Función para renderizar los detalles del curso
function renderCourseDetails() {
    const course = appState.selectedCourse;
    if (!course) {
        console.error('No hay curso seleccionado');
        return;
    }
    
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
    switchTab(appState.activeTab);
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
}

function login() {
    showNotification('Redirigiendo a la página de inicio de sesión...', 'info');
}

// Exportar funciones globales para uso en HTML
window.selectCourse = selectCourse;
// Función de inicialización principal
async function loadPageContent() {
    try {
        console.log('Iniciando carga de contenido...');
        
        // Cargar secciones HTML
        await loadAllSections();
        console.log('Secciones HTML cargadas');

        // Verificar si estamos en la vista de curso específico
        console.log('Verificando DATA:', window.DATA);
        
        if (typeof window.DATA !== 'undefined' && DATA.name === "course" && DATA.courseId) {
            console.log(`Buscando curso con ID: ${DATA.courseId}`);
            
            // Cargar curso específico
            const course = getCourseById(DATA.courseId.toString());
            console.log('Curso encontrado:', course);
            
            if (course) {
                updateState({ selectedCourse: course });
                console.log('Estado actualizado, renderizando curso...');
                renderCourseDetails();
            } else {
                console.error(`Curso con ID ${DATA.courseId} no encontrado`);
                // Fallback: mostrar el primer curso disponible
                const firstCourse = courses[0];
                if (firstCourse) {
                    console.log('Mostrando primer curso como fallback:', firstCourse);
                    updateState({ selectedCourse: firstCourse });
                    renderCourseDetails();
                } else {
                    showErrorMessage(`Curso con ID ${DATA.courseId} no encontrado`);
                }
            }
        } else {
            console.error('No se especificó un courseId válido en DATA');
            console.log('DATA disponible:', typeof window.DATA !== 'undefined' ? window.DATA : 'undefined');
            
            // Fallback: mostrar el primer curso disponible
            const firstCourse = courses[0];
            if (firstCourse) {
                console.log('Mostrando primer curso como fallback:', firstCourse);
                updateState({ selectedCourse: firstCourse });
                renderCourseDetails();
            } else {
                showErrorMessage('No se especificó un curso válido y no hay cursos disponibles');
            }
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
    renderCourseDetails,
    enrollInCourse,
    previewCourse,
    exploreAllCourses,
    login,
    handleImageError,
    loadPageContent
};
