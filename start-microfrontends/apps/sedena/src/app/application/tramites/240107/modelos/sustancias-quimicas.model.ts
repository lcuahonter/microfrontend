/**
 * Modelo de datos para los pasos del asistente de IMMEX.
 * @export
 * @interface ListaPasosWizard
 * @property {number} indice - Posición del paso en el asistente.
 * @property {string} titulo - Título del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso está completado.
 */
export interface ListaPasosWizard {
    indice: number;
    titulo: string;
    activo: boolean;
    completado: boolean;
  }