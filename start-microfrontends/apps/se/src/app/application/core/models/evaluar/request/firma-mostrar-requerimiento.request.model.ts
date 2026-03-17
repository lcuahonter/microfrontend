/**
 * Modelo de request para creación de requerimientos
 */
export interface MostrarFirmarRequerimientoRequest {
    /** Clave del usuario que realiza el requerimiento */
    cve_usuario: string;
    
    /** ID de la acción asociada al requerimiento */
    id_accion: string;
    
    /** Justificación del requerimiento */
    justificacion: string;
    
    /** Áreas involucradas en el requerimiento */
    areas?: string[];
    
    /** Documentos requeridos */
    documentos?: DocumentoRequerimiento[];
    
    /** IDs de documentos específicos */
    documentos_especificos?: number[];
    
    /** Alcance del requerimiento */
    alcance_requerimiento: string;
    
    /** Información del solicitante */
    solicitante: SolicitanteRequerimiento;

    /** Clave del rol del capturista */
    cve_rol_capturista?: string;
}

/**
 * Modelo para documentos del requerimiento
 */
export interface DocumentoRequerimiento {
    /** ID del documento de solicitud */
    id_documento_solicitud: number;
    
    /** ID del tipo de documento */
    id_tipo_documento: number;
    
    /** Indica si el documento es requerido */
    requerido: boolean;
}

/**
 * Modelo para información del solicitante
 */
export interface SolicitanteRequerimiento {
    /** Nombre del solicitante */
    nombre: string;
    
    /** Apellido paterno del solicitante */
    apellido_paterno: string;
    
    /** Apellido materno del solicitante */
    apellido_materno: string;
    
    /** RFC del solicitante */
    rfc: string;
}