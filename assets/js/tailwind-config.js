// Clave para localStorage
const TAILWIND_CONFIG_KEY = 'tailwind_config_cache';
const CONFIG_VERSION_KEY = 'tailwind_config_version';
const CURRENT_VERSION = '1.0.0'; // Incrementar cuando cambies la configuración

// Función para guardar configuración en localStorage
function saveConfigToStorage(config) {
    try {
        localStorage.setItem(TAILWIND_CONFIG_KEY, JSON.stringify(config));
        localStorage.setItem(CONFIG_VERSION_KEY, CURRENT_VERSION);
    } catch (error) {
        console.warn('No se pudo guardar la configuración en localStorage:', error);
    }
}

// Función para cargar configuración desde localStorage
function loadConfigFromStorage() {
    try {
        const savedVersion = localStorage.getItem(CONFIG_VERSION_KEY);
        const savedConfig = localStorage.getItem(TAILWIND_CONFIG_KEY);
        
        // Verificar si la versión coincide
        if (savedVersion === CURRENT_VERSION && savedConfig) {
            const config = JSON.parse(savedConfig);
            return config;
        } else {
            return null;
        }
    } catch (error) {
        console.warn('Error al cargar configuración desde localStorage:', error);
        return null;
    }
}

// Función para cargar la configuración de Tailwind desde JSON
async function loadTailwindConfig() {
    // Intentar cargar desde localStorage primero
    let config = loadConfigFromStorage();
    
    if (config) {
        // Usar configuración desde localStorage
        tailwind.config = config;
        return;
    }
    
    try {
        // Si no hay caché, cargar desde JSON
        const response = await fetch('/assets/config/tailwind-colors.json');
        config = await response.json();
        
        // Guardar en localStorage para futuras cargas
        saveConfigToStorage(config);
        
        // Aplicar la configuración a Tailwind
        tailwind.config = config;
    } catch (error) {
        console.error('Error al cargar la configuración de Tailwind:', error);
        
        // Si falla todo, intentar una última vez desde localStorage (ignorando versión)
        const emergencyConfig = localStorage.getItem(TAILWIND_CONFIG_KEY);
        if (emergencyConfig) {
            try {
                tailwind.config = JSON.parse(emergencyConfig);
                return;
            } catch (parseError) {
                console.error('Error al parsear configuración de emergencia:', parseError);
            }
        }
        
        console.error('No se pudo cargar ninguna configuración. Tailwind usará sus valores por defecto.');
    }
}

// Función para limpiar caché (útil para desarrollo)
function clearTailwindCache() {
    localStorage.removeItem(TAILWIND_CONFIG_KEY);
    localStorage.removeItem(CONFIG_VERSION_KEY);
}

// Función para forzar recarga desde JSON (útil para desarrollo)
async function reloadTailwindConfig() {
    clearTailwindCache();
    await loadTailwindConfig();
}

// Exponer funciones útiles para desarrollo (opcional)
if (typeof window !== 'undefined') {
    window.tailwindConfigUtils = {
        clearCache: clearTailwindCache,
        reload: reloadTailwindConfig,
        getStoredConfig: loadConfigFromStorage
    };
}

// Exportar funciones principales
export { 
    loadTailwindConfig,
    clearTailwindCache,
    reloadTailwindConfig,
    loadConfigFromStorage
};

// Cargar la configuración cuando se cargue el script
loadTailwindConfig();