// Datos de cursos
const courses = [
    {
        id: '1',
        title: 'Curso Mikrotik MTCNA',
        description: 'El Curso MTCNA (MikroTik Certified Network Associate) tiene como objetivo proporcionar a los participantes una comprensión sólida de la plataforma RouterOS y la configuración básica de los dispositivos MikroTik.',
        instructor: 'Alfaro Bazán Boris Fernando',
        instructorBio: 'Especialista en redes y telecomunicaciones con más de 10 años de experiencia. Instructor certificado Mikrotik con amplia experiencia en proyectos de networking.',
        instructorImage: '/assets/images/instructor/AlfaroBazan.jpeg',
        level: 'Intermedio',
        students: 756,
        rating: 4.7,
        image: '/assets/images/cursos/Curso Mikrotik MTCNA.png',
        category: 'Mikrotik',
        objectives: 'El Curso MTCNA (MikroTik Certified Network Associate) tiene como objetivo proporcionar a los participantes una comprensión sólida de la plataforma RouterOS y la configuración básica de los dispositivos MikroTik.',
        modules: [
            {
                title: 'Unidad 1: RouterOS',
                content: 'Introducción a MikroTik RouterOS, explorando su arquitectura y las funcionalidades de las versiones 6 y 7. Se abordan los diferentes productos MikroTik, métodos de acceso a routers, configuración básica, actualización de firmware, administración de usuarios y servicios, backups e instalación de licencias.',
            },
            {
                title: 'Unidad 2: Ruteo Estático',
                content: 'Se abordan los principios del ruteo estático, incluyendo conceptos como bogon IPs y routing, comprensión de la métrica, selección de la mejor ruta y gestión de la tabla de enrutamiento.',
            },
            {
                title: 'Unidad 3: Bridge',
                content: 'Esta unidad se enfoca en las capas físicas y de enlace de datos, abarcando medios físicos, direcciones MAC, IP, clasificación de direcciones, y diferencias entre IPv4 e IPv6.',
            },
            {
                title: 'Unidad 4: Wireless (IEEE 802.11)',
                content: 'Se detallan los estándares IEEE 802.11 para redes inalámbricas, frecuencias, configuración de canales, tasas de datos, modulación, filtrado de MAC, mejora de cobertura, y herramientas de monitoreo.',
            },
            {
                title: 'Unidad 5: Network Management',
                content: 'Cubre gestión de redes, protocolos ARP y RARP, servidor y cliente DHCP, y proporciona un laboratorio práctico y preguntas de repaso para consolidar el aprendizaje.',
            },
            {
                title: 'Unidad 6: Firewall',
                content: 'Se explica el funcionamiento del Firewall, flujo de paquetes, Connection Tracking, estructura de chains y acciones, protección de routers y clientes, address-lists, y NAT.',
            },
            {
                title: 'Unidad 7: Colas Simples y QoS',
                content: 'Presenta cambios en RouterOS v6, conceptos de limitación de velocidad, funcionamiento de Simple Queues, identificación de flujo, HTB, tipos de colas, y PCQ.',
            },
            {
                title: 'Unidad 8: Túneles PPP',
                content: 'Introduce Túneles PPP, configuraciones de /ppp, PPPoE, IPIP, EoIP, PPTP, L2TP, SSTP, y OpenVPN, y discute la configuración de rutas a través de túneles.',
            },
            {
                title: 'Unidad 9: Herramientas RouterOS',
                content: 'Explora herramientas como correo electrónico, Netwatch, Ping, Traceroute, Profile, Torch, SNMP, System Identity, IP Neighbor, soporte técnico, y otras herramientas de diagnóstico y monitoreo.',
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
        id: '4',
        title: 'Curso de Manejo de Cadáveres',
        description: 'El curso de Manejo de Cadáveres tiene como objetivo capacitar a los participantes en el correcto tratamiento de cuerpos en contextos clínicos, forenses y comunitarios, cumpliendo la normativa boliviana y aplicando medidas de bioseguridad.',
        level: 'Básico',
        students: 124,
        rating: 4.5,
        image: '/assets/images/cursos/Curso de Manejo de Cadáveres.jpg',
        category: 'Ciencias de la Salud',
        objectives: 'Capacitar a los participantes en el correcto tratamiento de cuerpos cumpliendo la normativa boliviana y aplicando medidas de bioseguridad adecuadas.',
        modules: [
            'Comprender la importancia del manejo correcto de cadáveres en contextos clínicos, forenses y comunitarios.',
            'Conocer la Legislación Boliviana y Protocolos del IDIF.',
            'Aplicar medidas de bioseguridad y uso de equipo de protección personal.',
            'Ejecutar correctamente procedimientos de levantamiento, transporte, conservación y almacenamiento de cuerpos.',
            'Manejar documentación y cadena de custodia de acuerdo con la normativa legal.'
        ],
        completion: 'Al finalizar este curso, los participantes estarán capacitados para manejar cadáveres de manera profesional, cumpliendo con todos los protocolos de bioseguridad y normativa legal boliviana.',
        prerequisites: {
            title: 'Conocimientos esenciales que debes tener para este curso',
            description: 'Es importante que tengas conocimientos básicos en ciencias de la salud y nociones de anatomía humana.',
            topics: ['Anatomía básica', 'Normas de bioseguridad', 'Ética médica']
        },
        skills: ['Manejo de cadáveres', 'Bioseguridad', 'Normativa IDIF', 'Documentación legal', 'Cadena de custodia']
    },
    {
        id: '5',
        title: 'Curso de Primeros Auxilios',
        description: 'El curso de Primeros Auxilios está diseñado para brindar conocimientos y técnicas esenciales que permiten actuar de manera rápida y efectiva en situaciones de emergencia, contribuyendo a salvar vidas y reducir riesgos antes de la atención médica profesional.',
        level: 'Básico',
        students: 342,
        rating: 4.8,
        image: '/assets/images/cursos/Curso de Primeros Auxilios.jpg',
        category: 'Ciencias de la Salud',
        objectives: 'Capacitar a los participantes en técnicas básicas de primeros auxilios para brindar atención oportuna y efectiva en situaciones de emergencia.',
        modules: [
            'Capacitar a los participantes en técnicas básicas de primeros auxilios para brindar una atención oportuna y efectiva en situaciones de emergencia, minimizando riesgos y preservando la vida.',
            'Ejecutar correctamente maniobras de Reanimación Cardiopulmonar (RCP) básica.',
            'Aplicar técnicas para el control de hemorragias y tratamiento de heridas.',
            'Identificar y actuar ante emergencias médicas frecuentes.',
            'Reconocer y evaluar el estado inicial del paciente y activar el sistema de emergencias.'
        ],
        completion: 'Al finalizar este curso, los participantes podrán responder efectivamente ante emergencias médicas básicas, aplicando técnicas de primeros auxilios y RCP.',
        prerequisites: {
            title: 'Conocimientos esenciales que debes tener para este curso',
            description: 'No se requieren conocimientos previos específicos. El curso está diseñado para cualquier persona que desee aprender primeros auxilios.',
            topics: ['Ninguno - curso introductorio']
        },
        skills: ['RCP básica', 'Control de hemorragias', 'Primeros auxilios', 'Evaluación de pacientes', 'Respuesta a emergencias']
    },
    {
        id: '6',
        title: 'Excel Experto',
        description: 'El curso de Excel Experto ofrece a los participantes un dominio avanzado de las herramientas de Microsoft Excel, desde fórmulas y funciones hasta el manejo de datos, gráficos y formatos profesionales, potenciando la productividad y análisis de información.',
        level: 'Avanzado',
        students: 289,
        rating: 4.6,
        image: '/assets/images/cursos/Excel Experto.jpg',
        category: 'Ingeniería',
        objectives: 'Dominar las herramientas avanzadas de Microsoft Excel para análisis de datos, automatización de procesos y creación de reportes profesionales.',
        modules: [
            'Introducción al entorno de Excel',
            'Primeros pasos con fórmulas y funciones',
            'Manejo de datos básicos',
            'Formato de hojas y presentación',
            'Gráficos simples y validación'
        ],
        completion: 'Al finalizar este curso, los participantes dominarán Excel a nivel experto, pudiendo crear análisis complejos, automatizar tareas y generar reportes profesionales.',
        prerequisites: {
            title: 'Conocimientos esenciales que debes tener para este curso',
            description: 'Es recomendable tener conocimientos básicos de Excel y manejo de computadoras.',
            topics: ['Excel básico', 'Manejo de computadoras', 'Conceptos matemáticos básicos']
        },
        skills: ['Excel avanzado', 'Análisis de datos', 'Fórmulas complejas', 'Gráficos profesionales', 'Automatización', 'Macros']
    },
    {
        id: '7',
        title: 'Tributación Aplicada y Llenado de Formularios',
        description: 'El curso de Tributación Aplicada y Llenado de Formularios proporciona conocimientos prácticos sobre la normativa tributaria boliviana, los distintos tipos de impuestos y el correcto llenado de formularios, preparando a los participantes para cumplir con sus obligaciones fiscales de manera eficiente.',
        level: 'Intermedio',
        students: 156,
        rating: 4.4,
        image: '/assets/images/cursos/Tributación Aplicada y Llenado de Formularios.jpg',
        category: 'Ciencias Empresariales',
        objectives: 'Proporcionar conocimientos prácticos sobre la normativa tributaria boliviana y el correcto llenado de formularios fiscales.',
        modules: [
            'Día 1: Marco normativo y principios básicos de tributación en Bolivia',
            'Día 2: Tipos de impuestos y obligaciones tributarias',
            'Día 3: Procedimientos de declaración y normativa vigente',
            'Día 4: Llenado práctico de formularios tributarios',
            'Día 5: Casos de aplicación y simulación de declaraciones tributarias'
        ],
        completion: 'Al finalizar este curso, los participantes podrán cumplir con sus obligaciones tributarias de manera eficiente y correcta según la normativa boliviana.',
        prerequisites: {
            title: 'Conocimientos esenciales que debes tener para este curso',
            description: 'Es recomendable tener conocimientos básicos de contabilidad y matemáticas.',
            topics: ['Contabilidad básica', 'Matemáticas', 'Legislación básica']
        },
        skills: ['Tributación boliviana', 'Llenado de formularios', 'Normativa fiscal', 'Declaraciones tributarias', 'IVA', 'IT', 'IUE']
    },
    {
        id: '8',
        title: 'Estrategias de Litigación y Simulacros de Audiencias',
        description: 'El curso de Estrategias de Litigación y Simulacros de Audiencias está orientado a fortalecer las competencias jurídicas en la aplicación de medidas cautelares y la defensa en procesos penales, mediante el análisis práctico de la detención preventiva y ejercicios de simulación de audiencias.',
        level: 'Avanzado',
        students: 89,
        rating: 4.9,
        image: '/assets/images/cursos/Estrategias de Litigación y Simulacros de Audiencias.jpg',
        category: 'Ciencias Jurídicas',
        objectives: 'Fortalecer las competencias jurídicas en litigación y defensa en procesos penales mediante análisis práctico y simulacros.',
        modules: [
            'Marco general de las medidas cautelares.',
            'Detención preventiva: Supuestos y requisitos.',
            'El Test de proporcionalidad y la razonabilidad de la detención preventiva.',
            'Condiciones de validez de la detención preventiva.'
        ],
        completion: 'Al finalizar este curso, los participantes dominarán las estrategias de litigación en procesos penales y podrán participar efectivamente en audiencias judiciales.',
        prerequisites: {
            title: 'Conocimientos esenciales que debes tener para este curso',
            description: 'Es necesario tener título en Derecho y conocimientos sólidos de derecho procesal penal.',
            topics: ['Derecho procesal penal', 'Código de procedimiento penal', 'Práctica jurídica']
        },
        skills: ['Litigación oral', 'Estrategias procesales', 'Medidas cautelares', 'Audiencias judiciales', 'Derecho penal', 'Oratoria jurídica']
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
// Datos de academias
const academies = [
    {
        id: 'mikrotik',
        title: 'MIKROTIK',
        description: 'Especialízate en administración de redes y RouterOS con certificaciones oficiales Mikrotik.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwY2FibGVzJTIwc2VydmVyfGVufDF8fHx8MTc1NTgxMjA1NXww&ixlib=rb-4.1.0&q=80&w=1080',
        coursesCount: 1,
        disabled: false,
    },
    {
        id: 'huawei',
        title: 'HUAWEI',
        description: 'Conviértete en experto en tecnologías Huawei para redes empresariales y telecomunicaciones.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZGF0YSUyMG5ldHdvcmt8ZW58MXx8fHwxNzU1ODEyMDU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        coursesCount: 0,
        showCourseCount: false,
        disabled: true,
    }
];

// Definir cursos de academias como datos compartidos
const academyCourses = {
    mikrotik: [
        {name: "Curso Mikrotik MTCNA", href: "/curso?id=1"}
    ],
    huawei: [
        {name: "Curso Huawei HCNA", href: "/curso?id=3"},
        {name: "Curso Huawei HCNP", href: "/curso?id=4"}
    ]
};

// Definir estructura de facultades como datos compartidos
const facultyStructure = [
    {name: "Ciencias de la Salud", href: "/facultades/ciencias-salud", submenu: [
        {name: "Curso de Manejo de Cadáveres", href: "/curso?id=4"},
        {name: "Curso de Primeros Auxilios", href: "/curso?id=5"}
    ]},
    {name: "Ingeniería", href: "/facultades/ingenieria", submenu: [
        {name: "Excel Experto", href: "/curso?id=6"}
    ]},
    {name: "Ciencias Empresariales", href: "/facultades/ciencias-empresariales", submenu: [
        {name: "Tributación Aplicada y Llenado de Formularios", href: "/curso?id=7"}
    ]},
    {name: "Ciencias Jurídicas", href: "/facultades/ciencias-juridicas", submenu: [
        {name: "Estrategias de Litigación y Simulacros de Audiencias", href: "/curso?id=8"}
    ]}
];

// Información de categorías para cursos organizados
const categoryInfo = {
    'Mikrotik': {
        description: 'Especialízate en tecnologías de networking y administración de redes con certificaciones reconocidas internacionalmente.',
        callToAction: {
            default: 'Más cursos de Mikrotik próximamente',
            alternative: 'Explora nuestra creciente oferta en tecnologías Mikrotik'
        },
        threshold: 2,
        type: 'academia'
    },
    'Ciencias de la Salud': {
        description: 'Cursos especializados en el área de la salud con enfoques prácticos y científicos.',
        callToAction: {
            default: 'Ampliando nuestra oferta en ciencias de la salud',
            alternative: 'Nuevos cursos de salud en desarrollo'
        },
        threshold: 3,
        type: 'facultad'
    },
    'Ingeniería': {
        description: 'Formación técnica avanzada en diferentes ramas de la ingeniería y tecnología.',
        callToAction: {
            default: 'Nuevos cursos de ingeniería en desarrollo',
            alternative: 'Expandiendo nuestra oferta técnica'
        },
        threshold: 3,
        type: 'facultad'
    },
    'Ciencias Empresariales': {
        description: 'Desarrolla habilidades empresariales y de gestión para el mundo profesional moderno.',
        callToAction: {
            default: 'Expandiendo nuestra oferta empresarial',
            alternative: 'Más cursos de gestión próximamente'
        },
        threshold: 3,
        type: 'facultad'
    },
    'Ciencias Jurídicas': {
        description: 'Formación especializada en derecho y práctica jurídica aplicada.',
        callToAction: {
            default: 'Más cursos jurídicos próximamente',
            alternative: 'Ampliando nuestra oferta legal'
        },
        threshold: 3,
        type: 'facultad'
    }
};

const navLinks = [
    { 
        name: 'Inicio', 
        href: '/', 
        navs: [], 
        sections: [
            {name: 'Inicio', id: 'hero-section'},
            {name: 'Nuestras Academias', id: 'academias-section'},
            {name: 'Cursos Destacados', id: 'courses-section'},
            {name: 'Nosotros', id: 'about-section'}
        ] 
    },
    { 
        name: 'Cursos', 
        href: '/cursos', 
        navs: [], 
        sections: [
            {name: 'Nuestras Academias', id: 'academias-section'},
            {name: 'Ciencias de la Salud', id: 'ciencias-de-la-salud-section'},
            {name: 'Ingeniería', id: 'ingenieria-section'},
            {name: 'Ciencias Empresariales', id: 'ciencias-empresariales-section'},
            {name: 'Ciencias Jurídicas', id: 'ciencias-juridicas-section'}
        ]
    },
    { 
        name: 'Mikrotik', 
        href: '/mikrotik', 
        navs: academyCourses.mikrotik.map(course => ({name: course.name, href: course.href})),
        sections: []
    }
];




// Exportar datos y funciones
export {
    academies,
    courses,
    appState,
    updateState,
    getState,
    getCourseById,
    getCoursesByCategory,
    getOtherCourses,
    navLinks,
    academyCourses,
    facultyStructure,
    categoryInfo
};