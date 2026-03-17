import { ENVIRONMENT } from "../../../environments/environment";
/**
 * URLs de API comunes
 */
export const COMUN_URL = {
  BASE_URL: `${ENVIRONMENT.URL_SERVER}`,
  API: '/api',
  API_VERSION: '/v3',
  CATALOGO_URL: '/catalogo',
  SOLICITUD_URL: '/solicitud',
  TRAMITE_URL: '/tramite',
};
/**
 * Endpoint para obtener el catálogo de formas
 * asociado a un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_CATALOGO_FORMAS = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/catalogo/formas`;
/**
 * Endpoint to get catalog of types by coffee shape (forma).
 *
 * @param TRAMITE - Trámite identifier.
 * @param claveForma - Coffee shape key (e.g. FORCFE.012).
 * @returns Full API route.
 */
export const API_GET_CATALOGO_TIPOS_POR_FORMA = (TRAMITE: string,claveForma: string): string => `/api/sat-t${TRAMITE}/catalogo/tipos?claveForma=${claveForma}`;
/**
 * Endpoint to get quality catalog by coffee type.
 *
 * @param TRAMITE - Trámite identifier.
 * @param claveTipos - Coffee type key (e.g. TIPCFE.001).
 * @returns Full API route.
 */
export const API_GET_CATALOGO_CALIDAD_POR_TIPO = (TRAMITE: string,claveTipos: string): string =>`/api/sat-t${TRAMITE}/catalogo/calidad?claveTipos=${claveTipos}`;
/**
 * Endpoint to get process catalog by coffee quality.
 *
 * @param TRAMITE - Trámite identifier.
 * @param claveCalidad - Coffee quality key (e.g. CALCFE.002).
 * @returns Full API route.
 */
export const API_GET_CATALOGO_PROCESOS_POR_CALIDAD = ( TRAMITE: string,claveCalidad: string): string =>`/api/sat-t${TRAMITE}/catalogo/procesos?claveCalidad=${claveCalidad}`;
/**
 * Endpoint to get certification catalog by coffee process.
 *
 * @param TRAMITE - Trámite identifier.
 * @param claveProcesos - Coffee process key (e.g. PROCFE.005).
 * @returns Full API route.
 */
export const API_GET_CATALOGO_CERTIFICACIONES_POR_PROCESO = ( TRAMITE: string, claveProcesos: string): string =>`/api/sat-t${TRAMITE}/catalogo/certificaciones?claveProcesos=${claveProcesos}`;
/**
 * Endpoint to get the Aduanas catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_ADUANAS = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/aduanas`;
/**
 * Endpoint to get the Paises catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_PAISES = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/paises`;
/**
 * Endpoint to get the Ciclo de Café catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_CICLO_CAFE = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/catalogo/cicloCafe`;
/**
 * Endpoint to get the Entidad catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_ENTIDAD = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/entidad`;
/**
 * Endpoint to get the Envasado catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_ENVASADO = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/envasado`;
/**
 * Endpoint to get the Fracción Arancelaria Amecafe catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_FRACCION_ARANCELARIA_AMECAFE = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/fraccionArancelariaAmecafe`;
/**
 * Endpoint to get the Moneda Sedena catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_MONEDA_SEDENA = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/monedaSedena`;
/**
 * Endpoint to get the Unidad catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_UNIDAD = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/unidad`;
/**
 * Endpoint to get the Transporte catalog.
 *
 * @param TRAMITE - Trámite identifier.
 * @returns Full API route.
 */
export const API_GET_CATALOGO_TRANSPORTE = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/transporte`;
/**
 * Endpoint para obtener las últimas solicitudes por trámite.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_ULTIMAS_SOLICITUDES = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/solicitud/ultimasSolicitudes`;
/**
 * Endpoint para iniciar una solicitud.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta base de la API.
 */
export const API_INICIAR_SOLICITUD = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/solicitud/iniciar`;

/**
 * Endpoint para guardar los datos del trámite de café.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GUARDAR_DATOS_CAFE = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/solicitud/registro/guardar`;

/**
 * Endpoint para firmar el certificado de una solicitud.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_FIRMAR_CERTIFICADO = (TRAMITE: string): string =>
  `/api/sat-t${TRAMITE}/solicitud/certificado/firmar`;

/**
 * Endpoint para generar la cadena original de una solicitud.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param idSolicitud - Identificador de la solicitud.
 * @returns Ruta completa de la API.
 */
export const API_GENERAR_CADENA_ORIGINAL = (
  TRAMITE: string,
  idSolicitud: number | string
): string =>
  `/api/sat-t${TRAMITE}/solicitud/${idSolicitud}/genera-cadena-original`;