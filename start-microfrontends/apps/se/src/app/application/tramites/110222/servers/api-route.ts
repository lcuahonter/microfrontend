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
const PROCEDURE = '/sat-t110222';

/**
 * Rutas de la API para el procedimiento 110223.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */
export const PROC_110222 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-mercancias`,
    TIPO_FACTURA: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/tipo-factura`,
    BUSCAR_PRODUCTOR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-productor?rfcSolicitante=AAL0409235E6`,
    AGREGAR_PRODUCTOR: `${BASE_URL}${API}${PROCEDURE}/solicitud/agregar-productor`,
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,

    MOSTRAR: (id: string | number): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=${id}`,
    CONSULTA_SOLICITUDE: (id: string | number): string =>`${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    OPINIONES: (numFolioTramite: string | number): string =>`${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,
    API_POST_CADENA_ORIGINAL : (IDSOLICITUD: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/genera-cadena-original`,
    API_POST_FIRMA : (IDSOLICITUD: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/firmar`,
}

export const PRODUCTORS_EXPORTADOR = (rfc: string): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-productor?rfcSolicitante=${rfc}`;
