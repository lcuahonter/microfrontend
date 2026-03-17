/**
 * @interface ListaPasosWizard
 * Representa un paso dentro del flujo de un wizard o asistente.
 */
export interface ListaPasosWizard {
  /**
   * Índice del paso dentro del wizard.
   */
  indice: number;

  /**
   * Título descriptivo del paso.
   */
  titulo: string;

  /**
   * Indica si el paso actual está activo (visible y habilitado).
   */
  activo: boolean;

  /**
   * Indica si el paso ya fue completado.
   */
  completado: boolean;
}
