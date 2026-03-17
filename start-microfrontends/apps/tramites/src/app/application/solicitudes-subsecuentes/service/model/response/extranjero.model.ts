/**
 * Interface que define la respuesta de la API al buscar un extranjero.
 */
export interface ExtranjeroResponse {
  nombre: string;
  domicilio: string;
  correo: string;
}

/**
 * Interface que define los parámetros de búsqueda de un extranjero.
 */
export interface SearchExtranjeroParams {
  nombre?: string;
  primerApellido?: string;
  codigoPostal?: string;
  idPais?: string;
}
