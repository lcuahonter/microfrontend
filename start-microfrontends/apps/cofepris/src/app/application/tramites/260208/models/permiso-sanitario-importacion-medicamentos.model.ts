/**
 * @interface ListaPasosWizard
 * Define la estructura de los pasos del wizard en el flujo del trámite.
 */
export interface ListaPasosWizard {
  /**
   * @property {number} indice
   * Índice del paso en el flujo.
   */
  indice: number;

  /**
   * @property {string} titulo
   * Título descriptivo del paso.
   */
  titulo: string;

  /**
   * @property {boolean} activo
   * Indica si el paso está activo.
   */
  activo: boolean;

  /**
   * @property {boolean} completado
   * Indica si el paso ha sido completado.
   */
  completado: boolean;
}

/**
 * @constant {Array<ListaPasosWizard>} PASOS
 * Configuración de los pasos del trámite.
 *
 * Cada paso está representado por un objeto que contiene las siguientes propiedades:
 * - `indice`: Número del paso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo.
 * - `completado`: Indica si el paso ha sido completado.
 */
export const PASOS: ListaPasosWizard[] = [
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
     * Indica si el paso ha sido completado.
     */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 4,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];