/**
 * Representa la solicitud para generación de cadena original
 */
export interface CadenaOriginalRequest {
    /** Fecha de firma en formato ISO string */
    fecha_firma: string;

    /** ID único de la notificación */
    id_notificacion?: number;
    
    /** Fecha y hora de envío de la notificación */
    fecha_envio_notificacion?: string;
    
    /** Tipo de notificación */
    tipo_notificacion?: string;
    
    /** Información del usuario que realiza la firma */
    usuario: Usuario;
}

/**
 * Datos del usuario que realiza el trámite
 */
export interface Usuario {
    /** Apellido materno del usuario */
    apellido_materno: string;
    
    /** RFC del usuario */
    rfc: string;
    
    /** Nombre(s) del usuario */
    nombre: string;
    
    /** Apellido paterno del usuario */
    apellido_paterno: string;
}