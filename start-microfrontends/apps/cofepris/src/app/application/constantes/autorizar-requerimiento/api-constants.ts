import { IDSOLICITUD } from "@libs/shared/data-access-user/src";

/**
 * Tramite que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const TRAMITE = '{tramite}';

/**
 * Constante para el número de folio del tramite.
 * Debe ser reemplazada por el número de folio real del tramite.
 */
export const NUMFOLIOTRAMITE = '{numFolioTramite}';

/**
 * API para iniciar requerimiento - tramite 260203
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260203/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_INICIAR_AUTORIZAR_REQUERIMIENTO = `sat-t260203/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/iniciar`;

/**
 * API para iniciar requerimiento - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/firmar`;

/**
 * API para iniciar requerimiento - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_MOSTRAR_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/mostrar-firma`;

/**
 * API para guardar observacion - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen
 */
export const API_POST_AUTORIZAR_REQUERIMIENTO_OBSERVACION = `sat-t${TRAMITE}/${NUMFOLIOTRAMITE}/requerimiento/autorizar/observacion/guardar`;

/**
 * API para obtener oficio resolucion 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen/guardar-documento
 */
export const API_GET_OFICIO_REQUERIMIENTO = `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/requerimiento/autorizar/oficio-autorizacion/guardar`;