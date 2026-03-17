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
 * API para mostrar y firmar la verificación de requerimiento - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260203/swagger-ui/index.html#/Verificar-Requerimiento/verificar-mostrar-firmar
 */
export const API_POST_VERIFICAR_MOSTRAR_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/verificar/mostrar-firmar`;

/**
 * API para iniciar requerimiento - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/iniciar-generar-requerimiento
 */
export const API_POST_FIRMAR_VERIFICAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/verificar/firmar`;