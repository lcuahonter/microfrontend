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
const PROCEDURE = '/sat-t120501';

/**
 * Rutas de la API para el procedimiento 110207
 */
export const PROC_120501 = {
    /** Obtiene datos precargados del trámite. */
    PREFILLED: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}`,
    /** Busca información relacionada con la solicitud. */
    BUSCAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar`,
    /** Consulta información del RFC asociado al trámite. */
    FETCH_RFC: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}`,
     /** Obtiene los datos del formulario para generar el acuse. */
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
    /** Guarda la información de la solicitud. */
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,
    /** Muestra los datos de una solicitud específica. */
    MOSTRAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/mostrar`,
     /** Consulta una solicitud específica por su identificador. */
    CONSULTA_SOLICITUDE: (id: string | number) : string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
     /** Obtiene las opiniones asociadas al folio del trámite. */
    OPINIONES: (numFolioTramite: string | number): string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`
};
/**
 *  Genera la ruta de la API para habilitar molinos de acero según la fracción arancelaria.
 * @param CVEFRACCION  - La clave de la fracción arancelaria.
 * @returns  La ruta completa de la API como una cadena de texto.
 */
export const API_GET_MOLINOS_ACERO_HABILITAR = (CVEFRACCION: string): string => `sat-t80202/fraccion-arancelaria/${CVEFRACCION}/molinos-acero/habilitar`;
