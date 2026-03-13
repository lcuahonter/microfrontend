/**
 * Interfaz que define la estructura de la respuesta de acuses de resolución.
 * Utilizada para representar los acuses de resolución asociados a un trámite.
 */
export interface AcusesResolucionResponse {
    /**
     * Identificador del trámite asociado a los acuses de resolución.
     */
    acuses: Acus[];
    /**
     * Lista de documentos oficiales asociados a los acuses de resolución.
     */
    documentos_oficiales: Acus[];
}

/**
 * Interfaz que define la estructura de un acuse de resolución.
 * Utilizada para representar un acuse de resolución específico.
 */
export interface Acus {
    /**
     * Identificador único del acuse de resolución.
     */
    id_documento_oficial: number;
    /**
     * Identificador del trámite asociado al acuse de resolución.
     */
    desc_documento: string;
    /**
     * Fecha de emisión del acuse de resolución en formato YYYY-MM-DD HH:MM:SS.
     */
    documento_minio: null;
}
