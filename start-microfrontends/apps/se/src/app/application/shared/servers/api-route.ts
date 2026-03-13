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
/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t80101';

const PROCEDURE_NO = '80101';

/**
 * Rutas de la API para el procedimiento 80101
 */
export const API_ROUTES = (procedure: string=PROCEDURE, procedureNo: string = PROCEDURE_NO) => ({
    ESTADO: `${BASE_URL}${API}/${procedure}${CATALOGO}/estados`,
    PAIS: `${BASE_URL}${API}/${procedure}${CATALOGO}/paises`,
    ActividadProductiva: `${BASE_URL}${API}/${procedure}${CATALOGO}/actividad-productiva-prosec`,
    CatalogoEnumAPI: `${BASE_URL}${API}${CATALOGO}/enumH`,
    layoutArchivo: (layoutId: number) => `${BASE_URL}${API}/${procedure}${SOLICITUD}/layout/${layoutId}/archivo`,
    uploadCapacidad: `${BASE_URL}${API}/${procedure}${SOLICITUD}/upload-capacidad`,
    RepresentacionFederal: `${BASE_URL}${API}/${procedure}${CATALOGO}/representacion-federal`,
    TipoDocumento: `${BASE_URL}${API}/${procedure}${CATALOGO}/tipo-documento/${procedureNo}`,
    municipiosMax: `${BASE_URL}${API}/${procedure}${CATALOGO}/municipio-mex`,
    tipoCategoria: `${BASE_URL}${API}/${procedure}${CATALOGO}/tipo-categoria`,
    servicoImex: `${BASE_URL}${API}/${procedure}${CATALOGO}/servicios-immex`,
    tipoInversion: `${BASE_URL}${API}/${procedure}${CATALOGO}/tipo-inversion`,
    estadoImex: `${BASE_URL}${API}/${procedure}${CATALOGO}/representacion-federal`,
    buscarPlantas: `${BASE_URL}${API}${procedure}${SOLICITUD}/empresas-submanufactureras/buscar-datos-grid-plantas`,
    buscarControldasPlantas: `${BASE_URL}${API}${procedure}${SOLICITUD}/empresas-controladas/buscar-datos-grid-plantas-controladoras`,
    buscarTerciarizadasPlantas: `${BASE_URL}${API}${procedure}${SOLICITUD}/empresas-terciarizadas/buscar-datos-grid-plantas`,
    buscarPlantasImmex: `${BASE_URL}${API}${procedure}${SOLICITUD}/federatarios-y-plantas/estado`,
    tratadosAcuerdos: (countryCode: string) => `${BASE_URL}${API}/${procedure}${CATALOGO}/${countryCode}/tratados-acuerdos`,
    buscarPermisoImmex: `${BASE_URL}${API}${procedure}${SOLICITUD}/agregar-anexo-premiso`,
    paisesBloques:`${BASE_URL}${API}/${procedure}${CATALOGO}/paises/bloques`,
    buscarFraccionArancelaria: `${BASE_URL}${API}${procedure}${SOLICITUD}/anexo-uno/fraccion-arancelaria/exportacion`,
    buscarfraccionArancelaria: `${BASE_URL}${API}${procedure}${SOLICITUD}/anexo-uno/fraccion-arancelaria/exportacion`,
    buscarfraccionarancelariaImportacion: `${BASE_URL}${API}${procedure}${SOLICITUD}/anexo-uno/fraccion-arancelaria/importacion`,
    buscarSectoresImmex: `${BASE_URL}${API}${procedure}${SOLICITUD}/actividad-tres-rs/sectores-immex`,
    certificadoDisponsible: `${BASE_URL}${API}${procedure}${SOLICITUD}/mostrar/certificados`,
    guardarCertificadoDisponsible: `${BASE_URL}${API}${procedure}${SOLICITUD}/guardar`,
    generaCadena:(solicitudId:number) => `${BASE_URL}${API}${procedure}${SOLICITUD}/${solicitudId}/genera-cadena-original`,
    certificadoOrigen:(solicitudId:number) => `${BASE_URL}${API}${procedure}${SOLICITUD}/${solicitudId}/obtener-certificado-origen`,
    buscarDomicilios: `${BASE_URL}${API}${procedure}${SOLICITUD}/buscar-domicilios`,
    sectoresDatos:(sectorClave:string): string => `${BASE_URL}${API}${procedure}${SOLICITUD}/buscar-sectores/${sectorClave}`,
    buscarSectorFraccionArancelaria: `${BASE_URL}${API}${procedure}${SOLICITUD}/buscar-fraccion-arancelaria`,
    mostrar110210Datos: `${BASE_URL}${API}${procedure}${SOLICITUD}/mostrar`,
    //datosProdocto:`${BASE_URL}${API}/${procedure}${CATALOGO}/fraccion-arancelaria-producto-terminado/29242999`,
    razonsocial:(rfc:string): string => `${BASE_URL}${API}/${procedure}${SOLICITUD}/complementos/representante?rfc=${rfc}`,
    datosProdocto: (fraccion: string) => `${BASE_URL}${API}/${procedure}${CATALOGO}/fraccion-arancelaria-producto-terminado/${fraccion}`,
    abrirRazonSocial: (rfc:string): string => `${BASE_URL}${API}${procedure}${SOLICITUD}/complementos/representante?rfc=${rfc}`,
    anexoTresFraccionArancelaria: `${BASE_URL}${API}${procedure}${SOLICITUD}/anexo-tres/fraccion-arancelaria`,
    anexoDosFraccionArancelaria: `${BASE_URL}${API}${procedure}${SOLICITUD}/anexo-dos/fraccion-arancelaria`,
    fraccionArancelariaExportacion: `${BASE_URL}${API}/${procedure}${SOLICITUD}/anexo-uno/fraccion-arancelaria/exportacion`,
    fraccionArancelariaImportacion: `${BASE_URL}${API}/${procedure}${SOLICITUD}/anexo-uno/fraccion-arancelaria/importacion`,
    TipoDocImmex:`${BASE_URL}${API}/${procedure}${CATALOGO}/enumH/ENU_TIPO_DOC_PROY_IMMEX`,
    /**
     * Endpoint para buscar información de una planta específica dentro del sistema.
     *
     * Construye la URL utilizando BASE_URL, API, procedure y SOLICITUD,
     * y accede al recurso `/buscar-planta` para obtener los datos asociados.
     *
     * @constant {string} buscarPlanta - URL completa del servicio de búsqueda de planta.
     */
    buscarPlanta:`${BASE_URL}${API}${procedure}${SOLICITUD}/buscar-planta`,
        /**
         * Construye la URL para obtener la representación federal.
         * @param idSolicitud
         * @param idProgramaAutorizado
         * @param fechaProsec
         * @returns La URL completa para la operación de obtener representación federal.
         */
        obtenerRepresentacionFederal: (idSolicitud: string, idProgramaAutorizado: string, fechaProsec: string): string =>
            `${BASE_URL}${API}${procedure}${SOLICITUD}/consulta/obtener-representacion-federal?idSolicitud=${idSolicitud}&idProgramaAutorizado=${idProgramaAutorizado}&fechaProsec=${fechaProsec}`,
        /**
         * Construye la URL para obtener la descripción de la actividad productiva.
         * @param idSolicitud
         * @param idProgramaAutorizado
         * @returns La URL completa para la operación de obtener descripción de actividad productiva.
         */
        obtenerActividadProductiva: (idSolicitud: string, idProgramaAutorizado: string): string =>
            `${BASE_URL}${API}${procedure}${SOLICITUD}/consulta/obtener-descripcion-actividad-productiva?idSolicitud=${idSolicitud}&idProgramaAutorizado=${idProgramaAutorizado}`,
    buscarProductorIndirecto:(rfc:string): string => `${BASE_URL}${API}${procedure}${SOLICITUD}/buscar-productor-indirecto/${rfc}`,
    buscarProductoresIndirecto: `${BASE_URL}${API}${procedure}${SOLICITUD}/buscar-productores-indirecto`,
});


/**
 * Genera la ruta de la API para consultar los datos de cupo en el grid, según el trámite especificado.
 *
 * @param TRAMITE - Identificador del trámite a utilizar en la ruta.
 * @returns La ruta de la API como cadena de texto.
 */
export const BUSCAR_CONSULTAR = (TRAMITE: string): string => `sat-t${TRAMITE}/${SOLICITUD}/consultar-cupo/buscar-datos-grid`;

/**
 * Construye la URL para guardar una solicitud asociada a un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite para el cual se va a guardar la solicitud.
 * @returns La URL completa para la operación de guardar solicitud del trámite dado.
 */
export const GUARDAR = (TRAMITE: string): string => `${BASE_URL}${API}/${TRAMITE}/solicitud/guardar`;

/**
 * Construye la URL para buscar instrumentos asociados a un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite para el cual se desean buscar los instrumentos.
 * @returns La URL completa como cadena de texto para realizar la búsqueda de instrumentos.
 */
export const BUSCAR_INSTRUMENTOS = (TRAMITE: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/buscarInstrumentos`;

/**
 * Construye la URL para buscar una asignación en el sistema SAT.
 *
 * @param TRAMITE - Identificador del trámite a consultar.
 * @param urlPram - Objeto que contiene los parámetros de búsqueda:
 *   - rfcSolicitante: RFC del solicitante.
 *   - numFolioAsignacion: Número de folio de la asignación.
 *   - anioAutorizacion: Año de autorización de la asignación.
 * @returns La URL completa como cadena de texto para realizar la consulta de asignación.
 */
export const BUSCAR_ASIGNACION = (TRAMITE: string,urlPram:any): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/buscar-asignacion?rfcSolicitante=${urlPram.rfcSolicitante}&numFolioAsignacion=${urlPram.numFolioAsignacion}&anioAutorizacion=${urlPram.anioAutorizacion}`;

/**
 * Construye la ruta de la API para guardar una solicitud de trámite específico.
 *
 * @param TRAMITE - Identificador del trámite para el cual se va a guardar la solicitud.
 * @returns La URL completa para la operación de guardar solicitud del trámite.
 */
export const GUARDAR_API = (TRAMITE: string): string => `${BASE_URL}${API}/${TRAMITE}/solicitud/guardar`;

/**
 * Construye la ruta de la API para buscar y obtener datos de asignación de una solicitud específica.
 *
 * @param TRAMITE - Identificador del trámite para el cual se desea obtener los datos de asignación.
 * @returns La URL completa como cadena de texto para realizar la consulta en la API.
 */
export const BUSCAR_ASIGNACION_DATOS = (TRAMITE: string): string => `${BASE_URL}${API}/sat-t${TRAMITE}${SOLICITUD}/buscar-obtener-datos-asignacion`;

/**
 * Construye la URL para guardar parcialmente una solicitud de trámite.
 *
 * @param TRAMITE - Identificador del trámite para el cual se va a guardar la solicitud parcial.
 * @returns La URL completa para la API que permite guardar la solicitud parcial del trámite especificado.
 */
export const GUARDAR_PARTIAL_API = (TRAMITE: string): string => `${BASE_URL}${API}/${TRAMITE}/solicitud/guardarSolicitudParcial`;

/**
 * Construye la URL para obtener el detalle de una solicitud específica.
 *
 * @param TRAMITE - Identificador del trámite para el cual se desea mostrar el detalle.
 * @returns La URL completa para acceder al endpoint de mostrar detalle de la solicitud.
 */
export const MOSTAR_DETALE_API = (TRAMITE: string): string => `${BASE_URL}${API}/${TRAMITE}/solicitud/mostrarDetalle`;

/**
 * Construye la URL para mostrar una solicitud específica en el API.
 *
 * @param TRAMITE - El nombre o identificador del trámite.
 * @param idSolicitud - El identificador numérico de la solicitud a mostrar.
 * @returns La URL completa como cadena de texto para acceder a la solicitud.
 */
export const MOSTAR_API = (TRAMITE: string,idSolicitud:string | null): string => `${BASE_URL}${API}/${TRAMITE}/solicitud/mostrar?idSolicitud=${idSolicitud}`;

/**
 * Construye la URL para iniciar la evaluación de una opinión en un trámite específico.
 * @param TRAMITE - Identificador del trámite.
 * @param FILO_NUMBER - Número de folio de la solicitud.
 * @returns La URL completa para iniciar la evaluación de la opinión.
 */
export const API_GET_OPINION_EVALUAR_INICIAR = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILO_NUMBER}/solicitar/opinion/mostrar`;

