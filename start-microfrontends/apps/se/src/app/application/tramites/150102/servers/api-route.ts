/**
 * Conjunto de rutas de la API para el procedimiento 80101.
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
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t150102';

/**
 * Rutas de la API para el procedimiento 150102.
 */
export const PROC_150102 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    OBTENER: (rfc: string) => `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-programas?rfc=${rfc}`,
    MOSTRA: (solicitudeId: string) => `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=${solicitudeId}`,
}
