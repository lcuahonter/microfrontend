/**
 * Interface que define la respuesta de la API al buscar un extranjero moral.
 */
export interface ExtranjeroMoralResponse {
  denominacionRazonSocial: string;
  domicilio: string;
  correoElectronico: string;
}

/**
 * Interface que define los parámetros de búsqueda de un extranjero moral.
 */
export interface SearchExtranjeroMoralParams {
  denominacionRazonSocial?: string;
  codigoPostal?: string;
  idPais?: string;
}
