/**
 * Define la estructura de datos para representar un paso en un asistente (wizard).
 * Cada paso incluye su índice, título, estado de actividad y estado de completitud.
 * 
 * Índice numérico del paso dentro del asistente. 
 * Título descriptivo del paso.
 * Indica si el paso está actualmente activo y visible. 
 * Indica si el paso ha sido completado.
 */
export interface ListaPasosWizard {
  indice: number;
  titulo: string;
  activo: boolean;
  completado: boolean;
}

