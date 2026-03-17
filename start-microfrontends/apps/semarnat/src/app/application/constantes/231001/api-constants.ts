/**
 * Constantes de endpoints y claves para el trámite 231001.
 * Provee descripciones JSDoc para mejorar autocompletado y generación de documentación.
 *
 * Notas:
 * - Muchas constantes contienen placeholders como '{tramite}', '{rfc}', '{idSolicitud}', etc.
 *   Estos deben reemplazarse en tiempo de ejecución antes de invocar las rutas reales.
 */

/**
 * Tramite que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const TRAMITE = '{tramite}';

/**
 * API para guardar la solicitud del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t231001/solicitud/guardar';

/**
 * Clave del capítulo de fracción arancelaria.
 * Reemplace '{cveCapituloFraccion}' por la clave real del capítulo al construir la ruta.
 * @constant {string}
 */
export const CVE_CAPITULO_FRACCION = '{cveCapituloFraccion}';

/**
 * Clave de la partida de fracción arancelaria.
 * Reemplace '{cvePartidaFraccion}' por la clave real de la partida al construir la ruta.
 * @constant {string}
 */
export const CVE_PARTIDA_FRACCION = '{cvePartidaFraccion}';

/**
 * Clave de la subpartida de fracción arancelaria.
 * Reemplace '{cveSubpartidaFraccion}' por la clave real de la subpartida al construir la ruta.
 * @constant {string}
 */
export const CVE_SUBPARTIDA_FRACCION = '{cveSubpartidaFraccion}';

/**
 * Identificador del contribuyente (RFC) usado en rutas que requieren el RFC.
 * Reemplace '{rfc}' por el RFC real al construir las rutas en tiempo de ejecución.
 * @constant {string}
 */
export const RFC = '{rfc}';

/**
 * API para obtener las fracciones arancelarias del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-fracciones-arancelarias
 */
export const API_GET_FRACCIONES_ARANCELARIAS =
  'sat-t231001/catalogo/' +
  `capitulo-fraccion/${CVE_CAPITULO_FRACCION}/partida-fraccion/${CVE_PARTIDA_FRACCION}/subpartida-fraccion/${CVE_SUBPARTIDA_FRACCION}/fraccion-arancelaria`;

/**
 * API para obtener los capítulos de fracción del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-capitulos-fraccion
 */
export const API_GET_CAPITULO_FRACCION =
  'sat-t231001/catalogo/capitulo-fraccion';

/**
 * API para obtener las partidas de fracción del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-partidas-fraccion
 */

export const API_GET_PARTIDAS_FRACCION = `sat-t231001/catalogo/capitulo-fraccion/${CVE_CAPITULO_FRACCION}/partida-fraccion`;

/**
 * API para obtener las subpartidas de fracción del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-subpartidas-fraccion
 */
export const API_GET_SUBPARTIDAS_FRACCION = `sat-t231001/catalogo/capitulo-fraccion/${CVE_CAPITULO_FRACCION}/partida-fraccion/${CVE_PARTIDA_FRACCION}/subpartida-fraccion`;

/**
 * API para obtener las unidades de medida del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-unidades-medida-comercial
 */
export const API_GET_UNIDAD_MEDIDA = `sat-t231001/catalogo/unidades-medida-comercial`;

/**
 * Catálogo de aduanas disponibles para el trámite 231001.
 * Utilizar este endpoint para obtener la lista de aduanas habilitadas.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-aduanas
 * @constant {string}
 */
export const GET_ADUANAS = `sat-t231001/catalogo/aduanas`;

/**
 * API para obtener los datos de IMMEX por RFC.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-no-autorizacion-immex
 */

export const API_GET_IMMEX = `sat-t231001/catalogo/rfc/${RFC}/no-autorizacion-immex`;

/**
 * Alias para la ruta que guarda la solicitud del trámite 231001.
 * Equivalente a API_POST_SOLICITUD. Preferir API_POST_SOLICITUD si existe coherencia en el código.
 * @see API_POST_SOLICITUD
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/guardar
 * @constant {string}
 */
export const API_POST_GUARDAR_SOLICITUD = 'sat-t231001/solicitud/guardar';

/**
 * API para iniciar el tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/iniciar
 */
export const API_GET_INICIO = 'sat-t231001/solicitud/iniciar';

/**
 * ID de la solicitud que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el ID real de la solicitud.
 * @constant {string}
 */
export const IDSOLICITUD = '{idSolicitud}';

/**
 * API para obtener el estado de la solicitud del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/genera-cadena-original_1
 */
export const API_POST_CADENA_ORIGINAL = `sat-t231001/solicitud/${IDSOLICITUD}/genera-cadena-original`;

/**
 * API para firmar la solicitud del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/firmar
 */
export const API_POST_FIRMA = `sat-t231001/solicitud/${IDSOLICITUD}/firmar`;

/**
 * API para obtener el certificado de antigüedad máxima del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/certificado-antiguedad-maxima
 */
export const API_GET_CERTIFICADO_ANTIGUEDAD = `sat-t231001/certificado/antiguedad-maxima`;

/**
 * Constante para la clave de fracción arancelaria.
 * Debe ser reemplazada por la clave real de la fracción arancelaria.
 * @constant {string}
 */
export const CVEFRACCION = '{cveFraccion}';

/**
 * API para obtener los molinos de acero habilitados.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/habilitar-molino-acero
 */
export const API_GET_MOLINOS_ACERO_HABILITAR = `sat-t231001/fraccion-arancelaria/${CVEFRACCION}/molinos-acero/habilitar`;

/**
 * API para obtener los molinos de acero activos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-molinos-acero
 */
export const API_GET_MOLINO_ACTIVOS = `sat-t231001/catalogo/molinos-acero`;

/**
 * Constante para el número de folio del tramite.
 * Debe ser reemplazada por el número de folio real del tramite.
 */
export const NUMFOLIOTRAMITE = '{numFolioTramite}';

/**
 * API para obtener evaluar iniciar tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Evaluar-Solicitud/getOpcionesEvaluacion
 */
export const API_GET_EVALUAR_INICIAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/iniciar`;

/**
 * API para obtener las opciones de evaluación del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Evaluar-Solicitud/opciones-evaluacion
 */
export const API_POST_OPCIONES_EVALUACION = `sat-t231001/evaluar/opciones-evaluacion-capturista`;

/**
 * API para prepar evaluacion tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Evaluar-Solicitud/getOpcionesEvaluacion
 */
export const API_GET_EVALUAR_MOSTRAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/mostrar`;

/**
 * API para iniciar el dictamen del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Dictamen/generar-dictamen-by-numFolioTramite
 */
export const API_GET_INICAR_DICTAMEN = `sat-t231001/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/iniciar`;

/**
 * ID de la solicitud del dictamen que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el ID real de la solicitud del dictamen.
 * @constant {string}
 */
export const IDSOLICITUDDICTAMEN = '{idSolicitudDictamen}';

/**
 * API para generar el dictamen del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Dictamen/dictamen-criterios-by-idSolicitud
 */
export const API_GET_DICTAMEN_CRITERIOS = `sat-t${TRAMITE}/solicitud/${IDSOLICITUDDICTAMEN}/dictamen/generar/criterios`;

/**
 * API para guardar el dictamen del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Dictamen/generar-dictamen-by-numFolioTramite
 */
export const API_POST_GUARDAR_DICTAMEN = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/guardar`;

/**
 * API para Consultar que tabs mostrar 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitud/estado-consulta-solicitud
 */
export const API_GET_TABS = `sat-t${TRAMITE}/tramite/solicitud/${IDSOLICITUD}/estado`;

/**
 * API para Consultar documentos de solicitud del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitudes/consulta-documentos-solicitud
 */
export const API_GET_SOLICITUD_DOCUMENTOS = `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/documentos`;

/**
 * API para Consultar tareas de solicitud del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitudes/get-tareas-tramite
 */
export const API_GET_TAREAS_DOCUMENTOS = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/bitacora`;

/**
 * API para Consultar acuses de resolución del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Acuse/consulta-acuse-resoluciones-funcionario
 */
export const API_GET_ACUSES_RESOLUCION = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/funcionario/acuses-resoluciones`;

/**
 * API para Consultar solicitud del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitudes
 */
export const API_GET_CONSULTA_SOLICITUD = `sat-t231001/tramite/${NUMFOLIOTRAMITE}/solicitud/detalle`;

/**
 * API para Consultar requerimientos del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitudes/get-requerimientos-by-numFolioTramite
 */
export const API_GET_REQUERIMIENTOS = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimientos`;

/**
 * API para Consultar dictamenes del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitudes/consultar-dictamenes-by-numFolioTramite
 */
export const API_GET_DICTAMENES = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamenes`;

/**
 * API para iniciar la confirmación de notificación del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Confirmar-Notificacion/iniciar-confirmacion-notificacion
 */
export const API_GET_INICIAR_CONFIRMACION_NOTIFICACION = `sat-t231001/tramite/${NUMFOLIOTRAMITE}/confirmar-notificacion/iniciar`;

/**
 * ID de la resolucion.
 * Este valor debe ser reemplazado por el ID real de la resolucion.
 * @constant {string}
 */
export const IDRESOLUCION = '{idResolucion}';

/**
 * API para obtener documento de resolucion 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Dictamen/guardar-dictamen-generado-by-numFolioTramite
 */
export const API_POST_RESOLUCION_GUARDAR = `sat-t${TRAMITE}/confirmar-notificacion/resolucion/${IDRESOLUCION}/acuse/guardar`;

/**
 * ID del requerimiento.
 * Este valor debe ser reemplazado por el ID real del requerimiento.
 * @constant {string}
 */
export const IDREQUERIMIENTO = '{idRequerimiento}';
/**
 * API para obtener documento de resolucion 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Dictamen/guardar-dictamen-generado-by-numFolioTramite
 */
export const API_POST_REQUERIMIENTO_GUARDAR = `sat-t${TRAMITE}/confirmar-notificacion/requerimiento/${IDREQUERIMIENTO}/acuse/guardar`;

/**
 * API para consulta de envio digital 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitud/get-detalle-estado
 */
export const API_GET_ENVIO_DIGITAL = `tramite/${NUMFOLIOTRAMITE}/envio-digital/detalle`;

/**
 * API para detalle de la opinion tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitud/consulta-detalle%20opninion
 */
export const API_GET_OPINION = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/opiniones`;

/**
 * API para iniciar requerimiento trámite 231001
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_INICIAR_REQUERIMIENTO = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/iniciar`;

/**
 * API para guardar el requerimiento del trámite 231001
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Requerimiento/guardar-requerimiento
 */
export const API_POST_GUARDAR_REQUERIMIENTO = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/generar/guardar`;

/**
 * API para consultar los sentidos disponibles
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Catalogos/consulta-sentidos-disponibles
 */
export const API_GET_SENTIDOS_DISPONIBLES = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/generar/sentidos-disponibles`;

/**
 * API para mostrar y firmar el dictamen
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Dictamen/mostra-firmar-dictamen
 */
export const API_POST_MOSTRAR_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/mostrar-firmar`;

/**
 * API firmar
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Generar-Requerimiento/firmar_1
 */
export const API_POST_FIRMAR_DICTAMEN = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/firmar`;

/**
 * @param
 * Api para obtener el detalle de la solicitud del tramite 231001.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Consulta-Solicitudes
 */
export const GET_DETALLE_SOLICITUD = (
  tramite: string,
  folioTramite: string
): string => `sat-t${tramite}/tramite/${folioTramite}/solicitud/detalle`;
