/**
 * Interfaz que representa una acción asociada a un botón.
 */
export interface AccionBoton {
  /**
   * Nombre de la acción que realiza el botón.
   */
  accion: string;

  /**
   * Valor asociado a la acción del botón.
   */
  valor: number;
}