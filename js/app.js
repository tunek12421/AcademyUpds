// Aplicación principal - Manejo de estado y eventos

// Función para cambiar de tab
function switchTab(tabName) {
    // Actualizar estado
    updateState({ activeTab: tabName });
    
    // Actualizar UI de tabs
    const tabs = document.querySelectorAll('.tab-trigger');
    tabs.forEach(tab => {
        if (tab.id === `tab-${tabName}`) {
            tab.classList.add('bg-background', 'text-foreground', 'shadow-sm');
            tab.classList.remove('text-muted-foreground');
            tab.setAttribute('data-state', 'active');
        } else {
            tab.classList.remove('bg-background', 'text-foreground', 'shadow-sm');
            tab.classList.add('text-muted-foreground');
            tab.setAttribute('data-state', 'inactive');
        }
    });
    
    // Mostrar/ocultar contenido
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        if (content.id === `content-${tabName}`) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
}

// Función para seleccionar curso
function selectCourse(courseId) {
    const course = getCourseById(courseId);
    if (course) {
        updateState({ selectedCourse: course, activeTab: 'curso' });
        switchTab('curso');
        renderCourseDetails();
    }
}

// Función para renderizar la grilla de cursos
function renderCoursesGrid() {
    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) return;
    
    const coursesHTML = courses.map(course => createCourseCard(course)).join('');
    coursesGrid.innerHTML = coursesHTML;
}

// Función para renderizar los detalles del curso
function renderCourseDetails() {
    const course = appState.selectedCourse;
    if (!course) return;
    
    // Renderizar tarjeta principal del curso
    const courseMainCard = document.getElementById('course-main-card');
    if (courseMainCard) {
        courseMainCard.innerHTML = createCourseDetails(course);
    }
    
    // Renderizar tarjeta del instructor
    const instructorCard = document.getElementById('instructor-card');
    if (instructorCard) {
        instructorCard.innerHTML = createInstructorCard(course);
    }
    
    // Renderizar contenido del curso
    const courseContentCard = document.getElementById('course-content-card');
    if (courseContentCard) {
        courseContentCard.innerHTML = createCourseContentCard(course);
    }
    
    // Renderizar habilidades
    const skillsCard = document.getElementById('skills-card');
    if (skillsCard) {
        skillsCard.innerHTML = createSkillsCard(course);
    }
    
    // Renderizar tarjeta de precio
    const pricingCard = document.getElementById('pricing-card');
    if (pricingCard) {
        pricingCard.innerHTML = createPricingCard(course);
    }
    
    // Renderizar otros cursos
    const otherCoursesCard = document.getElementById('other-courses-card');
    if (otherCoursesCard) {
        otherCoursesCard.innerHTML = createOtherCoursesCard();
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
    
    console.log('TechAcademy app initialized successfully!');
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
window.switchTab = switchTab;
window.enrollInCourse = enrollInCourse;
window.previewCourse = previewCourse;
window.exploreAllCourses = exploreAllCourses;
window.login = login;
window.handleImageError = handleImageError;