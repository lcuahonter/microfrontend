/** Firmar120301Request */
export interface Firmar130120Request {
    /** Cadena original para verificación de firma */
    cadena_original: string;
    /** Número de serie del certificado digital */
    cert_serial_number: string;
    /** Clave del usuario que firma */
    clave_usuario: string;
    /** Fecha y hora de la firma */
    fecha_firma: string;
    /** Clave del rol del firmante */
    clave_rol: string;
    /** Sello digital de la firma */
    sello: string;
    /** Fecha de fin de vigencia del certificado */
    fecha_fin_vigencia: string;
    /** Documentos requeridos para la firma */
    documentos_requeridos: DocumentosRequerido[];
}

/** DocumentosRequerido */
export interface DocumentosRequerido {
    /** ID del documento seleccionado */
    id_documento_seleccionado: number;
    /** Hash del documento para verificación */
    hash_documento: string;
    /** Sello digital del documento */
    sello_documento: string;
}