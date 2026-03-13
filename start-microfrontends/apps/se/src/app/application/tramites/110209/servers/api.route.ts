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
const PROCEDURE = '/sat-t110209';

/**
 * Rutas de la API para el procedimiento 110223.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */
export const PROC_110209 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar-certificado`,
    BUSCAR_CERTIFICADO: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-certificado`,
}