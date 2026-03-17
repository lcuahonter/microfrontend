/**
 * @interface LISTAPASOWIZARD
 * @description
 * Interfaz que representa un paso en el asistente (wizard) del trámite PROSEC.
 * Cada objeto de esta interfaz define la información necesaria para mostrar y controlar el estado de un paso dentro del flujo del wizard.
 */
export interface LISTAPASOWIZARD {
  /**
   * @property {number} indice
   * @description
   * Índice del paso dentro del wizard. Determina el orden de aparición del paso.
   */
  indice: number;

  /**
   * @property {string} titulo
   * @description
   * Título del paso que se muestra al usuario en la interfaz del wizard.
   */
  titulo: string;

  /**
   * @property {boolean} activo
   * @description
   * Indica si el paso está activo actualmente en el flujo del wizard.
   */
  activo: boolean;

  /**
   * @property {boolean} completado
   * @description
   * Indica si el paso ha sido completado por el usuario.
   */
  completado: boolean;
}

/**
 * @interface ACCIONBOTON
 * @descripcion 
 * Interfaz que representa un botón de acción.
 * Define la acción a ejecutar y el valor asociado a dicha acción, como el índice del paso al que se debe navegar.
 */
export interface ACCIONBOTON {
  /**
   * @property {string} accion
   * @descripcion Acción que se debe realizar.
   * Por ejemplo, avanzar o retroceder en el wizard.
   */
  accion: string;

  /**
   * @property {number} valor
   * @descripcion Valor asociado a la acción.
   * Generalmente el índice del paso al que se debe navegar.
   */
  valor: number;
}