/**
 * Modelo para representar un pago de derecho anual.
 */
export interface PagoDerecho {
  anio: number;
  cuota: number;
  fechaRegistro: string;
  estado: string;
}
