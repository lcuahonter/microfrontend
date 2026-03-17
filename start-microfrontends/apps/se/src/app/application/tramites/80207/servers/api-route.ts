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
const PROCEDURE = '/sat-t80207';

/**
 * Rutas de la API para el procedimiento 80207
 */
export const PROC_80207 = {
    ESTADO: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/estado`,
    PAIS: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/pais`,
    NICO: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/nico`,
    POST_FORM_DATA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,
    GET_FORM_DATA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/acuse`,
    CONSULTA_SOLICITUDE: (id: string | number) : string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    OPINIONES: (numFolioTramite: string | number): string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    API_POST_CADENA_ORIGINAL : (IDSOLICITUD: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/genera-cadena-original`,
    API_POST_FIRMA : (IDSOLICITUD: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/firmar`
};
