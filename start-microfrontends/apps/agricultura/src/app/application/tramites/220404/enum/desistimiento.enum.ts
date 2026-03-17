/**
 * @fileoverview
 * Este archivo define la constante `DESISTIMIENTO_PASOS`, que representa los pasos del proceso de desistimiento
 * en el trámite 220404. Proporciona una estructura para manejar el flujo del asistente (wizard) en la interfaz de usuario.
 * 
 * @module DesistimientoEnum
 * @description
 * Este archivo contiene la definición de los pasos del desistimiento, incluyendo su índice, título, y estado (activo o completado).
 */

/**
 * @constant {Array<Object>} DESISTIMIENTO_PASOS
 * @description
 * Define los pasos del proceso de desistimiento en el trámite 220404.
 * Cada paso incluye las siguientes propiedades:
 * 
 * - `indice`: Número que indica el orden del paso en el proceso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo actualmente.
 * - `completado`: Indica si el paso ha sido completado.
 * 
 * @example
 * // Ejemplo de uso:
 * console.log(DESISTIMIENTO_PASOS[0].titulo); // 'Capturar solicitud'
 */
export const DESISTIMIENTO_PASOS = [
  {
    /**
     * Índice del primer paso.
     * @type {number}
     */
    indice: 1,

    /**
     * Título descriptivo del primer paso.
     * @type {string}
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el primer paso está activo.
     * @type {boolean}
     */
    activo: true,

    /**
     * Indica si el primer paso ha sido completado.
     * @type {boolean}
     */
    completado: true,
  },
  {
    /**
     * Índice del segundo paso.
     * @type {number}
     */
    indice: 2,

    /**
     * Título descriptivo del segundo paso.
     * @type {string}
     */
    titulo: 'Firmar solicitud',

    /**
     * Indica si el segundo paso está activo.
     * @type {boolean}
     */
    activo: false,

    /**
     * Indica si el segundo paso ha sido completado.
     * @type {boolean}
     */
    completado: false,
  },
];