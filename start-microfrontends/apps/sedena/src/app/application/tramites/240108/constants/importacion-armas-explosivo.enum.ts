/**
 * Lista de pasos del proceso de solicitud, incluyendo su estado actual.
 * Cada paso contiene un índice, título, y banderas de activo y completado.
 * @const {Array<Object>}
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Título principal mostrado en la solicitud de permiso ordinario.
 * @const {string}
 */
export const TITULO_MENSAJE =
  'Solicitud Permiso ordinario para la importación de explosivo';

/**
 * Mensaje informativo que explica el uso del número temporal de la solicitud.
 * @const {string}
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador único del procedimiento administrativo para la importación.
 * @const {number}
 */
export const ID_PROCEDIMIENTO = 240108;
