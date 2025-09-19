// Importar dependencias
import { 
    courses, 
    getOtherCourses,
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

import { navigateTo } from '../router.js';

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
    // Usar navegación SPA en lugar de cambiar la URL
    try {
        navigateTo(`/curso?id=${courseId}`);
    } catch (error) {
        // Fallback si el router no está disponible
        window.location.href = `/curso.html?id=${courseId}`;
    }
}

// Función para renderizar la vista de categoría
export function renderCategoryView(categoryName = "Mikrotik", category = "Mikrotik") {
    // Obtener el contenedor principal
    const mainContainer = document.querySelector('main .space-y-8');
    if (!mainContainer) {
        console.error('No se encontró el contenedor principal');
        return;
    }
    
    // Limpiar contenido anterior
    mainContainer.innerHTML = '';
    
    // Descripción por categoría
    const descriptions = {
        'Mikrotik': 'En La Universidad Privada Domingo Savio, formamos a la próxima generación de expertos en Redes y Telecomunicaciones. Como Academia MikroTik certificada, te ofrecemos la oportunidad de aprender con instructores expertos, practicar con equipos reales y obtener la certificaciones internacionales que permitirán impulsar tu carrera profesional.',
        'Ciencias de la Salud': 'Cursos especializados en ciencias de la salud y medicina',
        'Ingeniería': 'Programas técnicos y de ingeniería para profesionales',
        'Ciencias Empresariales': 'Cursos de administración, contabilidad y gestión empresarial',
        'Ciencias Jurídicas': 'Formación especializada en derecho y ciencias jurídicas'
    };
    
    const images = {
        'Mikrotik': 'assets/images/cursos/mikro.png',
    }
    // Crear la estructura de la vista de categoría
    const categoryHTML = `
        <!-- Page Header -->
        <div class="text-center space-y-4">
            <h1 class="text-4xl font-bold tracking-tight">Academia ${categoryName}</h1>
            <div class="flex items-center gap-0 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                <div class="w-4/5 p-8">
                    <p class="text-justify text-base">
                        ${descriptions[category] || 'Descubre nuestros cursos especializados'}
                    </p>
                </div>
                <div class="flex-shrink-0 w-1/3 flex justify-center items-center bg-white h-full p-6">
                    <img src="${images[category] || 'assets/images/cursos/default.png'}" alt="${categoryName}" class="object-contain rounded-xl shadow w-full h-64 max-w-[260px]" />
                </div>
            </div>
        </div>
        
        <!-- Courses Grid -->
        <div id="courses-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Los cursos se cargarán dinámicamente aquí -->
        </div>
    `;
    
    mainContainer.innerHTML = categoryHTML;
    
    // Después de cargar el HTML, renderizar los cursos
    renderCoursesGridByCategory(category);
}

// Función para renderizar la grilla de cursos (solo para Mikrotik - legacy)
function renderCoursesGrid() {
    renderCoursesGridByCategory('Mikrotik');
}

// Función para renderizar la grilla de cursos por categoría
function renderCoursesGridByCategory(category) {
    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) return;
    
    // Filtrar cursos por categoría
    const categoryCourses = courses.filter(course => course.category === category);
    const coursesHTML = categoryCourses.map(course => createCourseCard(course)).join('');
    coursesGrid.innerHTML = coursesHTML;
    
    // console.log(`✅ [COURSES] ${categoryCourses.length} cursos de ${category} renderizados`);
}

// Función para renderizar los detalles del curso
export function renderCourseView(course) {
    console.log('📖 [COURSE] Iniciando renderizado de vista de curso:', course?.title);
    
    if (!course) {
        console.error('❌ [COURSE] No se proporcionó información del curso');
        return;
    }

   
    console.log('✅ [COURSE] Contenedor principal encontrado');

    // Renderizar componentes directamente con contenido
    renderCourseDetails(course);
}

function renderCourseDetails(course) {
    if (!course) return;
    
    // Obtener el contenedor principal
    const mainContainer = document.querySelector("main");
    console.log("container", mainContainer);
    if (!mainContainer) {
        console.error('No se encontró el contenedor principal');
        return;
    }
    
    // Crear la estructura del curso directamente con contenido
    try {
        console.log('🔨 [COURSE] Construyendo HTML del curso...');
        
        const courseHTML = `
            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <div id="course-main-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createCourseDetails(course)}
                    </div>
                    ${course.instructor?`<div id="instructor-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createInstructorCard(course)}
                    </div>`: ""}

                    ${course.modules?`<div id="course-content-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createCourseContentCard(course)}
                    </div>`: ""}

                    ${course.skills?`<div id="skills-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createSkillsCard(course)}
                    </div>`: ""}

                    ${course.prerequisites ? `<div id="prerequisites-card" class="rounded-lg border bg-card text-card-foreground shadow-sm">
                        ${createPrerequisitesCard(course)}
                    </div>` : ''}

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
        
        console.log('✅ [COURSE] Insertando HTML completo...');
        mainContainer.innerHTML = courseHTML;
        
        console.log('🎉 [COURSE] Renderizado completado exitosamente');
    } catch (error) {
        console.error('❌ [COURSE] Error al renderizar curso:', error);
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

// Función para navegación a academias
function navigateToAcademy(academyId) {
    console.log(`🎓 [NAVIGATION] Navegando a academia: ${academyId}`);
    
    if (academyId === 'mikrotik') {
        // Redirigir a la vista de mikrotik usando el router
        try {
            navigateTo('/mikrotik');
        } catch (error) {
            // Fallback si el router no está disponible
            window.location.href = '/mikrotik.html';
        }
    } else if (academyId === 'huawei') {
        // Por ahora HUAWEI no redirige a ninguna vista
        showNotification('La academia Huawei estará disponible próximamente', 'info');
    }
}

// Funciones para navegación (placeholders)
function exploreAllCourses() {
    try {
        navigateTo('/cursos');
        // Scroll al inicio de la página
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    } catch (error) {
        // Fallback si el router no está disponible
        window.location.href = '/cursos';
        // Scroll al inicio también en el fallback
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }
}

function login() {
    showNotification('Redirigiendo a la página de inicio de sesión...', 'info');
}

// Exportar funciones globales para uso en HTML
window.selectCourse = selectCourse;
window.navigateToAcademy = navigateToAcademy;
window.exploreAllCourses = exploreAllCourses;
window.enrollInCourse = enrollInCourse;
window.previewCourse = previewCourse;
window.login = login;
// Función de inicialización principal
async function loadPageContent() {
    try {        
        // Configurar event listeners
        setupEventListeners();
        
        
    } catch (error) {
        console.error('❌ [APP] Error en loadPageContent:', error);
        showErrorMessage('Error al cargar la aplicación: ' + error.message);
        throw error; // Re-lanzar para que main() lo capture
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
    enrollInCourse,
    previewCourse,
    exploreAllCourses,
    login,
    handleImageError,
    loadPageContent,
    renderCoursesGridByCategory
};
