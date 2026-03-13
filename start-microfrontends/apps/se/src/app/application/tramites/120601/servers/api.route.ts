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
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t120601';

/**
 * Rutas de la API para el procedimiento 120601.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */
export const PROC_120601 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    PLANTAS: `${BASE_URL}${API}${PROCEDURE}/solicitud/plantas`,
    ACCIONISTAS: `${BASE_URL}${API}${PROCEDURE}/solicitud/accionistas`,
}