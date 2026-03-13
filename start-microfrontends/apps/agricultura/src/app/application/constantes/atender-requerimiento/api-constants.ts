/**
 * Constante para el número de folio del tramite.
 * Debe ser reemplazada por el número de folio real del tramite.
 */
export const NUMFOLIOTRAMITE = '{numFolioTramite}';

/**
 * Tramite que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const TRAMITE = '{tramite}';

/**
 * ID de la solicitud que se utilizará en las rutas de la API.
 */
export const IDSOLICITUD = '{idSolicitud}';

/**
 * API para iniciar el atender requerimiento
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Atender-Requerimiento/atender-requerimiento-iniciar
 */
export const API_GET_INICIAR_ATENDER_REQUERIMIENTO = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/atender/iniciar`;

/**
 * API para generar la cadena original
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Atender-Requerimiento/atender-requerimiento-mostrar-firma
 */
export const API_POST_MOSTRAR_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/atender/mostrar-firma`;

/**
 * API parA firmar el atender el requerimiento
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Atender-Requerimiento/atender-requerimiento-firmar
 */
export const API_POST_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/atender/firmar`;

/**
 * API parA firmar generar acuse requerimiento
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Atender-Requerimiento/guardar-acuse-promocion
 */
export const API_POST_ACUSE_REQUERIMIENTO= `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/requerimiento/atender/acuse/guardar`;
