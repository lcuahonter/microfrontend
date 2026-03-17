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
const PROCEDURE = '/sat-t80202';

/**
 * Rutas de la API para el procedimiento 80202
 */
export const PROC_80202 = {

    NICO: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/nicos/producto-exportacion/72162101`,

    POST_FORM_DATA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,
    GET_FORM_DATA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/acuse`,
    CONSULTA_SOLICITUDE: (id: string | number): string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    OPINIONES: (numFolioTramite: string | number): string => `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    API_POST_CADENA_ORIGINAL: (IDSOLICITUD: string): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/genera-cadena-original`,
    API_POST_FIRMA: (IDSOLICITUD: string): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/firmar`
};

/**
 * API para obtener el certificado de antigüedad máxima del tramite 80202.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80202/swagger-ui/index.html#/Registro-Solicitud/certif…
 */
export const API_GET_CERTIFICADO_ANTIGUEDAD = `sat-t80202/certificado/antiguedad-maxima`;

/**
 * API para obtener los molinos de acero habilitados.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80202/swagger-ui/index.html#/Registro-Solicitud/habili…
 */
export const API_GET_MOLINOS_ACERO_HABILITAR = (CVEFRACCION: string): string => `sat-t80202/fraccion-arancelaria/${CVEFRACCION}/molinos-acero/habilitar`;

/**
 * API para guardar la solicitud del tramite 80202.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80202/swagger-ui/index.html#/Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t80202/solicitud/guardar';

