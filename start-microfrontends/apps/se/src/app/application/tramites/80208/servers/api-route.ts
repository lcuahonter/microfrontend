/**
 * Tramite que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const TRAMITE = '{tramite}';

/**
 * API para guardar la solicitud del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t80208/solicitud/guardar';

/**
 * API para iniciar el tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Solicitud/iniciar
 */
export const API_GET_INICIO = 'sat-t80208/registro-solicitud/iniciar';

/**
 * ID de la solicitud que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el ID real de la solicitud.
 */
export const IDSOLICITUD = '{idSolicitud}';

/**
 * API para obtener el estado de la solicitud del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Solicitud/genera-cadena-original_1
 */
export const API_POST_CADENA_ORIGINAL = (IDSOLICITUD: string) : string => `sat-t80208/solicitud/${IDSOLICITUD}/genera-cadena-original`;

/**
 * API para firmar la solicitud del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Registro-Solicitud/firmar
 */
export const API_POST_FIRMA = (IDSOLICITUD: string) : string => `sat-t80208/solicitud/${IDSOLICITUD}/firmar`;

/**
 * API para obtener el certificado de antigüedad máxima del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Registro-Solicitud/certificado-antiguedad-maxima
 */
export const API_GET_CERTIFICADO_ANTIGUEDAD = `sat-t80208/certificado/antiguedad-maxima`;


/**
 * Constante para la clave de fracción arancelaria.
 * Debe ser reemplazada por la clave real de la fracción arancelaria.
 */
export const CVEFRACCION = '{cveFraccion}';

/**
 * API para obtener los molinos de acero habilitados.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Registro-Solicitud/habilitar-molino-acero
 */
export const API_GET_MOLINOS_ACERO_HABILITAR = (CVEFRACCION: string) : string => `sat-t80208/fraccion-arancelaria/${CVEFRACCION}/molinos-acero/habilitar`;

/**
 * API para obtener los molinos de acero activos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Catalogos/consulta-molinos-acero
 */
export const API_GET_MOLINO_ACTIVOS = `sat-t80208/catalogo/molinos-acero`;

/**
 * Constante para el número de folio del tramite.
 * Debe ser reemplazada por el número de folio real del tramite.
 */
export const NUMFOLIOTRAMITE = '{numFolioTramite}';

/**
 * API para obtener evaluar iniciar tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Evaluar-Solicitud/getOpcionesEvaluacion
 */
export const API_GET_EVALUAR_INICIAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/iniciar`;


/**
 * API para prepar evaluacion tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Evaluar-Solicitud/getOpcionesEvaluacion
 */
export const API_GET_EVALUAR_MOSTRAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/mostrar`;

/**
 * ID de la solicitud del dictamen que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el ID real de la solicitud del dictamen.
 */
export const IDSOLICITUDDICTAMEN = '{idSolicitudDictamen}';

/**
 * API para Consultar que tabs mostrar 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Consulta-Solicitud/estado-consulta-solicitud
 */
export const API_GET_TABS = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/tramite/solicitud/${IDSOLICITUD}/estado`;

/**
 * API para Consultar solicitud del tramite 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Consulta-Solicitudes
 */
export const API_GET_CONSULTA_SOLICITUD = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/solicitud/detalle`;

/**
 * ID de la resolucion.
 * Este valor debe ser reemplazado por el ID real de la resolucion.
 */
export const IDRESOLUCION= '{idResolucion}';

/**
 * ID del requerimiento.
 * Este valor debe ser reemplazado por el ID real del requerimiento.
 */
export const IDREQUERIMIENTO= '{idRequerimiento}';

/** 
 * API para consulta de envio digital 80208.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80208/swagger-ui/index.html#/Consulta-Solicitud/get-detalle-estado
 */
export const API_GET_ENVIO_DIGITAL = (NUMFOLIOTRAMITE: string) : string => `tramite/${NUMFOLIOTRAMITE}/envio-digital/detalle`;



