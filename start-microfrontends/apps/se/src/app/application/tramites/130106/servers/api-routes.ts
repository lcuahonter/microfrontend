/**
 * Conjunto de rutas de la API para el procedimiento 130106.
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
 * Catálogo de la API
 */
const CATALOGO = ENVIRONMENT.CATALOGO_URL;
/**
 * versión de la API
 */
const API_VERSION = ENVIRONMENT.API_VERSION;
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
const PROCEDURE = '/sat-t130106';

/**
 * Rutas de la API para el procedimiento 130106.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */
export const PROC_130106 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
    CONSULTA_SOLICITUDE: (id: string | number): string =>`${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    OPINIONES: (numFolioTramite: string | number): string =>`${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,
}

