/**
 * Modelo para guardar el requerimiento
 */
export interface GuardarRequerimiento {
    /** ID de la acción a realizar */
    id_accion: string;
    /** Clave del usuario que realiza la acción */
    cve_usuario:string;
    /** Justificación del requerimiento */
    justificacion: string;
    /** Lista de documentos requeridos */
    documentos?: Documento[];
    /** IDs de documentos específicos */
    documentos_especificos?: number[];
    /** Alcance o descripción detallada del requerimiento */
    alcance_requerimiento?: string;
}

export interface Documento {
   /** ID del documento de solicitud */
    id_documento_solicitud: number;
    /** ID del tipo de documento */
    id_tipo_documento: number;
    /** Indica si el documento es requerido */
    requerido: boolean;
}
