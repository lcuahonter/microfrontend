/**
 * Modelo para la solicitud de guardar tipos de documentos.
 */
export interface GuardarTiposDocumentoRequest {
  /**
   * ID del tipo de documento.
   */
  id_tipo_documento: number;

  /**
   * ID de la persona asociada al documento.
   */
  id_persona: number | null;

  /**
   * ID del documento en la solicitud (opcional).
   */
  id_documento_solicitud: number | null;
}
