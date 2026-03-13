/**
 * @const PASOS
 * @description Arreglo que define los pasos del trámite de importación de armas y municiones.
 * Cada paso incluye un índice, un título descriptivo, y los estados de actividad y completado.
 * 
 * @property {number} indice - Número que identifica el orden del paso.
 * @property {string} titulo - Título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 * 
 * @example
 * ```typescript
 * PASOS.forEach(paso => {
 *   console.log(paso.titulo);
 * });
 * ```
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
 * @const TITULOMENSAJE
 * @description Título del mensaje que describe el trámite de solicitud de permiso ordinario para la importación de armamento, municiones y material diverso.
 */
export const TITULOMENSAJE =
  'Solicitud Permiso ordinario para la importación de armamento, municiones y diverso material para personas físicas y morales';

/**
 * @const TEXTOS_REQUISITOS
 * @description Texto que informa al usuario sobre el registro temporal de la solicitud y su número de identificación.
 * Este número no tiene validez legal y sirve únicamente para identificar la solicitud hasta que sea firmada.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * @const ID_PROCEDIMIENTO
 * @description Identificador único del procedimiento de importación de armas y municiones.
 */
export const ID_PROCEDIMIENTO = 240111;
