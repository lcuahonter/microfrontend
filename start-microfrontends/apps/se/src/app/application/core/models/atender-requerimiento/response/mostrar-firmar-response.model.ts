/**
 * Respuesta al mostrar la información relacionada con el proceso de firmado de un requerimiento.
 */
export interface MostrarFirmarResponse {
    /** Fecha en que se realizó la firma */
    fecha_firma: Date;

    /** Cadena original del requerimiento a atender */
    cadena_original_atender_requerimiento: string;

    /** Lista de cadenas originales de los documentos requeridos */
    caderna_original: CadernaOriginal[];

    /** Información detallada del requerimiento */
    requerimiento: Requerimiento;
}

/**
 * Representa los datos de un documento dentro de la cadena original.
 */
export interface CadernaOriginal {
    /** Identificador del documento seleccionado */
    id_documento_seleccionado: number;

    /** Hash del documento asociado */
    hash_documento: string;
}

/**
 * Representa la información de un requerimiento asociado al trámite.
 */
export interface Requerimiento {
    /** Identificador único del requerimiento */
    id_requerimiento: number;

    /** Identificador del estado del requerimiento */
    id_est_requerimiento: string;

    /** Estado actual del requerimiento (ej. autorizado, pendiente, rechazado) */
    estado_requerimiento: string;

    /** Identificador del tipo de requerimiento */
    id_tipo_requerimiento: string;

    /** Clave del área correspondiente, si aplica */
    cve_area: null;

    /** Justificación proporcionada para el requerimiento */
    justificacion: string;

    /** Descripción adicional del requerimiento */
    descripcion: null;

    /** Fecha en que fue autorizado el requerimiento */
    fecha_autorizacion: Date;

    /** Fecha en que fue verificado, si aplica */
    fecha_verificacion: null;

    /** Fecha de creación del requerimiento */
    fecha_creacion: Date;

    /** Fecha de emisión del requerimiento */
    fecha_emision: Date;

    /** Fecha en que fue atendido, si aplica */
    fecha_atencion: null;

    /** Descripción de la atención del requerimiento */
    desc_atencion_requerimiento: null;

    /** Número de folio del trámite asociado */
    num_folio_tramite: string;

    /** Identificador del motivo de rechazo, si aplica */
    id_motivo_rechd_ttra: null;

    /** Fundamento legal del requerimiento, si aplica */
    fundamento: null;

    /** Motivo del requerimiento, si aplica */
    motivo: null;

    /** Siglas del participante externo relacionado al requerimiento */
    siglas_participante_externo: null;

    /** Motivo específico del requerimiento */
    motivo_requerimiento: null;

    /** Alcance del requerimiento */
    alcance_requerimiento: string;

    /** Número de oficio del requerimiento */
    numero_oficio_requerimiento: null;

    /** Número de días para subsanar el requerimiento */
    dias_subsanar: null;
}
