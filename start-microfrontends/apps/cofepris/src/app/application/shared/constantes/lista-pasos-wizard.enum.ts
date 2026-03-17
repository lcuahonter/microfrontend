/**
 * @const LISTA_PASOS_WIZARD
 * @description Lista de pasos para el asistente (wizard) en el flujo de la aplicación.
 * Cada paso contiene información sobre su índice, título, y estado (activo o completado).
 * 
 * @property {number} indice - El número de orden del paso en el asistente.
 * @property {string} titulo - El título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está actualmente activo.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */
export const LISTA_PASOS_WIZARD = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: false,
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
      }

]



