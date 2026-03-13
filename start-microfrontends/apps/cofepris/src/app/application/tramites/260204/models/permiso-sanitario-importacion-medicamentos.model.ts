/**
 * Representa una lista de pasos en un asistente (wizard).
 * Cada paso tiene un índice, un título, y estados que indican si está activo o completado.
 */
export interface ListaPasosWizard {
  /**
   * Índice del paso en el asistente.
   * Representa la posición del paso en la lista.
   */
  indice: number;

  /**
   * Título descriptivo del paso.
   * Se utiliza para mostrar el nombre del paso en la interfaz de usuario.
   */
  titulo: string;

  /**
   * Indica si el paso está activo actualmente.
   * Un paso activo es el que está siendo mostrado o trabajado en el asistente.
   */
  activo: boolean;

  /**
   * Indica si el paso ha sido completado.
   * Un paso completado es aquel que ya ha sido terminado por el usuario.
   */
  completado: boolean;
}

