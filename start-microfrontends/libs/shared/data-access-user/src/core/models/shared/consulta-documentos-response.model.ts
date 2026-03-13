/**
 * Modelo de respuesta para la consulta de documentos asociados a una solicitud.
 * Define la estructura completa de los datos devueltos al consultar documentos de la solicitud.
 */
export interface DocumentoSolicitud {
    /**
     * Identificador único del documento en la solicitud
     */
    id_documento_solicitud: number;

    /**
     * Documento
     */
    documento: Documento;

    /**
     * Código identificador del estado del documento en la solicitud
     */
    ide_est_documento_sol: string;

    /**
     * Descripción del estado actual del documento
     */
    estado_documento_solicitud: string;

    /**
     * Fecha de asociación del documento a la solicitud en formato YYYY-MM-DD HH:MM:SS
     */
    fecha_asociacion: string;

    /**
     * UUID del documento (opcional, puede ser null)
     */
    documento_uuid: string | null;
}

/**
 * Modelo de respuesta para la consulta de documentos.
 * Define la estructura completa de los datos devueltos al consultar documentos en.
 */
export interface Documento {
    /**
    * Detalles del documento asociado
    */

    fecha_fin_vigencia: string;

    /**
     * Fecha de inicio de vigencia del documento en formato YYYY-MM-DD HH:MM:SS
     */
    fecha_ini_vigencia: string;

    /**
     * Nombre del archivo del documento
     */
    nombre: string;

    /**
     * Tipo de documento
     */
    tipo_documento: string;
}