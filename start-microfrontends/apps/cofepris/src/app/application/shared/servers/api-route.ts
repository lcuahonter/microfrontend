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
 * Trámite de la API
 */
const TRAMITE = ENVIRONMENT.TRAMITE_URL;


/*
 * API para obtener el catálogo de clasificación toxicologica
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/clasificacion-toxicologica
 */
export const CATALOGO_CLASIFICACION_TOXICOLOGICA = (TRAMITE: string): string => `sat-t${TRAMITE}${CATALOGO}/clasificacion-toxicologica/${TRAMITE}`;

/*
 * API para obtener el catálogo de clasificación toxicologica
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/clasificacion-toxicologica
 */
export const CATALOGO_OBJETO_IMPORTACION = (TRAMITE: string): string => `sat-t${TRAMITE}${CATALOGO}/objetoImportacion`;

/*
 * API para buscar el representante legal por RFC
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260501/solicitud/buscar
 */
export const RFC_BUSCAR_REPRESENTANTE_LEGAL = (TRAMITE: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/buscar`;

/*
 * API para obtener la descripción de una fracción arancelaria
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260501/solicitud/fraccion-descripcion?clave=01012101&idTipoTramite=260501
 */
export const FRACCION_DESCRIPCION = (clave: string, idTipoTramite: string): string => `${BASE_URL}${API}/sat-t${idTipoTramite}${SOLICITUD}/fraccion-descripcion?clave=${clave}&idTipoTramite=${idTipoTramite}`;

/*
 * API para obtener la unidad de medida de una fracción arancelaria
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260501/solicitud/unidad-medida?cveFraccion=01012101
 */
export const UNIDAD_MEDIDA = (cveFraccion: string, idTipoTramite: string): string => `${BASE_URL}${API}/sat-t${idTipoTramite}${SOLICITUD}/unidad-medida?cveFraccion=${cveFraccion}`;

/*
 * API para guardar la solicitud
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260501/solicitud/guardar
 */
export const GUARDAR_SOLICITUD = (TRAMITE: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/guardar`;

/*
 * API para obtener la CURP
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260501/solicitud/buscar/curp?curp=XXXX010101HDFRRN09
 */
export const OBTENER_CURP = (TRAMITE: string,curp: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/buscar/curp?curp=${curp}`;

/**
 * Construye la URL para buscar una solicitud específica de trámite.
 *
 * @param TRAMITE - El identificador del trámite a consultar.
 * @returns La URL completa para realizar la búsqueda del trámite especificado.
 */
export const BUSCAR = (TRAMITE: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/buscar`;

/**
 * Genera la URL para la API que permite guardar una solicitud de trámite.
 *
 * @param TRAMITE - Identificador del trámite a utilizar en la ruta de la API.
 * @returns La URL completa para la operación de guardar la solicitud del trámite especificado.
 */
export const GUARDAR_API = (TRAMITE: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/guardar`;



/**
 * Construye la URL para mostrar una solicitud específica en el API.
 *
 * @param TRAMITE - El nombre o identificador del trámite.
 * @param idSolicitud - El identificador numérico de la solicitud a mostrar.
 * @returns La URL completa como cadena de texto para acceder a la solicitud.
 */
export const MOSTAR_API = (TRAMITE: string,idSolicitud:string | null): string => `${BASE_URL}${API}/${TRAMITE}/solicitud/mostrar?idSolicitud=${idSolicitud}`;

/**
 * Construye la URL para obtener los trámites asociados a una solicitud específica.
 *
 * @param TRAMITE - El identificador del trámite principal.
 * @param folioTramite - El folio del trámite asociado, puede ser nulo.
 * @returns La URL completa para consultar los trámites asociados usando el folio proporcionado.
 */
export const TRAMITES_ASOCIADOS = (TRAMITE: string,folioTramite:string | null): string => `${BASE_URL}${API}/${TRAMITE}/solicitud/tramites-asociados?folio=${folioTramite}`;
/*
 * API para mostrar la solicitud
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260501/solicitud/mostrar?idSolicitud=12345
 */
export const MOSTRAR = (TRAMITE: string, idSolicitud: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/mostrar?idSolicitud=${idSolicitud}`;
