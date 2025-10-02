// Componentes reutilizables para generar HTML

// Componente para generar estrella llena
function createStarIcon(filled = true) {
    if (filled) {
        return `<svg class="h-4 w-4 fill-yellow-400 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="m3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>`;
    }
    return `<svg class="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="m3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>`;
}

// Componente para icono de reloj
function createClockIcon() {
    return `<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`;
}

// Componente para icono de chevron right
function createChevronRightIcon() {
    return `<svg class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>`;
}

// Componente Badge
function createBadge(text, variant = 'default') {
    const variants = {
        default: 'text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    };
    
    return `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}" ${variant === 'default' ? 'style="background: var(--color-primary);"' : ''}>${text}</span>`;
}

// Componente para skeleton de tarjeta de curso
function createCourseCardSkeleton() {
    return `
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
            <div class="p-0">
                <div class="relative overflow-hidden rounded-t-lg">
                    <div class="w-full h-48 bg-gray-200"></div>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-16 h-4 bg-gray-200 rounded"></div>
                    <div class="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
                <div class="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                <div class="w-full h-4 bg-gray-200 rounded mb-2"></div>
                <div class="w-2/3 h-4 bg-gray-200 rounded mb-4"></div>
                <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-4 bg-gray-200 rounded"></div>
                        <div class="w-20 h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div class="w-full h-10 bg-gray-200 rounded"></div>
                </div>
                <div class="mt-4 pt-4 border-t">
                    <div class="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    `;
}

// Componente para imagen con fallback y skeleton loader
function createImageWithFallback(src, alt, className = '') {
    const fallbackSrc = '' + encodeURIComponent(alt);
    return `<div class="relative ${className}">
        <div class="absolute inset-0 bg-gray-200 animate-pulse rounded" id="skeleton-${Math.random().toString(36).substr(2, 9)}"></div>
        <img src="${src}" alt="${alt}" class="${className}" 
             onerror="this.src='${fallbackSrc}'" 
             onload="this.previousElementSibling.style.display='none'">
    </div>`;
}

// Componente Button
function createButton(text, variant = 'default', size = 'default', onClick = '', additionalClasses = '') {
    const variants = {
        default: 'text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    };
    
    const sizes = {
        default: 'h-10 py-2 px-4',
        lg: 'h-11 px-8'
    };
    
    const onClickAttr = onClick ? `onclick="${onClick}"` : '';
    
    return `<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${variants[variant]} ${sizes[size]} ${additionalClasses}" style="background: var(--color-primary);" ${onClickAttr}>
        ${text}
    </button>`;
}

// Componente para tarjeta de curso
function createCourseCard(course) {
    return `
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm group cursor-pointer hover:shadow-lg transition-shadow">
            <div class="p-0">
                <div class="relative overflow-hidden rounded-t-lg">
                    ${createImageWithFallback(course.image, course.title, 'w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300')}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-2">${course.title}</h3>
                <p class="text-muted-foreground mb-4 line-clamp-2">
                    ${course.description}
                </p>
                <div class="flex flex-col gap-3 justify-between">
                    ${createButton(`Ver detalles ${createChevronRightIcon()}`, 'default', 'default', `selectCourse('${course.id}')`, 'group')}
                </div>

            </div>
        </div>
    `;
}

// Componente para detalles del curso
function createCourseDetails(course) {
    return `
        <div class="p-0 mb-4">
            <div class="relative overflow-hidden rounded-lg mb-4">
                ${createImageWithFallback(course.image, course.title, 'w-full h-[28rem] max-h-[28rem] object-cover')}
            </div>
        </div>
        <div class="px-6 pb-2">
            <h2 class="text-2xl font-bold mb-2">${course.title}</h2>
            <p class="text-base text-muted-foreground mb-3">
                ${course.description}
            </p>
        </div>
    `;
}

// Componente para instructor
function createInstructorCard(course) {
    // Soportar tanto el formato antiguo (instructor singular) como el nuevo (instructors array)
    const hasMultipleInstructors = course.instructors && Array.isArray(course.instructors);
    const instructorTitle = hasMultipleInstructors && course.instructors.length > 1 ? 'Instructores' : 'Instructor';

    if (hasMultipleInstructors) {
        // Nuevo formato con array de instructores
        const instructorsHTML = course.instructors.map(instructor => `
            <div class="flex items-start gap-4 mb-6 last:mb-0">
                ${createImageWithFallback(instructor.image, instructor.name, 'aspect-square w-24 h-24 rounded-lg object-cover')}
                <div>
                    <h4 class="font-medium mb-2">${instructor.name}</h4>
                    <p class="text-muted-foreground text-sm mb-2">${instructor.bio}</p>
                    ${instructor.orcid ? `<a href="${instructor.orcid}" target="_blank" class="text-primary hover:underline text-sm">ORCID: ${instructor.orcid}</a>` : ''}
                </div>
            </div>
        `).join('');

        return `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">${instructorTitle}</h3>
            </div>
            <div class="px-6 pb-6">
                ${instructorsHTML}
            </div>
        `;
    } else {
        // Formato antiguo con instructor singular
        return `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Instructor</h3>
            </div>
            <div class="px-6 pb-6">
                <div class="flex items-start gap-4">
                    ${createImageWithFallback(course.instructorImage, course.instructor, 'aspect-square w-24 h-24 rounded-lg object-cover')}
                    <div>
                        <h4 class="font-medium mb-2">${course.instructor}</h4>
                        <p class="text-muted-foreground">${course.instructorBio}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Componente para contenido del curso
function createCourseContentCard(course) {
    const modulesHTML = course.modules.map((module, index) => {
        // Verificar si module es un string o un objeto
        const moduleTitle = typeof module === 'string' ? `Unidad ${index + 1}` : module.title;
        const moduleContent = typeof module === 'string' ? module : module.content;
        
        return `
        <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <button 
                class="module-header w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50" 
                onclick="toggleModule(${index})"
            >
                <div class="flex items-center gap-3">
                    <span class="flex items-center justify-center aspect-square w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        ${index + 1}
                    </span>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${moduleTitle}</h4>
                    </div>
                </div>
                <svg 
                    id="module-icon-${index}" 
                    class="module-icon h-5 w-5 text-gray-500 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div id="module-content-${index}" class="module-content hidden">
                <div class="module-content-inner px-4 py-4 border-t">
                    <p class="text-gray-700 leading-relaxed mb-4">${moduleContent}</p>
                    <div class="flex items-center gap-6 text-sm" style="display: none;">
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                            <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-blue-700 font-medium">Video lecciones</span>
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                            <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span class="text-green-700 font-medium">Material de apoyo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4">Contenido del curso</h3>
        </div>
        <div class="px-6 pb-6">
            <div class="space-y-3">
                ${modulesHTML}
            </div>
        </div>
    `;
}

// Componente para habilidades
function createSkillsCard(course) {
    const skillsHTML = course.skills.map(skill => 
        createBadge(skill, 'outline')
    ).join('');

    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4">Habilidades que desarrollarás</h3>
        </div>
        <div class="px-6 pb-6">
            <div class="flex flex-wrap gap-2">
                ${skillsHTML}
            </div>
        </div>
    `;
}

// Componente para tarjeta de inscripción
function createPricingCard(course) {
    return `
        <div class="p-6">
            <div class="text-center mb-6">
                <h3 class="text-xl font-bold mb-2">Inscríbete al curso</h3>
                <p class="text-muted-foreground">Acceso de por vida</p>
            </div>
            ${createButton('Inscribirme ahora', 'default', 'lg', '', 'w-full')}
        </div>
    `;
}

// Componente para otros cursos
function createOtherCoursesCard(otherCourses = []) {
    if (!otherCourses || otherCourses.length === 0) {
        return `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Otros cursos</h3>
                <p class="text-muted-foreground">No hay otros cursos disponibles.</p>
            </div>
        `;
    }
    const coursesHTML = otherCourses.map(course => `
        <div class="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" onclick="selectCourse('${course.id}')">
            ${createImageWithFallback(course.image, course.title, 'w-16 h-12 object-cover rounded')}
            <div class="flex-1 min-w-0">
                <h4 class="font-medium text-sm truncate">${course.title}</h4>
                ${course.instructor ? `<p class="text-muted-foreground text-xs">${course.instructor}</p>` : ''}
            </div>
        </div>
    `).join('');

    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4">Otros cursos</h3>
        </div>
        <div class="px-6 pb-6">
            <div class="space-y-4">
                ${coursesHTML}
            </div>
        </div>
    `;
}

// Componente para conocimientos esenciales
function createPrerequisitesCard(course) {
    const topicsHTML = course.prerequisites.topics.map(topic => `
        <li class="flex items-center gap-2">
            <svg class="h-4 w-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${topic}</span>
        </li>
    `).join('');

    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4">${course.prerequisites.title}</h3>
            <p class="text-muted-foreground mb-4">${course.prerequisites.description}</p>
            <ul class="space-y-2">
                ${topicsHTML}
            </ul>
        </div>
    `;
}

// Componente para preguntas frecuentes
function createFAQCard(course) {
    if (!course.faq) {
        return '';
    }
    
    const questionsHTML = course.faq.questions.map((item, index) => `
        <div class="border rounded-lg">
            <button class="w-full text-left p-4 flex justify-between items-center hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100 active:bg-gray-100" onclick="toggleFAQ(${index})">
                <span class="font-medium pr-4 text-gray-900">${item.question}</span>
                <svg id="faq-icon-${index}" class="h-5 w-5 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div id="faq-content-${index}" class="hidden">
                <div class="px-4 pb-4 text-gray-600">
                    ${item.answer}
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4">${course.faq.title}</h3>
            <div class="space-y-3">
                ${questionsHTML}
            </div>
        </div>
    `;
}

// Función global para manejar el toggle de FAQ
function toggleFAQ(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Función global para manejar el toggle de módulos
function toggleModule(index) {
    const content = document.getElementById(`module-content-${index}`);
    const icon = document.getElementById(`module-icon-${index}`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            content.classList.add('hidden');
        }, 200);
    }
}

// Hacer las funciones accesibles globalmente
window.toggleFAQ = toggleFAQ;
window.toggleModule = toggleModule;

// Componente para tarjeta de academia
function createAcademyCard(academy) {
    return `
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm group cursor-pointer hover:shadow-lg transition-all duration-300 ${academy.disabled ? 'opacity-75 cursor-not-allowed' : ''}"
             onclick="${academy.disabled ? '' : `navigateToAcademy('${academy.id}')`}">
            <div class="p-0">
                <div class="relative overflow-hidden rounded-t-lg">
                    ${createImageWithFallback(academy.image, academy.title, 'w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300')}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div class="absolute bottom-3 left-3 right-3">
                        <h3 class="text-white text-xl font-bold">${academy.title}</h3>
                    </div>
                    ${academy.disabled ? `
                        <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span class="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Próximamente</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="p-4">
                <p class="text-muted-foreground text-sm mb-4">
                    ${academy.description}
                </p>
                <div class="flex items-center justify-between">
                    ${academy.showCourseCount !== false ? `
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                            </svg>
                            ${academy.coursesCount} ${academy.coursesCount === 1 ? 'curso' : 'cursos'}
                        </div>
                    ` : '<div></div>'}
                    ${academy.disabled ? '' : `
                        <button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 group" style="background: var(--color-primary);" onclick="navigateToAcademy('${academy.id}')">
                            Explorar
                            ${createChevronRightIcon()}
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

// Exportar todas las funciones de componentes
export {
    createStarIcon,
    createClockIcon,
    createChevronRightIcon,
    createBadge,
    createImageWithFallback,
    createButton,
    createCourseCard,
    createCourseCardSkeleton,
    createCourseDetails,
    createInstructorCard,
    createCourseContentCard,
    createSkillsCard,
    createPricingCard,
    createOtherCoursesCard,
    createPrerequisitesCard,
    createFAQCard,
    createAcademyCard
};