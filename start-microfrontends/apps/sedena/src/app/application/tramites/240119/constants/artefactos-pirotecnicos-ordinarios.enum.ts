/**
 * @constant {Array<Object>} PASOS
 * @description Representa los pasos de un proceso en una solicitud.
 * Cada paso contiene información sobre su índice, título, 
 * estado de actividad y si ha sido completado.
 * 
 * @property {number} indice - El número de orden del paso en el proceso.
 * @property {string} titulo - El título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado.
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
 * @constant {string} TITULOMENSAJE
 * @description Título del mensaje que se muestra al usuario al completar la solicitud.
 * Este mensaje indica que se ha solicitado un permiso ordinario para la exportación
 * de artificios pirotécnicos.
 */
export const TITULOMENSAJE =
  'Solicitud Permiso ordinario para la exportación de artificios pirotécnicos';

/**
 * @constant
 * @description
 * Texto que informa al usuario sobre el registro temporal de su solicitud.
 * Incluye un número temporal que no tiene validez legal y que sirve únicamente
 * para identificar la solicitud hasta que se le asigne un folio oficial al momento
 * de ser firmada.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador único del procedimiento asociado a los artefactos pirotécnicos ordinarios.
 * Este valor se utiliza para referenciar el procedimiento específico en el sistema.
 */
export const ID_PROCEDIMIENTO = 240119;
