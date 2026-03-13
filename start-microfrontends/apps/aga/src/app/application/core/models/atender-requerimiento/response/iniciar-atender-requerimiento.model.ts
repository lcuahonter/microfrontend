/**
 * Modelo de respuesta para iniciar atención de requerimiento
 */
export interface IniciarAtenderRequerimientoResponse {
    /** Justificación del requerimiento */
    justificacion: string;
    
    /** Fecha de generación del requerimiento */
    fecha_generacion: string;
    
    /** Listado de documentos asociados al requerimiento */
    documentos: DocumentoRequerimiento[];

    /**
     * Alcance del requerimiento Datos/Documentos/Datos y Documentos
     */
    alcance_requerimiento?: string;
}

/**
 * Modelo para documentos del requerimiento
 */
export interface DocumentoRequerimiento {
    /** ID del documento de solicitud */
    id_documento_solicitud: number;
    
    /** ID único del documento */
    id_documento: number;
    
    /** Nombre del documento */
    nombre: string;
    
    /** ID del tipo de documento */
    id_tipo_documento: number;
    
    /** Nombre del tipo de documento */
    tipo_documento: string;
    
    /** Estado actual del documento de solicitud */
    estado_documento_solicitud: string;
    
    /** Indica si el documento es requerido */
    requerido: boolean;
    
    /** ID del documento en el requerimiento */
    id_documento_requerimiento: number;
    
    /** ID del documento electrónico */
    id_e_document: string;

    /** UUID del documento */
    documento_uuid: string;
}