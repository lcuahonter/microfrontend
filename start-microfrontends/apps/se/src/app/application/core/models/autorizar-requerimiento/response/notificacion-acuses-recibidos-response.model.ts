/**
 * Modelo de respuesta para notificación de acuses recibidos.
 */
export interface AcusesRecibidosNotificacion {
    
    /** Lista de acuses relacionados */
    acuses: DocumentoOficialResponse[];

    /** Lista de documentos oficiales */
    documentos_oficiales: DocumentoOficialResponse[];

}
export interface DocumentoOficialResponse {

    /** ID del documento oficial */
    id_documento_oficial: string;

    /** Descripción del documento */    
    desc_documento : string;
    
    /** Documento en Minio */
    documento_minio : string;
}