
/**
 * Interfaz que representa la estructura de un botón de acción.
 * Contiene la información necesaria para identificar la acción y su valor asociado.
 */
export interface AccionBoton {
  /** Nombre o tipo de la acción que realiza el botón. */
  accion: string;

  /** Valor numérico asociado a la acción (por ejemplo, un identificador o estado). */
  valor: number;
}
