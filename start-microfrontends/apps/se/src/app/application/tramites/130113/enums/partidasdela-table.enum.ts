/**
 * Interfaz que representa los datos de una partida complementaria.
 * @export
 * @interface CompliMentaria
 * @property {number} id Identificador único de la partida.
 * @property {string} descripcion Descripción de la partida.
 * @property {number} cantidad Cantidad de la partida.
 * @property {number} valor Valor asignado a la partida.
 * @property {string} unidad Unidad de medida de la partida.
 * @property {string} [observaciones] Observaciones adicionales (opcional).
 */
export interface CompliMentaria {
  /** Identificador único de la partida. */
  id: number;
  /** Descripción de la partida. */
  descripcion: string;
  /** Cantidad de la partida. */
  cantidad: number;
  /** Valor asignado a la partida. */
  valor: number;
  /** Unidad de medida de la partida. */
  unidad: string;
  /** Observaciones adicionales (opcional). */
  observaciones?: string;
}