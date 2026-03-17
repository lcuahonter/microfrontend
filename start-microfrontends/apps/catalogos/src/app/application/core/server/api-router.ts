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
 * API para ejemplo
 * @see https://api-v30.cloud-ultrasist.net/api/ejemplo/swagger-ui/index.html
 */
export const API_GET_EJEMPLO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `catalogos/iniciar`;