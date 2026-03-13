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
const PROCEDURE = '/sat-t80102';

/**
 * Rutas de la API para el procedimiento 80102
 */
export const PROC_80102 = {
    ESTADO: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${CATALOGO}/estado`,
    PAIS: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/paises`,
    NICO: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${CATALOGO}/nico`,
    POST_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/guardar`,
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
    CONSULTA_SOLICITUDE: (id: string | number) : string => `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    OPINIONES: (numFolioTramite: string | number): string => `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    servicoImex: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/servicios-immex`,
    MOSTRAR: (id: string | number): string => `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/mostar?idSolicitud=${id}`,

};
