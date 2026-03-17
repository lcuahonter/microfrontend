/**
 * Representa los pasos necesarios para la renovación de muestras de mercancías.
 * Cada paso contiene un índice, un título, y estados de actividad y completado.
 * 
 * @constant {Array<Object>} RenovacionesPasos - Lista de pasos para la renovación.
 * @property {number} indice - El índice del paso en el proceso.
 * @property {string} titulo - El título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */
export const RENOVACIONES_PASOS = [
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