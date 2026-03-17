
/**
 * Representa una lista de pasos en un asistente (wizard) para un proceso.
 */
export interface ListaPasosWizard {
  /**
   * Índice del paso dentro del asistente. 
   * Representa la posición del paso en la secuencia.
   */
  indice: number;

  /**
   * Título descriptivo del paso. 
   * Se utiliza para mostrar el nombre o descripción del paso en la interfaz de usuario.
   */
  titulo: string;

  /**
   * Indica si el paso está activo actualmente. 
   * Un paso activo es el que está siendo mostrado o procesado en el asistente.
   */
  activo: boolean;

  /**
   * Indica si el paso ha sido completado. 
   * Un paso completado significa que el usuario ha terminado todas las acciones requeridas en ese paso.
   */
  completado: boolean;
}

