import { Route } from '@angular/router';

/**
 * Conjunto de rutas de la API para el procedimiento 260906.
 */
import { ENVIRONMENT } from "@libs/shared/data-access-user/src/enviroments/enviroment";

/**
 * url base de la API
 */
const BASE_URL = ENVIRONMENT.API_HOST;
/**
 * API nombre
 */
const API = ENVIRONMENT.API;
/**
 * versión de la API
 */
const API_VERSION = ENVIRONMENT.API_VERSION;
/**
 * Catálogo de la API
 */
const CATALOGO = ENVIRONMENT.CATALOGO_URL;
/**
 * Solicitud de la API
 */
const SOLICITUD = ENVIRONMENT.SOLICITUD_URL;
/**
 * Trámite de la API
 */
const TRAMITE = ENVIRONMENT.TRAMITE_URL;
/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t260906';

/**
 * Rutas principales para la aplicación Cofepris.
 * 
 * @export
 * @const {Route[]}
 */
export const APP_ROUTES: Route[] = [
  /**
   * Ruta principal que carga las rutas remotas.
   * 
   * @type {Route}
   */
  {
    path: '',
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.REMOTE_ROUTES),
  },
];

/**
 * API para guardar la solicitud del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t260906/solicitud/guardar';

/**
 * Rutas de la API para el procedimiento 110201
 */
export const PROC_260906 = {
  BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar`,
};