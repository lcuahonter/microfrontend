/**
 * Conjunto de rutas de la API para el procedimiento 150103.
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
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t150103';

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
 * Rutas de la API para el procedimiento PROC_150103
 */
export const PROC_150103 = {
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    CONSULTA_SOLICITUDE: (id: string | number) : string => 
        `${BASE_URL}${API}${PROCEDURE}${TRAMITE}/consulta/${id}`,
    API_POST_CADENA_ORIGINAL : (IDSOLICITUD: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/${IDSOLICITUD}/genera-cadena-original`,
    MOSTRAR: (id: string) : string => `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=${id}`,
};

/*
 * API para guardar la solicitud del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t110223/solicitud/guardar';

/**
 * Ruta de la API para buscar productores exportador por RFC del solicitante.
 * @param rfc RFC del solicitante a consultar.
 * @returns {string} URL para la consulta de productores exportador.
 */
export const BUSCAR_PROGRAMAS = (rfc: string): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-programas?rfc=${rfc}`;

