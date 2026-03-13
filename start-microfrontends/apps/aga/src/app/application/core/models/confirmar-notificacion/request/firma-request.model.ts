/**
 * Solicitud de firma electrónica para un trámite/documento
 */
export interface FirmaRequest {
    /** Identificador único de la acción a firmar */
    id_accion: string;
    
    /** Datos completos de la firma electrónica */
    firma: Firma;
}

/**
 * Detalles completos de una firma electrónica
 */
export interface Firma {
    /** Cadena original del documento que se está firmando */
    cadena_original: string;
    
    /** Número de serie del certificado digital usado para firmar */
    cert_serial_number: string;
    
    /** Identificador único del usuario que firma */
    clave_usuario: string;
    
    /** Fecha y hora de la firma en formato ISO */
    fecha_firma: string;
    
    /** Rol o perfil del firmante dentro del sistema */
    clave_rol: string;
    
    /** Sello digital generado por la firma */
    sello: string;
}