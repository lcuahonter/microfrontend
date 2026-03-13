/**
 * Constantes de mensajes para el trámite 110219
 */

/**
 * Template de mensaje de alerta para terceros con número de solicitud temporal
 * @param idSolicitud - El ID de la solicitud temporal
 * @returns El mensaje formateado con el ID de solicitud
 */
export const TERCEROS_TEXTO_DE_ALERTA_TEMPLATE = (idSolicitud: string): string =>
  `La solicitud ha quedado registrada con el número temporal ${idSolicitud} Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;
