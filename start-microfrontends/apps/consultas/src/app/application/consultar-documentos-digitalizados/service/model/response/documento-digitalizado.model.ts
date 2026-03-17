/**
 * Interface que representa un documento digitalizado.
 */
export interface DocumentoDigitalizado {
  id: number;
  tipoDocumento: string;
  nombreDocumento: string;
  rfcConsulta: string;
  fechaCreacion: string;
  eDocument: string;
}

/**
 * Interface que representa la respuesta de la consulta de documentos digitalizados.
 */
export interface ConsultaDocumentosResponse {
  data: DocumentoDigitalizado[];
  total: number;
}

/**
 * Interface que representa los filtros de la consulta de documentos digitalizados.
 */
export interface FiltroDocumentos {
  tipoConsulta: string;
  numeroEdocument?: string | null;
  rfcConsulta?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
}
