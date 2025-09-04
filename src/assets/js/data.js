// Datos de cursos
const courses = [
    {
        id: '1',
        title: 'Curso Mikrotik MTCNA',
        description: 'El Curso MTCNA (MikroTik Certified Network Associate) tiene como objetivo proporcionar a los participantes una comprensión sólida de la plataforma RouterOS y la configuración básica de los dispositivos MikroTik.',
        instructor: 'Alfaro Bazán Boris Fernando',
        instructorBio: 'Especialista en redes y telecomunicaciones con más de 10 años de experiencia. Instructor certificado Mikrotik con amplia experiencia en proyectos de networking.',
        instructorImage: '/assets/images/instructor/AlfaroBazan.jpeg',
        duration: '8 semanas',
        level: 'Intermedio',
        students: 756,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwY2FibGVzJTIwc2VydmVyfGVufDF8fHx8MTc1NTgxMjA1NXww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Mikrotik',
        objectives: 'El Curso MTCNA (MikroTik Certified Network Associate) tiene como objetivo proporcionar a los participantes una comprensión sólida de la plataforma RouterOS y la configuración básica de los dispositivos MikroTik.',
        modules: [
            {
                title: 'Capítulo 1: RouterOS',
                content: 'Introducción a MikroTik RouterOS, explorando su arquitectura y las funcionalidades de las versiones 6 y 7. Se abordan los diferentes productos MikroTik, métodos de acceso a routers, configuración básica, actualización de firmware, administración de usuarios y servicios, backups e instalación de licencias.',
                duration: '2 horas'
            },
            {
                title: 'Capítulo 2: Ruteo Estático',
                content: 'Se abordan los principios del ruteo estático, incluyendo conceptos como bogon IPs y routing, comprensión de la métrica, selección de la mejor ruta y gestión de la tabla de enrutamiento.',
                duration: '1.5 horas'
            },
            {
                title: 'Capítulo 3: Bridge',
                content: 'Este capítulo se enfoca en las capas físicas y de enlace de datos, abarcando medios físicos, direcciones MAC, IP, clasificación de direcciones, y diferencias entre IPv4 e IPv6.',
                duration: '1.5 horas'
            },
            {
                title: 'Capítulo 4: Wireless (IEEE 802.11)',
                content: 'Se detallan los estándares IEEE 802.11 para redes inalámbricas, frecuencias, configuración de canales, tasas de datos, modulación, filtrado de MAC, mejora de cobertura, y herramientas de monitoreo.',
                duration: '2 horas'
            },
            {
                title: 'Capítulo 5: Network Management',
                content: 'Cubre gestión de redes, protocolos ARP y RARP, servidor y cliente DHCP, y proporciona un laboratorio práctico y preguntas de repaso para consolidar el aprendizaje.',
                duration: '1.5 horas'
            },
            {
                title: 'Capítulo 6: Firewall',
                content: 'Se explica el funcionamiento del Firewall, flujo de paquetes, Connection Tracking, estructura de chains y acciones, protección de routers y clientes, address-lists, y NAT.',
                duration: '2.5 horas'
            },
            {
                title: 'Capítulo 7: Colas Simples y QoS',
                content: 'Presenta cambios en RouterOS v6, conceptos de limitación de velocidad, funcionamiento de Simple Queues, identificación de flujo, HTB, tipos de colas, y PCQ.',
                duration: '2 horas'
            },
            {
                title: 'Capítulo 8: Túneles PPP',
                content: 'Introduce Túneles PPP, configuraciones de /ppp, PPPoE, IPIP, EoIP, PPTP, L2TP, SSTP, y OpenVPN, y discute la configuración de rutas a través de túneles.',
                duration: '2 horas'
            },
            {
                title: 'Capítulo 9: Herramientas RouterOS',
                content: 'Explora herramientas como correo electrónico, Netwatch, Ping, Traceroute, Profile, Torch, SNMP, System Identity, IP Neighbor, soporte técnico, y otras herramientas de diagnóstico y monitoreo.',
                duration: '1.5 horas'
            }
        ],
        completion: 'Al finalizar este curso, los participantes deberán estar en capacidad de configurar y administrar dispositivos MikroTik con RouterOS en redes pequeñas y medianas, además de estar preparados para el examen de certificación MTCNA.',
        prerequisites: {
            title: 'Conocimientos esenciales que debes tener para este curso',
            description: 'Es importante que estés familiarizado con varios conceptos en redes, sin los cuales se podría ralentizar tu proceso de aprendizaje. Te dejamos a continuación una lista de videos para que los revises si tus conocimientos en esos tópicos no son muy claros.',
            topics: ['Subnetting', 'Sumarización', 'VLSM']
        },
        faq: {
            title: 'Preguntas Frecuentes sobre MTCNA',
            questions: [
                {
                    question: '¿Qué es la certificación MTCNA?',
                    answer: 'MTCNA (MikroTik Certified Network Associate) es la certificación básica de MikroTik que valida tus conocimientos en RouterOS y la configuración básica de dispositivos MikroTik. Es el primer nivel en el programa de certificación MikroTik.'
                },
                {
                    question: '¿Cuáles son los requisitos previos para tomar este curso?',
                    answer: 'Se recomienda tener conocimientos básicos de networking, incluyendo conceptos de TCP/IP, subnetting, VLSM y routing básico. No se requiere experiencia previa con MikroTik, pero conocimientos de redes son esenciales.'
                },
                {
                    question: '¿El curso incluye laboratorios prácticos?',
                    answer: 'Sí, el curso incluye múltiples laboratorios prácticos donde podrás configurar dispositivos MikroTik virtuales y físicos. Aprenderás mediante ejercicios hands-on que refuerzan los conceptos teóricos.'
                },
                {
                    question: '¿Cómo es el examen de certificación MTCNA?',
                    answer: 'El examen MTCNA consiste en aproximadamente 25 preguntas de opción múltiple y se realiza en línea. Cubre todos los temas del curso y requiere una puntuación del 60% para aprobar. El examen tiene una duración de 60 minutos.'
                },
                {
                    question: '¿Qué dispositivos MikroTik puedo configurar después del curso?',
                    answer: 'Después de completar el curso, podrás configurar routers, switches y puntos de acceso MikroTik para redes pequeñas y medianas, incluyendo configuración básica de firewall, wireless, y gestión de tráfico.'
                },
                {
                    question: '¿El certificado MTCNA tiene vencimiento?',
                    answer: 'No, los certificados MTCNA no tienen fecha de vencimiento. Una vez que obtienes la certificación, es válida de por vida. Sin embargo, se recomienda mantenerse actualizado con las nuevas versiones de RouterOS.'
                }
            ]
        },
        skills: ['RouterOS', 'Networking', 'Firewall', 'Wireless', 'QoS', 'MTCNA Certification', 'PPP Tunnels', 'Network Management', 'Static Routing']
    },
    {
        id: '2',
        title: 'Desarrollo Web Full Stack',
        description: 'Aprende a crear aplicaciones web completas desde cero utilizando las tecnologías más demandadas del mercado.',
        instructor: 'Alfaro Bazán Boris Fernando',
        instructorBio: 'Desarrolladora Senior con más de 8 años de experiencia en empresas tecnológicas. Especialista en React, Node.js y arquitecturas modernas.',
        instructorImage: '/assets/images/instructor/AlfaroBazan.jpeg',
        duration: '12 semanas',
        level: 'Intermedio',
        students: 1247,
        rating: 4.8,
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
        id: '3',
        title: 'Diseño UX/UI Profesional',
        description: 'Domina las herramientas y metodologías para crear experiencias de usuario excepcionales y interfaces atractivas.',
        instructor: 'Alfaro Bazán Boris Fernando',
        instructorBio: 'Diseñador UX con más de 6 años de experiencia en startups y grandes corporaciones. Especialista en investigación de usuarios y prototipado.',
        instructorImage: '/assets/images/instructor/AlfaroBazan.jpeg',
        duration: '10 semanas',
        level: 'Principiante',
        students: 892,
        rating: 4.9,
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
    { name: 'Inicio', href: '/', navs: [] },
    { name: 'Cursos', href: '#' , navs: [] },
    { name: 'Cochabamba', href: '/cochabamba', navs: [] },
    { name: 'Mikrotik', href: '/mikrotik', navs: [
        {name: "Curso Mikrotik 1", href: "/curso?id=1"},
        {name: "Curso Mikrotik 2", href: "/curso?id=2"},
        {name: "Curso Mikrotik 3", href: "/curso?id=3"},
    ] },
];

// Secciones HTML a cargar
const sections = [
    ['header-section', '/assets/sections/header.html', (parent) => {
        //Crear navegación superior
        let navTop = parent.querySelector(".upds-nav-top");
        navTop.innerHTML = `${navLinks.map(link => `<a class="upds-nav-link" href="${link.href}">${link.name}</a>`).join('')}`;
        //Crear navegacion inferior
        let navBottom = parent.querySelector(".upds-header-contact");
        navBottom.innerHTML = `${navLinks[DATA.headIndex].navs.map(link => `<a href="${link.href}" class="upds-contact-link">${link.name}</a>`).join('')}`;
        
        let link = navTop.querySelectorAll('a')[DATA.headIndex];
        let elementorHeader = document.getElementById("elementor-header");
        let resizeHeader = () => {
            if (link && elementorHeader) {
                // Asegurar que la flecha se posiciona correctamente
                requestAnimationFrame(() => {
                    elementorHeader.style.left = `${link.offsetLeft + link.offsetWidth/2}px`;
                    elementorHeader.classList.add("active");
                });
            }
        };
        window.addEventListener('resize', resizeHeader);
        // Mejorar el timing para evitar animaciones raras
        if (document.readyState === 'complete') {
            setTimeout(resizeHeader, 150);
        } else {
            window.addEventListener('load', resizeHeader);
        }
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