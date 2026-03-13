/**
 * Request de consulta especifica
 */
export interface ConsultaEspecificaRequest {
  fraccionArancelaria: string;
  tipoOperacion: string;
  tipoUnidadMedida: string;
  exenta: string;
  prohibida: string;
  vigencia: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

/**
 * Response de consulta especifica
 */
export interface ConsultaEspecificaResponse {
  codigo: string;
  mensaje: string;
  datos: TigieRow[];
}

/**
 * Row de tigie
 */
export interface TigieRow {
  fraccionArancelaria: string;
  tipoOperacion: string;
  tipoUMT: string;
  fraccionExenta: string;
  fraccionProhibida: string;
  fraccionDerogada: string;
  descripcion: string;
  impuestoAdValorem: string;
}
