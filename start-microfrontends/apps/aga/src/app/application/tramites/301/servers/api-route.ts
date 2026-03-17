/* eslint-disable no-useless-concat */

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
const PROCEDURE = '/sat-t301';

/**
 * Rutas de la API para el procedimiento 301
 */
export const PROC_301 = {
    ESTADO: `${BASE_URL}` + `${API}` + `${API_VERSION}` + `${PROCEDURE}` + `${CATALOGO}` + '/estado',
    PAIS: `${BASE_URL}` + `${API}` + `${API_VERSION}` + `${PROCEDURE}` + `${CATALOGO}` + '/pais',
    NICO: `${BASE_URL}` + `${API}` + `${API_VERSION}` + `${PROCEDURE}` + `${CATALOGO}` + '/nico',
    POST_FORM_DATA: `${BASE_URL}` + `${API}` + `${API_VERSION}` + `${PROCEDURE}` + `${SOLICITUD}` + '/guardar',
    GET_FORM_DATA: `${BASE_URL}` + `${API}` + `${API_VERSION}` + `${PROCEDURE}` + `${SOLICITUD}` + '/acuse',
    CONSULTA_SOLICITUDE: `${BASE_URL}` + `${API}` + `${API_VERSION}` + `${PROCEDURE}` + `${TRAMITE}` + '/consulta' + '/${id}',
    OPINIONES: (numFolioTramite: string | number) => `${BASE_URL}` + `${API}` + `${API_VERSION}` + `${PROCEDURE}` + `${TRAMITE}` + `/${numFolioTramite}/opiniones`
};
