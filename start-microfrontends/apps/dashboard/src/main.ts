
import { setRemoteDefinitions } from "@nx/angular/mf";

// Helper para manejar errores de forma elegante
const HANDLE_ERROR = (error: unknown) => {
  console.error('Error loading application:', error);
  
  // Si hay un elemento en el DOM, mostrar mensaje de error al usuario
  const ROOT_ELEMENT = document.querySelector('ng-mf-root');
  if (ROOT_ELEMENT) {
    ROOT_ELEMENT.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h2>Aplicación en mantenimiento</h2>
        <p>Estamos trabajando para restablecer el servicio lo antes posible.</p>
        <p>Por favor, intente nuevamente más tarde.</p>
      </div>
    `;
  }
  
  // Re-lanzar el error para registros de depuración
  throw error;
};

// Cargar manifiesto con manejo de errores y reintentos
const LOAD_MANIFEST = (retryCount = 0, maxRetries = 3): Promise<Record<string, string>> => {

  
  return fetch("/assets/module-federation.manifest.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch manifest: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((manifest: Record<string, string>) => {
     
      
      // Procesar las URLs según el entorno
      if (manifest) {
     
        
        Object.keys(manifest).forEach((key) => {
          // Remover cualquier puerto específico (como 4201) de las URLs
          if (manifest[key].match(/:\d{4}\//)) {
            manifest[key] = manifest[key].replace(/:\d{4}\//, '/');
          }
          // Si la URL es relativa (comienza con /), convertirla a absoluta
          else if (manifest[key].startsWith('/')) {
            manifest[key] = window.location.origin + manifest[key];
          }
          // Si contiene localhost, reemplazarlo con el host actual
          else if (manifest[key].includes('localhost')) {
            manifest[key] = manifest[key].replace(/https?:\/\/localhost(:\d+)?/, window.location.origin);
          }
        });
       
      } 
      
  
      return manifest;
    })
    .catch((error) => {
      console.error('Error loading manifest:', error);
      
      if (retryCount < maxRetries) {
      
        return new Promise(resolve => 
          setTimeout(() => resolve(LOAD_MANIFEST(retryCount + 1, maxRetries)), (retryCount + 1) * 1000)
        );
      }
      
      // Si excedimos los reintentos, devolver un manifiesto vacío y seguir
      console.error('Max retries exceeded, proceeding with empty manifest');
      return {};
    });
};

// Iniciar la carga del manifiesto y bootstrap de la aplicación
LOAD_MANIFEST()
  .then((definitions: Record<string, string>) => {
   
    setRemoteDefinitions(definitions);
  })
  .then(() => {
   
    return import("./bootstrap").catch(HANDLE_ERROR);
  })
  .catch(HANDLE_ERROR);
