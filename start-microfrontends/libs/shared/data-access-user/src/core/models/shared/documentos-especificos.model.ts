/**
 * Modela la respuesta de los documentos específicos generados para el requerimiento del trámite 130118
 */
export interface DocumentosEspecificosResponse {
    /**
     * ID del tipo de documento generado
     */
    id_tipo_documento: number;

    /**
     * Nombre del documento generado
     */
    documento: string;
}
