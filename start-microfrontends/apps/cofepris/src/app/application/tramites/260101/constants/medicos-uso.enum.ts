/**
 * Constantes utilizadas en el trámite 260101 para la configuración de pasos, mensajes y datos relacionados con el procedimiento.
 *
 * Este archivo contiene configuraciones que definen los pasos del trámite, el título del mensaje, los textos de requisitos,
 * y el identificador único del procedimiento.
 */

/**
 * Configuración de los pasos del trámite.
 *
 * Cada paso está representado por un objeto que contiene las siguientes propiedades:
 * - `indice`: Número del paso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo.
 * - `completado`: Indica si el paso ha sido completado.
 *
 * @constant {Array<Object>}
 */
export const PASOS = [
  {
    /**
     * @property {number} indice
     * Índice del paso en el flujo.
     */
    indice: 1,

    /**
     * @property {string} titulo
     * Título descriptivo del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * @property {boolean} activo
     * Indica si el paso está activo.
     */
    activo: true,

    /**
     * @property {boolean} completado
     * Indica si el paso está completado.
     */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar necesarios',
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
 * Título del mensaje relacionado con el trámite 260101.
 *
 * @constant {string}
 */
export const TITULOMENSAJE =
  'Solicitud permiso previo importación productos';

/**
 * Texto de requisitos para el trámite 260101.
 *
 * Contiene información sobre el número temporal de la solicitud y su validez.
 *
 * @constant {string}
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador único del procedimiento 260101.
 *
 * @constant {number}
 */
export const ID_PROCEDIMIENTO = 260101;

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';
