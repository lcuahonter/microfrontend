/**
 * Interfaz que representa las claves de un lote, incluyendo datos de fabricación y caducidad.
 */
export interface ClavesDeLotes {
  /** Identificador único o clave del lote. */
  lotes: string;

  /** Fecha de fabricación del lote. */
  fabricacion: string;

  /** Fecha de caducidad del lote. */
  caducidad: string;
}
