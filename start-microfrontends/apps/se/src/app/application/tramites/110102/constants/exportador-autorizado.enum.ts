/**
 * Constante que define los pasos del proceso de exportador autorizado.
 * Cada paso incluye un índice, un título, y su estado (activo o completado).
 */
export const PASOS = [
  {
    /**
     * Índice del paso en el proceso.
     */
    indice: 1,

    /**
     * Título descriptivo del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el paso está activo.
     */
    activo: true,

    /**
     * Indica si el paso ha sido completado.
     */
    completado: false,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  }
];