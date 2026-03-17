/**
 * Interfaz que representa la respuesta al guardar tipos de documentos en el trámite 701.
 */
export interface GuardarTiposDocumentosResponse {
    /**
     * ID del tipo de documento guardado.
     */
    id_tipo_documento: number;

    /**
     * ID de la persona asociada al documento.
     */
    id_persona: number;

    /**
     * ID del documento en la solicitud.
     */
    id_documento_solicitud: number;
}