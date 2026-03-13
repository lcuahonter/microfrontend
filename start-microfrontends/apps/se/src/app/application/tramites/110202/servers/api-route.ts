/**
 * Conjunto de rutas de la API para el procedimiento 110202.
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
const PROCEDURE = '/sat-t110202';

/** Número de procedimiento
 */
const PROCEDURE_NO = '110202';

/**
 * Rutas de la API para el procedimiento 110202
 */
export const API_ROUTES = (procedure: string=PROCEDURE, procedureNo: string = PROCEDURE_NO) => ({
    IDIOMA: `${BASE_URL}${API}/${procedure}${CATALOGO}/idioma`,
    ENTIDAD_FEDERATIVA: `${BASE_URL}${API}/${procedure}${CATALOGO}/entidades-federativas`,
    REPRESENTACION_FEDERAL: `${BASE_URL}${API}/${procedure}${CATALOGO}/representacion-federal/MEX`,
    PAIS: `${BASE_URL}${API}/${procedure}${CATALOGO}/paises`,
    ActividadProductiva: `${BASE_URL}${API}/${procedure}${CATALOGO}/actividad-productiva-prosec`,
    RepresentacionFederal: `${BASE_URL}${API}/${procedure}${CATALOGO}/representacion-federal`,
    TipoDocumento: `${BASE_URL}${API}/${procedure}${CATALOGO}/tipo-documento/${procedureNo}`,
    municipiosMax: `${BASE_URL}${API}/${procedure}${CATALOGO}/municipio-mex`,
    tipoCategoria: `${BASE_URL}${API}/${procedure}${CATALOGO}/tipo-categoria`,
    servicoImex: `${BASE_URL}${API}/${procedure}${CATALOGO}/servicios-immex`,
    tipoInversion: `${BASE_URL}${API}/${procedure}${CATALOGO}/tipo-inversion`,
    estadoImex: `${BASE_URL}${API}/${procedure}${CATALOGO}/representacion-federal`,
    GET_FORM_DATA: `${BASE_URL}${API}${API_VERSION}${PROCEDURE}${SOLICITUD}/acuse`,
    BUSCAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-mercancias`,
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    MOSTRAR: (id: string | number): string => `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=${id}`,
});
