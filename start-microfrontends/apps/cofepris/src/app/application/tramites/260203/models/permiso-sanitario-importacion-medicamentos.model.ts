/**
 * Representa una lista de pasos en un asistente (wizard) para guiar al usuario a través de un proceso.
 * Cada paso contiene información sobre su índice, título, estado de actividad y si ha sido completado.
 */
export interface ListaPasosWizard {
  /**
   * Índice del paso dentro del asistente. 
   * Este valor indica la posición del paso en la secuencia.
   * 
   * @type {number}
   */
  indice: number;

  /**
   * Título descriptivo del paso. 
   * Este texto se utiliza para mostrar el nombre o descripción del paso al usuario.
   * 
   * @type {string}
   */
  titulo: string;

  /**
   * Indica si el paso está activo actualmente. 
   * Un paso activo es el que está siendo mostrado o trabajado en el asistente.
   * 
   * @type {boolean}
   */
  activo: boolean;

  /**
   * Indica si el paso ha sido completado. 
   * Un paso completado significa que el usuario ha terminado todas las acciones requeridas en ese paso.
   * 
   * @type {boolean}
   */
  completado: boolean;
}

