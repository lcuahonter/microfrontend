
/**
 * Request de consulta historica
 */
export interface ConsultaHistoricaRequest {
  tipoOperacion: string;
  fraccionArancelaria: string;
}

/**
 * Item de historico
 */
export interface HistoricoItem {
  fecha: string;
  accion: string;
  detalle: string;
}

/**
 * Response de consulta historica
 */
export interface ConsultaHistoricaResponse {
  agregadas: HistoricoItem[];
  disgregadas: HistoricoItem[];
}
