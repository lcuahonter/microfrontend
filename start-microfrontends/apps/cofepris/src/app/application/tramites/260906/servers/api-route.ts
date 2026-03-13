/**
 * Conjunto de rutas de la API para el procedimiento 260906.
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
const PROCEDURE = '/sat-t260906';

/**
 * API para guardar la solicitud del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t260906/solicitud/guardar';

/**
 * Rutas de la API para el procedimiento 110201
 */
export const PROC_260906 = {
  GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
  BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar`,
  GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
  TIPO_FACTURA: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/tipo-factura`,
  CONSULTA_SOLICITUDE: (id: string | number): string =>
    `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
  OPINIONES: (numFolioTramite: string | number): string =>
    `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,
  AGREGAR_PRODUCTOR: `${BASE_URL}${API}${PROCEDURE}/solicitud/agregar-productor`,
};

/**
 * Ruta de la API para buscar productores exportador por RFC del solicitante.
 * @param rfc RFC del solicitante a consultar.
 * @returns {string} URL para la consulta de productores exportador.
 */
export const BUSCAR_PRODUCTOR = (rfc: string): string =>
  `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-productor?rfcSolicitante=${rfc}`;
