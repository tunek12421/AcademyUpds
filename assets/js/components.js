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
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    };
    
    return `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}">${text}</span>`;
}

// Componente para imagen con fallback
function createImageWithFallback(src, alt, className = '') {
    const fallbackSrc = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=' + encodeURIComponent(alt);
    return `<img src="${src}" alt="${alt}" class="${className}" onerror="this.src='${fallbackSrc}'">`;
}

// Componente Button
function createButton(text, variant = 'default', size = 'default', onClick = '', additionalClasses = '') {
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    };
    
    const sizes = {
        default: 'h-10 py-2 px-4',
        lg: 'h-11 px-8'
    };
    
    const onClickAttr = onClick ? `onclick="${onClick}"` : '';
    
    return `<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${variants[variant]} ${sizes[size]} ${additionalClasses}" ${onClickAttr}>
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
                    <div class="absolute top-3 left-3">
                        ${createBadge(course.category)}
                    </div>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center gap-2 mb-2">
                    <div class="flex items-center">
                        ${createStarIcon(true)}
                        <span class="ml-1">${course.rating}</span>
                    </div>
                    <span class="text-muted-foreground">•</span>
                    <span class="text-muted-foreground">${course.students} estudiantes</span>
                </div>
                <h3 class="text-lg font-semibold mb-2">${course.title}</h3>
                <p class="text-muted-foreground mb-4 line-clamp-2">
                    ${course.description}
                </p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                        <div class="flex items-center gap-1">
                            ${createClockIcon()}
                            ${course.duration}
                        </div>
                        ${createBadge(course.level, 'secondary')}
                    </div>
                    ${createButton(`Ver detalles ${createChevronRightIcon()}`, 'default', 'default', `selectCourse('${course.id}')`, 'group')}
                </div>
                <div class="mt-4 pt-4 border-t">
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Por ${course.instructor}</span>
                        <span class="font-bold">$${course.price}</span>
                    </div>
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
                ${createImageWithFallback(course.image, course.title, 'w-full h-64 object-cover')}
                <div class="absolute top-3 left-3">
                    ${createBadge(course.category)}
                </div>
            </div>
        </div>
        <div class="px-6 pb-2">
            <h2 class="text-2xl font-bold mb-2">${course.title}</h2>
            <p class="text-base text-muted-foreground">
                ${course.description}
            </p>
        </div>
        <div class="px-6 pb-6">
            <div class="flex items-center gap-6 mb-6">
                <div class="flex items-center gap-2">
                    ${createStarIcon(true)}
                    <span class="font-medium">${course.rating}</span>
                    <span class="text-muted-foreground">(${course.students} estudiantes)</span>
                </div>
                <div class="flex items-center gap-2">
                    ${createClockIcon()}
                    <span>${course.duration}</span>
                </div>
                ${createBadge(course.level, 'secondary')}
            </div>
        </div>
    `;
}

// Componente para instructor
function createInstructorCard(course) {
    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4">Instructor</h3>
        </div>
        <div class="px-6 pb-6">
            <div class="flex items-start gap-4">
                ${createImageWithFallback(course.instructorImage, course.instructor, 'w-16 h-16 rounded-full object-cover')}
                <div>
                    <h4 class="font-medium mb-2">${course.instructor}</h4>
                    <p class="text-muted-foreground">${course.instructorBio}</p>
                </div>
            </div>
        </div>
    `;
}

// Componente para contenido del curso
function createCourseContentCard(course) {
    const modulesHTML = course.modules.map((module, index) => `
        <div class="flex items-center gap-3 p-3 border rounded-lg">
            <span class="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                ${index + 1}
            </span>
            <span>${module}</span>
        </div>
    `).join('');

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

// Componente para tarjeta de precio
function createPricingCard(course) {
    return `
        <div class="p-6">
            <div class="text-center mb-6">
                <span class="text-3xl font-bold">$${course.price}</span>
                <p class="text-muted-foreground">Acceso de por vida</p>
            </div>
            ${createButton('Inscribirme ahora', 'default', 'lg', '', 'w-full mb-4')}
            ${createButton('Vista previa gratuita', 'outline', 'default', '', 'w-full')}
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
                <p class="text-muted-foreground text-xs">${course.instructor}</p>
                <div class="flex items-center gap-1 mt-1">
                    <svg class="h-3 w-3 fill-yellow-400 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="m3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <span class="text-xs">${course.rating}</span>
                </div>
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

// Exportar todas las funciones de componentes
export {
    createStarIcon,
    createClockIcon,
    createChevronRightIcon,
    createBadge,
    createImageWithFallback,
    createButton,
    createCourseCard,
    createCourseDetails,
    createInstructorCard,
    createCourseContentCard,
    createSkillsCard,
    createPricingCard,
    createOtherCoursesCard
};