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
const PROCEDURE = '/sat-t110217';

/**
 * Rutas de la API para el procedimiento 110223.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */
export const PROC_110217 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    BUSCAR_MERCANCIAS: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-mercancias`,
    AGREGAR_PRODUCTOR: `${BASE_URL}${API}${PROCEDURE}/solicitud/agregar-productor`,
}

/**
 * Ruta de la API para buscar productores exportador por RFC del solicitante.
 * @param rfc RFC del solicitante a consultar.
 * @returns {string} URL para la consulta de productores exportador.
 */
export const PRODUCTORS_EXPORTADOR = (rfc: string): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-productor?rfcSolicitante=${rfc}`;
