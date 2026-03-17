/**
 * Request para consulta especifica
 */
export interface ConsultaEspecificaRequest {
  rfc: string;
  tratadoAcuerdo: string;
  pais: string;
  fechaDesde: string;
  fechaHasta: string;
  estadoCertificado: string;
  representacionFederal: string;
}

/**
 * Request para consulta por folio
 */
export interface ConsultaPorFolioRequest {
  numeroFolio: string;
}
