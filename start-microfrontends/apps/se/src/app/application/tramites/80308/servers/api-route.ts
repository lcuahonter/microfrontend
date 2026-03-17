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
 * Catálogo de la API
 */
const CATALOGO = ENVIRONMENT.CATALOGO_URL;

/**
 * Solicitud de la API
 */
const SOLICITUD = ENVIRONMENT.SOLICITUD_URL;

/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t80308';

/**
 * Rutas de la API para el procedimiento 80308
 */
export const PROC_80308 = {
    ESTADOS: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/estados`,
    BUSCAR_DOMICILIOS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-domicilios`,
    BUSCAR_ID_SOLICITUD: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consultas-busca-id-solicitud`,
    SOCIO_ACCIONISTA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-socio-accionista`,
    BUSCAR_NOTARIOS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-notarios-consulta`,
    OPERACIONES: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-plantas`,
    SUBMANUFACTURERA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-empresa-submanufacturera`,
    MANUFACTURERA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/plantas-submanufactureras`,
    SERVICIOS_IMMEX: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar/consulta-servicios`,
    CERTIFICACION_SAT: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-datos-certificacion-sat`,
    PRODUCTOS_EXPORTACION: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-productos-exportacion`,
    PRODUCTOS_IMPORTACION: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-mercancias-importacion`,
    FRACCIONES_SENSIBLES: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-fracciones-sensibles`,
    BITACORA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consultar-bitacora-immex`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,
};
