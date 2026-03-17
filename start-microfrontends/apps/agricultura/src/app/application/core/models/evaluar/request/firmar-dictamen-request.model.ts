/** FirmarDictamenRequest */
export interface FirmarDictamenRequest {
    /** ID de la acción a realizar */
    id_accion: string;
    /** Datos de la firma electrónica */
    firma: Firma;
}

/** Firma */
export interface Firma {
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
}