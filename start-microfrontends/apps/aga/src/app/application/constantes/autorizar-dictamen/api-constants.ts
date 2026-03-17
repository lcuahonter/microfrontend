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
 * API para iniciar requerimiento trámite 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_INICIAR_AUTORIZAR_DICTAMEN = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/autorizar/iniciar`;

/**
 * API para iniciar requerimiento trámite 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_MOSTRAR_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/autorizar/mostrar-firmar`;

/**
 * API para iniciar requerimiento trámite 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/autorizar/firmar`;

/**
 * API para obtener oficio resolucion 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen/guardar-documento
 */
export const API_POST_OFICIO_AUTORIZACION = `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/dictamen/autorizar/oficio-autorizacion/guardar`;

/**
 * API para obtener oficio resolucion rechazado 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen/guardar-documento-rechazado
 */
export const API_POST_OFICIO_RECHAZADO = `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/dictamen/autorizar/oficio-rechazado/guardar`;

/**
 * API para guardar observacion 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen
 */
export const API_POST_OBSERVACION_GUARDAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/observacion/guardar`;