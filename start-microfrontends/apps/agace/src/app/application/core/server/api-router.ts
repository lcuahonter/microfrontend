
/**
 * API para obtener las fracciones arancelarias activas
 */
export const CATALOGO_FRACCIONES_ARANCELARIAS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/fracciones-arancelarias`;

/**
 * API para obtener las entidades federativas 
 */
export const CATALOGO_ENTIDADES_FEDERATIVAS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/entidades-federativas`;

/**
 * API para obtener las alcaldías o municipios por clave de entidad federativa * 
 */
export const CATALOGO_ALCALDIA = (TRAMITE: string, CLAVE: string) : string => `sat-t${TRAMITE}/catalogo/entidad-federativa/${CLAVE}/municipios-delegaciones`;

/*
 * API para obtener las colonias por clave de municipio
 */
export const CATALOGO_COLONIAS = (TRAMITE: string, CLAVE: string) : string => `sat-t${TRAMITE}/catalogo/municipio-delegacion/${CLAVE}/colonias`;

/*
 * API para obtener guardar la solicitud y generar folio
 */
export const GUARDA_SOLICITUD = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/guardar`;

/**
 * API  para obtener el catálogo de cdocumentos obligatorios, según el trámite.
 * @param TRAMITE el trámite seleccionado por el usuario.
 * 
 */
export const API_GET_DOCUMENTOS_OBLIGATORIOS = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/documentos`;

/**
 * API  para obtener el catálogo de cdocumentos obligatorios, según el trámite.
 * @param IDSOLICITUD el trámite seleccionado por el usuario.
 * 
 */
export const API_GET_DETALLE_DOCUMENTOS = (IDSOLICITUD: string) : string => `tramite/documento-solicitud/solicitud/${IDSOLICITUD}/estado/por-atender`;

/**
 * API para generar la cadena del tramite AGACE.
 * 
 */
export const API_POST_CADENA_ORIGINAL = (IDSOLICITUD: string, TRAMITE: number): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/genera-cadena-original`;

/**
 * API para firmar la solicitud del tramite AGACE.
 * 
 */
export const API_POST_FIRMA = (IDSOLICITUD: string, TRAMITE: number): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/firmar`;
 
 
/**
 * API para guardar el acuse de una solicitud.
 * 
 */
export const API_POST_GUARDAR_ACUSE = (IDSOLICITUD: string, TRAMITE: number): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/acuse/guardar`;

/**
 * API para guardar el recibo oficial de una solicitud.
 * @param IDSOLICITUD Identificador de la solicitud
 * @param TRAMITE Número de procedimiento
 * @returns URL del endpoint para guardar el recibo oficial
 *  
 */
export const API_POST_GUARDAR_CERTIFICADO = (IDSOLICITUD: string, TRAMITE: number): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/constancia/guardar`;

/**
 * API para guardar el certificado de una solicitud para AGACE.
 * @param idSolicitud Identificador de la solicitud
 * @param tramite Número de procedimiento
 * @returns URL del endpoint para guardar el certificado * 
 */
export const API_POST_VISTA_PREVIA_CERTIFICADO = (IDSOLICITUD: string, TRAMITE: number): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/constancia/vista-previa`;

/**
 * API para generar la vista previa del acuse de una solicitud. * 
 */
export const API_POST_VISTA_PREVIA = (IDSOLICITUD: string, TRAMITE: number): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/acuse/vista-previa`;


/**
 * API para obtener los meses.
 * @param tramite tramite ID del trámite.
 * @returns url de la API para obtener los meses.
 */
export const API_GET_MESES = (tramite: number): string =>
  `sat-t${tramite}/catalogo/meses`;

export const API_GET_ANIO = (tramite: number): string =>
  `sat-t${tramite}/catalogo/anios`;

export const API_GET_ESTADOS = (tramite: number): string =>
  `sat-t${tramite}/catalogo/estados`;

export const API_GET_MUNICIPIOS = (
  tramite: number,
  cveEstado: string
): string =>
  `sat-t${tramite}/catalogo/entidad-federativa/${cveEstado}/municipios`;



export const API_GET_FRACCION_ARANCELARIA = (tramite: number): string =>
  `sat-t${tramite}/catalogo/fraccion-arancelaria`;

export const API_GET_ADACE = (tramite: number, claveEstado: string): string =>
  `sat-t${tramite}/solicitud/claveEntidad/${claveEstado}/adace`;

export const API_GET_UNIDAD_MEDIDA = (tramite: number): string =>
  `sat-t${tramite}/catalogo/unidades-medida`;

/**
 * Url para obtener la plantilla del trámite.
 * @param tramite tramite ID del trámite.
 * @returns url de la API para obtener la plantilla.
 */
export const API_GET_PLANTILLA = (tramite: number): string =>
  `sat-t${tramite}/documento/plantilla`;


/**
 * Endpoint para el guardado masivo de solicitudes.
 * @param tramite ID del trámite.
 * @returns Endpoint de la API para el guardado masivo de solicitudes.
 */
export const API_POST_MASIVO = (tramite: number): string =>
  `sat-t${tramite}/solicitud/guardar-masiva`;


/**
 * API para obtener las aduanass activas.
 */
export const CATALOGO_ADUANAS_ACTIVAS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/aduanas-vigentes`;

/**
 * API para consultar estatus del trámite para montaje.
 */
export const API_ESTATUS_TRAMITE = (TRAMITE: string, NUM_TRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUM_TRAMITE}/estatus`;

/**
 * API para consultar catálogo de reglas asociadas a fracciones arancelarias.
 */
export const API_FRACCION_REGLA = (TRAMITE: string) : string => `sat-t${TRAMITE}/enumD`;

/**
 * API para consultar catálogo de reglas asociadas a fracciones arancelarias.
 */
export const API_TRAMITE_DECLARACION = (TRAMITE: string) : string => `sat-t${TRAMITE}/tipo-tramite/declaraciones`;
