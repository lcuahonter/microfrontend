/**
 * Modelo de request para creación de requerimientos con firma
 */
export interface MostrarFirmarRequerimientoRequest {
    /** Clave del usuario que realiza el requerimiento */
    cve_usuario: string;

    /** ID de la acción asociada al requerimiento */
    id_accion: string;

    /** Justificación del requerimiento */
    justificacion: string;

    /** Motivo del requerimiento */
    motivo: string;

    /** Fundamento legal del requerimiento */
    fundamento: string;

    /** Siglas del participante externo */
    siglas_participante_externo: string;

    /** ID del motivo tipo trámite */
    id_motivo_tipo_tramite: number;

    /** Áreas involucradas en el requerimiento */
    areas: string[];

    /** Documentos requeridos */
    documentos: DocumentoRequerimiento[];

    /** IDs de documentos específicos */
    documentos_especificos: number[];

    /** Alcance del requerimiento */
    alcance_requerimiento: string;

    /** Información del solicitante */
    solicitante: SolicitanteRequerimiento;

    id_tipo_requerimiento?: string;
}

/**
 * Modelo para documentos del requerimiento
 */
export interface DocumentoRequerimiento {
    /** ID del documento de solicitud */
    id_documento_solicitud: number;

    /** ID del documento */
    id_documento: number;

    /** Nombre del documento */
    nombre: string;

    /** ID del tipo de documento */
    id_tipo_documento: number;

    /** Tipo de documento (descripción) */
    tipo_documento: string;

    /** Estado del documento de solicitud */
    estado_documento_solicitud: string;

    /** Indica si el documento es requerido */
    requerido: boolean;

    /** ID del documento requerimiento */
    id_documento_requerimiento: number;

    /** ID externo del documento */
    id_e_document: string;
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