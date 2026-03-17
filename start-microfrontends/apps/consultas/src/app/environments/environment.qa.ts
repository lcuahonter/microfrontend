/**
 * @description
 * Configuración del entorno de QA de la aplicación.
 * Esta configuración se utiliza para establecer las URL del servidor y otras configuraciones necesarias para la aplicación en QA.
 * Se utiliza para la comunicación con el servidor y la carga de archivos.
 */
export const ENVIRONMENT = {
    URL_SERVER: 'https://qa.v30.ultrasist.net/api',
    URL_SERVER_UPLOAD: 'https://qa.v30.ultrasist.net/api/upload',
    URL_SERVER_JSON_AUXILIAR: 'https://qa.v30.ultrasist.net/api/json-auxiliar',
    API_HOST: 'https://api-v30.cloud-ultrasist.net', // added for consistency
    API_BASE_URL: 'https://api-v30.cloud-ultrasist.net', // keep for compatibility if still used
    PRODUCTION: false,
    MOCK: false
};
