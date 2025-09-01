// Datos de cursos
const courses = [
    {
        id: '1',
        title: 'Desarrollo Web Full Stack',
        description: 'Aprende a crear aplicaciones web completas desde cero utilizando las tecnologías más demandadas del mercado.',
        instructor: 'María González',
        instructorBio: 'Desarrolladora Senior con más de 8 años de experiencia en empresas tecnológicas. Especialista en React, Node.js y arquitecturas modernas.',
        instructorImage: 'https://images.unsplash.com/photo-1669023414166-a4cc7c0fe1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvdXJzZSUyMGxhcHRvcHxlbnwxfHx8fDE3NTU4MTIwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        duration: '12 semanas',
        level: 'Intermedio',
        students: 1247,
        rating: 4.8,
        price: 299,
        image: 'https://images.unsplash.com/photo-1669023414166-a4cc7c0fe1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvdXJzZSUyMGxhcHRvcHxlbnwxfHx8fDE3NTU4MTIwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'Desarrollo',
        modules: [
            'Fundamentos de HTML y CSS',
            'JavaScript Moderno',
            'React y Hooks',
            'Node.js y Express',
            'Bases de datos',
            'Proyecto Final'
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'API REST']
    },
    {
        id: '2',
        title: 'Diseño UX/UI Profesional',
        description: 'Domina las herramientas y metodologías para crear experiencias de usuario excepcionales y interfaces atractivas.',
        instructor: 'Carlos Mendoza',
        instructorBio: 'Diseñador UX con más de 6 años de experiencia en startups y grandes corporaciones. Especialista en investigación de usuarios y prototipado.',
        instructorImage: 'https://images.unsplash.com/photo-1611773060335-a3983045bf4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB3b3Jrc2hvcCUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NTc1OTc3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        duration: '10 semanas',
        level: 'Principiante',
        students: 892,
        rating: 4.9,
        price: 249,
        image: 'https://images.unsplash.com/photo-1611773060335-a3983045bf4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB3b3Jrc2hvcCUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NTc1OTc3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'Diseño',
        modules: [
            'Principios de UX',
            'Investigación de usuarios',
            'Wireframing y prototipado',
            'Figma avanzado',
            'Testing de usabilidad',
            'Portfolio profesional'
        ],
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems']
    },
    {
        id: '3',
        title: 'Marketing Digital y Growth',
        description: 'Estrategias avanzadas de marketing digital para hacer crecer tu negocio y aumentar las ventas online.',
        instructor: 'Ana Rodríguez',
        instructorBio: 'Especialista en Marketing Digital con más de 10 años de experiencia. Ha ayudado a más de 100 empresas a aumentar sus ventas online.',
        instructorImage: 'https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU4MTIwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        duration: '8 semanas',
        level: 'Intermedio',
        students: 756,
        rating: 4.7,
        price: 199,
        image: 'https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU4MTIwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'Marketing',
        modules: [
            'Fundamentos del marketing digital',
            'SEO y SEM',
            'Redes sociales',
            'Email marketing',
            'Analytics y métricas',
            'Estrategias de crecimiento'
        ],
        skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics', 'Content Marketing', 'Growth Hacking']
    }
];

// Estado global de la aplicación
let appState = {
    selectedCourse: null,
    activeTab: 'general'
};

// Funciones de estado
function updateState(newState) {
    appState = { ...appState, ...newState };
}

function getState() {
    return appState;
}

// Funciones de utilidad para trabajar con cursos
function getCourseById(id) {
    return courses.find(course => course.id === id);
}

function getCoursesByCategory(category) {
    return courses.filter(course => course.category === category);
}

// Función para obtener otros cursos (excluyendo el curso seleccionado)
function getOtherCourses(excludeCourseId = null) {
    // Si no se especifica ID, usar el curso seleccionado del estado
    const excludeId = excludeCourseId || (appState.selectedCourse ? appState.selectedCourse.id : null);
    
    if (!excludeId) {
        // Si no hay curso a excluir, devolver los primeros 3 cursos
        return courses.slice(0, 3);
    }
    
    // Filtrar el curso seleccionado y devolver máximo 3 cursos
    return courses.filter(course => course.id !== excludeId).slice(0, 3);
}
const navLinks = [
    { name: 'Inicio', href: 'https://www.upds.edu.bo/', navs: [] },
    { name: 'Cursos', href: '/' , navs: [] },
    { name: 'Microtik', href: '/microtik', navs: [
        {name: "curso1", href: "/cursos/mt-1"},
        {name: "curso1", href: "/cursos/mt-2"},
        {name: "curso1", href: "/cursos/mt-3"},
    ] },
];

// Secciones HTML a cargar
const sections = [
    ['header-section', '/assets/sections/header.html', (parent) => {
        let nav = parent.querySelector("nav");
        nav.innerHTML = `${navLinks.map(link => `<a class="upds-nav-link" href="${link.href}">${link.name}</a>`).join('')}`;
        let link = document.body.querySelectorAll('.upds-nav-top a')[INDEX];
        let elementorHeader = document.getElementById("elementor-header");
        let resizeHeader = () => {
            elementorHeader.style.left = `${link.offsetLeft+link.offsetWidth/2}px`;
            elementorHeader.classList.add("active");
        };
        window.addEventListener('resize', resizeHeader);
        if (document.readyState === 'complete') setTimeout(resizeHeader, 100);
        else window.addEventListener('load', resizeHeader);
    }],
    ['footer-section', '/assets/sections/footer.html', ()=>{}]
];

// Función para cargar secciones HTML
async function loadSection(parent, url) {
    await fetch(url)
        .then(res => res.text())
        .then(html => { parent.innerHTML = html; });
}

async function loadAllSections() {
    await Promise.all(sections.map(async ([id, url, init]) => {
        let parent = document.getElementById(id);
        if(parent){
            await loadSection(parent, url);
            init(parent);
        }else{
            console.error(`No se encontró el elemento con ID: ${id}`);
        }
    }));
}

// Exportar datos y funciones
export {
    courses,
    appState,
    updateState,
    getState,
    getCourseById,
    getCoursesByCategory,
    getOtherCourses,
    sections,
    loadSection,
    loadAllSections
};