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
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t130104';

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
 * Rutas de la API para el procedimiento PROC_130104
 */
export const PROC_130104 = {
    /** Ruta para obtener los datos del formulario */
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
    /** Ruta para buscar mercancías */
    BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-mercancias`,
    /** Ruta para guardar los datos del formulario */
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    /** Ruta para mostrar las partidas de la solicitud */
    MOSTAR : `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=`,
    TIPO_FACTURA: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/tipo-factura`,
    /** Ruta para consultar una solicitud por ID */
    CONSULTA_SOLICITUDE: (id: string | number) : string => 
        `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    /** Ruta para obtener opiniones de un trámite */
    OPINIONES: (numFolioTramite: string | number): string => 
        `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/${numFolioTramite}/opiniones`,
    /** Ruta para mostrar las partidas de la solicitud */
    MOSTAR_PARTIDAS : `${BASE_URL}${API}${PROCEDURE}/solicitud/mostar/partidas?idSolicitud=`
};

/*
 * API para guardar la solicitud del tramite 130104.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130104/swagger-ui/index.html#/Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t130104/solicitud/guardar';

/**
 * Ruta de la API para buscar productores exportador por RFC del solicitante.
 * @param rfc RFC del solicitante a consultar.
 * @returns {string} URL para la consulta de productores exportador.
 */
export const BUSCAR_PRODUCTOR = (rfc: string): string =>
  `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-productor?rfcSolicitante=${rfc}`;
