/**
 * Interface que define la respuesta de la API al buscar un no contribuyente.
 */
export interface NoContribuyenteResponse {
  curp: string;
  nombre: string;
  correoElectronico: string;
}

/**
 * Interface que define los parámetros de búsqueda de un no contribuyente.
 */
export interface SearchNoContribuyenteParams {
  curp: string;
}
