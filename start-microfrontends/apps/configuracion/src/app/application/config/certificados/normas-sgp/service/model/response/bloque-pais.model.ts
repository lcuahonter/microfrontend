/**
 * Modelo para representar un bloque/país.
 */
export interface BloquePais {
  id: number;
  nombre: string;
}

/**
 * Modelo para representar la respuesta de la API.
 */
export interface BloquePaisResponse {
  data: BloquePais[];
  total: number;
}
