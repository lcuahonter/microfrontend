/**
 * Representa la solicitud para mostrar la información de firma.
 */
export interface MostrarFirmaRequest {
  /**
   * Lista de documentos requeridos para la firma.
   */
  documentos_requeridos: DocumentosRequerido[];
}

/**
 * Representa un documento requerido en el proceso de firma.
 */
export interface DocumentosRequerido {
  /**
   * Identificador único del documento seleccionado.
   */
  id_documento_seleccionado: number | null 

  /**
   * Identificador único del documento asociado a la solicitud.
   */
  id_documento_solicitud: number;
}
