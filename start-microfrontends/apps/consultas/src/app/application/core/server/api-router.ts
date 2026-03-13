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
 * idDocumento de la solicitud que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el idDocumento real de la solicitud.
 */
export const IDDOCUMENTO = '{idDocumento}';

/**
 * API para ejemplo
 * @see https://api-v30.cloud-ultrasist.net/api/ejemplo/swagger-ui/index.html
 */
export const API_GET_EJEMPLO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `consultas/iniciar`;

/**
 * API para obtener documentos digitalizados.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Consulta-Solicitud/consulta-documentos-digitalizados
 */
export const API_POST_CONSULTA_DOC_DIGITALIZACION= `sat-t701/consulta/documentos-digitalizados`;

/**
 * API para mostrar acuse.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Consulta-Solicitud/mostrar-acuse-e-documento
*/
export const API_MOSTRAR_ACUSE = (IDDOCUMENTO: string): string => `sat-t701/consulta/mostrar-acuse/${IDDOCUMENTO}`;

/**
 * API para generar excel de documentos digitalizados.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Consulta-Solicitud/generar-excel
 */
export const API_POST_EXCEL_DOC_DIGITALIZACION= `sat-t701/consulta/documentos-digitalizados/reporte`;