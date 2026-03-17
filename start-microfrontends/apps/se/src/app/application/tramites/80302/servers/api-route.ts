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

/**
 * Solicitud de la API
 */
const SOLICITUD = ENVIRONMENT.SOLICITUD_URL;

/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t80302';

/**
 * Rutas de la API para el procedimiento 80302
 */
export const PROC_80302 = {
    BUSCAR_SOCIO_ACCIONISTA : `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-socio-accionista`,
    BUSCAR_NOTARIOS : `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-notarios-consulta`,
    OPERACION_IMMEX : `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-plantas`,
    ANEXO_EXPORTACION : `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-productos-exportacion`,
    ANEXO_IMPORTACION : `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-mercancias-importacion`,
    BITACORA : `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consultar-bitacora-immex`,
    BUSCAR_PLANTAS : `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/plantas`,
    UPDATE_PLANTAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/plantas-actualizar-grid`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,
    CERTIFICACION_SAT: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-datos-certificacion-sat`,
    OBTENER_SOLICITUD: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consultas-busca-id-solicitud`,
    LISTA_PROGRAMAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-programasa-modificar`,
    MOSTRAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/mostrar`,
};
