import { AppConfig } from "../app.inject";

/**
 * @description
 * Configuración del entorno de desarrollo de la aplicación.
 * Esta configuración se utiliza para establecer las URL del servidor y otras configuraciones necesarias para la aplicación en desarrollo.
 * Se utiliza para la comunicación con el servidor y la carga de archivos.
 */
export const ENVIRONMENT: AppConfig = {
  URL_SERVER: 'https://dev.v30.ultrasist.net/api',
  URL_SERVER_UPLOAD: 'https://upload.v30.ultrasist.net/api/upload',
  URL_SERVER_JSON_AUXILIAR: 'https://dev.v30.ultrasist.net/api/json-auxiliar',
  API_BASE_URL: 'https://api-v30.cloud-ultrasist.net',
  MOCK: true
};