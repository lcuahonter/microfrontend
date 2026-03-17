/**
 * @description Array que define los pasos del proceso para el reporte anual.
 * Cada objeto en el array representa un paso con su índice, título, y estado actual.
 * Los pasos pueden estar activos o completados.
 * @type {Array<PasoReporte>}
 * 
 */
export const REPORTE_ANUAL_PASOS = [
  {
      /**
       * @property {number} indice - Identificador numérico del paso.
       * @property {string} titulo - Título descriptivo del paso.
       * @property {boolean} activo - Indica si el paso está activo actualmente.
       * @property {boolean} completado - Indica si el paso ha sido completado.
       */
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: false,
  },
  {
      /**
       * @property {number} indice - Identificador numérico del paso.
       * @property {string} titulo - Título descriptivo del paso.
       * @property {boolean} activo - Indica si el paso está activo actualmente.
       * @property {boolean} completado - Indica si el paso ha sido completado.
       */
      indice: 2,
      titulo: 'Firmar solicitud',
      activo: false,
      completado: false,
  }
];
