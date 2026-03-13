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
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t110221';
export const API_POST_SOLICITUD = 'sat-t110221/solicitud/guardar';

/**
 * Rutas de la API para el procedimiento 110223.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */
export const PROC_110221 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    TIPO_FACTURA: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/tipo-factura`,
    ENTIDAD_FEDERATIVA: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/entidades-federativas`,
    REPRESENTACION_FEDERAL: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/representacion-federal/MEX`, 
    BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-mercancias`,
    AGREGAR_PRODUCTOR: `${BASE_URL}${API}${PROCEDURE}/solicitud/agregar-productor`,
    BUSCAR_PRODUCTOR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-productor?rfcSolicitante=AAL0409235E6`,
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
     API_POST_CADENA_ORIGINAL : (IDSOLICITUD: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/genera-cadena-original`,
    API_POST_FIRMA : (IDSOLICITUD: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/firmar`,
  MOSTRAR: (id: string | number): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=${id}`,

}
