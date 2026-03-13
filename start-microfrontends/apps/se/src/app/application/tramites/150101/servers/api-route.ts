/**
 * Conjunto de rutas de la API para el procedimiento 150101.
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
const PROCEDURE = '/sat-t150101';

/**
 * Rutas de la API para el procedimiento 110223.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */
export const PROC_150101 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    MOSTRAR: (solicitudeId: string) => `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=${solicitudeId}`,
}

/**
 * Ruta de la API para buscar productores exportador por RFC del solicitante.
 * @param rfc RFC del solicitante a consultar.
 * @returns {string} URL para la consulta de productores exportador.
 */
export const BUSCAR_PROGRAMAS = (rfc: string): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-programas?rfc=${rfc}`;