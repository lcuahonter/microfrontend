/**
 * Interface que define la respuesta de la API de acuses y resoluciones.
 */
export interface AcuseResolucionResponse {
  folio: string;
  tipoTramite: string;
  dependencia: string;
  fechaInicioTramite: string;
  sentidoResolucion: string;
  estatusResolucion: string;
}

/**
 * Interface que define los parámetros de búsqueda de acuses y resoluciones.
 */
export interface SearchAcuseResolucionParams {
  folio?: string;
  fechaInicial?: string;
  fechaFinal?: string;
}

/**
 * Interface para los datos del solicitante que se muestran en la vista de acuses.
 */
export interface SolicitanteAcuseData {
  tipoPersona: 'persona_fisica' | 'persona_moral' | 'extranjero' | 'extranjero_moral' | 'no_contribuyentes';
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  denominacionRazonSocial?: string;
  rfc?: string;
  curp?: string;
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  codigoPostal?: string;
  pais?: string;
  estado?: string;
}
