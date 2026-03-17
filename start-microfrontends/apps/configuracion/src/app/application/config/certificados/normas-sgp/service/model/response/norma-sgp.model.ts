/**
 * Interface que representa una norma SGP.
 */
export interface NormaSGP {
  bloquePais: string;
  literal: string;
  posicionFraccion: string;
  posicionValor: boolean;
  activo: boolean;
  fechaInicioVigencia: string;
  fechaFinVigencia?: string;
}

/**
 * Interface que representa la respuesta de la consulta de una norma SGP.
 */
export interface ConsultaNormaResponse {
  existe: boolean;
  datos?: NormaSGP;
}
