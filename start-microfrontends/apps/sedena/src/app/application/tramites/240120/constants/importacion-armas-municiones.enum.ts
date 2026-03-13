/**
 * @file importacion-armas-municiones.enum.ts
 * @description Este archivo contiene constantes utilizadas en el flujo de trabajo del trámite de importación de armas y municiones.
 * Proporciona información sobre los pasos del wizard, mensajes de texto, y otros valores constantes relacionados con el trámite.
 */

/**
 * @constant PASOS
 * @description Define los pasos del wizard para el trámite, incluyendo su índice, título, y estado (activo o completado).
 * @type {Array<{ indice: number, titulo: string, activo: boolean, completado: boolean }>}
 * @example
 * const PASOS = [
 *   { indice: 1, titulo: 'Capturar solicitud', activo: true, completado: true },
 *   { indice: 2, titulo: 'Anexar requisitos', activo: false, completado: false },
 *   { indice: 3, titulo: 'Firmar solicitud', activo: false, completado: false },
 * ];
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
 * @constant TITULOMENSAJE
 * @description Título principal que se muestra en la parte superior del wizard.
 * @type {string}
 * @example
 * const TITULOMENSAJE = 'Solicitud Permiso extraordinario para la exportación de artificios pirotécnicos';
 */
export const TITULOMENSAJE =
  'Solicitud Permiso extraordinario para la exportación de artificios pirotécnicos';

/**
 * @constant TEXTOS_REQUISITOS
 * @description Mensaje informativo que se muestra después de registrar la solicitud.
 * @type {string}
 * @example
 * const TEXTOS_REQUISITOS = 'La solicitud ha quedado registrada con el número temporal [202767640]...';
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

  /**
 * @constant ID_PROCEDIMIENTO
 * @description Identificador único del procedimiento asociado al trámite.
 * @type {number}
 * @example
 * const ID_PROCEDIMIENTO = 240120;
 */
export const ID_PROCEDIMIENTO = 240120;
