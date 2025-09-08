// Punto de entrada principal de la aplicación
// Este archivo orquesta la carga de todos los módulos
import { loadPageContent } from './modules/app.js';
import { initRouter } from './router.js';

// Asegurar scroll hacia arriba al inicio
window.scrollTo(0, 0);

// Función para mostrar mensajes de error al usuario
function showErrorMessage(message) {
    // Crear elemento de error si no existe
    let errorDiv = document.getElementById('app-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'app-error';
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
        document.body.appendChild(errorDiv);
    }
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
    // Auto-remover después de 10 segundos
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 10000);
}

// Función principal de inicialización
async function main() {
    try {
        await loadPageContent();
        const router = initRouter();
        
    } catch (error) {
        console.error('❌ [MAIN] Error crítico en main():', error);
        showErrorMessage('Hubo un problema al cargar la aplicación: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', main);