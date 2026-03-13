/**
 * @interface ListaPasosWizard
 * @description
 * Define la estructura de datos que representa un paso individual dentro de un asistente (wizard).
 * Cada instancia de esta interfaz describe las propiedades clave que determinan la posición,
 * visibilidad y progreso de un paso en el flujo del asistente.
 */
export interface ListaPasosWizard {
  
  /**
   * @property {number} indice
   * @description
   * Índice numérico que representa la posición del paso dentro del asistente.
   * Comienza típicamente desde 0 o 1, según la implementación.
   */
  indice: number;

  /**
   * @property {string} titulo
   * @description
   * Título descriptivo o nombre del paso. Se utiliza generalmente en la UI para
   * mostrar el nombre del paso actual al usuario.
   */
  titulo: string;

  /**
   * @property {boolean} activo
   * @description
   * Indica si el paso se encuentra actualmente activo y visible para el usuario.
   * Solo un paso suele estar activo a la vez.
   */
  activo: boolean;

  /**
   * @property {boolean} completado
   * @description
   * Determina si el paso ya ha sido completado. Esto puede utilizarse para mostrar
   * validaciones, íconos de estado o permitir navegación hacia atrás.
   */
  completado: boolean;
}
