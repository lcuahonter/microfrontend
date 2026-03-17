/**
 * Representa un paso individual en el flujo de la solicitud.
 * @typedef {Object} Paso
 * @property {number} indice - El número de orden del paso.
 * @property {string} titulo - El título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */

/**
 * Arreglo de pasos del proceso de la solicitud PANTA.
 * Cada objeto contiene información sobre el estado y el título del paso.
 */
export const PANTA_PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false
  }
];
