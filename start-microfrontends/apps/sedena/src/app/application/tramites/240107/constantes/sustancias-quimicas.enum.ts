/**
 * @module SustanciasQuimicas
 * @description Constantes utilizadas en el módulo de Sustancias Químicas.
 */

/**
 * @const PASOS
 * @description Lista de pasos del procedimiento para la solicitud.
 * @property {number} indice - Número del paso.
 * @property {string} titulo - Título del paso.
 * @property {boolean} activo - Indica si el paso está activo.
 * @property {boolean} completado - Indica si el paso está completado.
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
 * @description Título del mensaje mostrado al usuario durante el procedimiento.
 */
export const TITULOMENSAJE =
  'Solicitud Permiso ordinario para la importación de armamento, municiones y diverso material para personas físicas y morales';

/**
 * @const TEXTOS_REQUISITOS
 * @description Texto mostrado al usuario con los requisitos de la solicitud.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * @const ID_PROCEDIMIENTO
 * @description Identificador único del procedimiento.
 */
export const ID_PROCEDIMIENTO = 240107;
