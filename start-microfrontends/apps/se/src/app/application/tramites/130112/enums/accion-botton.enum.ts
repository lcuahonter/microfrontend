/**
 * @descripcion
 * Interfaz que define la estructura de un botón de acción.
 * Esta interfaz se utiliza para representar las acciones y valores asociados
 * a los botones en el flujo del trámite.
 */
export interface AccionBoton {
  /**
   * @descripcion
   * Acción que representa el tipo de operación que realizará el botón.
   * @type {string}
   */
  accion: string;

  /**
   * @descripcion
   * Valor asociado a la acción del botón, como el índice de un paso.
   * @type {number}
   */
  valor: number;
}