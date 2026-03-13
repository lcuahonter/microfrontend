/**
 * Conjunto de rutas de la API para el procedimiento 130107.
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
const PROCEDURE = '/sat-t130107';
/**
 * Rutas de la API para el procedimiento 130107
 */
export const PROC_130107 = {
    /** Ruta para obtener el catálogo de representaciones federales */
    REPRESENTACION_FEDERAL_CATALOGO: `${BASE_URL}${API}${PROCEDURE}/representacion-federal/`,

    /** Ruta para obtener los datos del formulario */
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,

    /** Ruta para buscar mercancías */
    BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-mercancias`,

    /** Ruta para guardar los datos del formulario */
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,

    /** Ruta para mostrar las partidas de la solicitud */
    // MOSTAR_PARTIDAS : `${BASE_URL}${API}${PROCEDURE}/solicitud/mostar/partidas?idSolicitud=`,
    MOSTAR_PARTIDAS : `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=`,
    
    /** Ruta para consultar una solicitud por ID */
    CONSULTA_SOLICITUDE: (id: string | number) : string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,

    /** Ruta para obtener opiniones de un trámite */
    OPINIONES: (numFolioTramite: string | number): string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,

    REPRESENTATION_FEDERAL: `${BASE_URL}${API}${PROCEDURE}/catalogo/representacion-federal-entidad/`,
};
