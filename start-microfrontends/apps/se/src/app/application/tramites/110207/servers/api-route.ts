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
const PROCEDURE = '/sat-t110207';

/**
 * Rutas de la API para el procedimiento 110207
 */
export const PROC_110207 = {
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
    BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-mercancias`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    MOSTRAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar`,
    CONSULTA_SOLICITUDE: (id: string | number) : string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    OPINIONES: (numFolioTramite: string | number): string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`
};
