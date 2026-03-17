/**
 * 
 * Interfaz que define la estructura de un botón de acción.
 * Esta interfaz se utiliza para representar las acciones y valores asociados
 * a los botones en el flujo del trámite.
 */
export interface AccionBoton {
  /**
   * 
   * Acción que representa el tipo de operación que realizará el botón.
   * {string}
   */
  accion: string;

  /**
   * 
   * Valor asociado a la acción del botón, como el índice de un paso.
   * {number}
   */
  valor: number;
}