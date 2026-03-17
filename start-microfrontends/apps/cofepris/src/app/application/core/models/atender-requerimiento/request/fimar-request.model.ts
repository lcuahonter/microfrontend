/**
 * Representa la solicitud de firmado que contiene la acción y la información de la firma.
 */
export interface FirmarRequest {
    /** Identificador de la acción que se va a ejecutar. */
    id_accion: string;

    /** Información de la firma digital asociada a la acción. */
    firma: Firma;
}

/**
 * Contiene la información necesaria para la firma digital.
 */
export interface Firma {
    /** Cadena original utilizada para generar la firma. */
    cadena_original: string;

    /** Número de serie del certificado digital utilizado. */
    cert_serial_number: string;

    /** Clave o identificador del usuario que firma. */
    clave_usuario: string;

    /** Fecha en la que se realizó la firma. */
    fecha_firma: string;

    /** Clave del rol del usuario firmante. */
    clave_rol: string;

    /** Sello digital generado a partir de la firma. */
    sello: string;

    /** Fecha de fin de vigencia del certificado. */
    fecha_fin_vigencia: string;

    /** Lista de documentos requeridos que deben ser firmados. */
    documentos_requeridos: DocumentosRequerido[];
}

/**
 * Representa la información de un documento requerido para la firma.
 */
export interface DocumentosRequerido {
    /** Identificador del documento seleccionado. */
    id_documento_seleccionado: number;

    /** Hash del documento para validación de integridad. */
    hash_documento: string;

    /** Sello digital específico del documento. */
    sello_documento: string;
}
