/**
 * Representa el modelo la respuesta de datos del detalle de la opinión
 */
export interface OpinionDetalleResponse {
    /** Fecha y hora de cuando se realizó la solicitud */
    fecha_solicitud: string;
    
    /** Identificador único de la opinión generada */
    id_opinion: number;
    
    /** Clave del estado actual de la opinión */
    ide_est_opinion: string;
    
    /** Descripción del estado actual de la opinión */
    estado_opinion: string;
    
    /** Nombre del área que solicitó la opinión */
    area_solicitante: string;
    
    /** Nombre del área responsable de emitir la opinión */
    area_responsable: string;
    
    /** Fecha y hora de atención (null si no ha sido atendida) */
    fecha_atencion: string | null;
    
    /** Fecha de generación de la opinión en formato DD-MM-YYYY */
    fecha_generacion: string;
    
    /** Justificación proporcionada para la opinión (null si no aplica) */
    justificacion: string | null;
    
    /** Nombre del profesional que dictaminó (null si no aplica) */
    dictaminador: string | null;
    
    /** Nombre de la dependencia relacionada (null si no aplica) */
    dependencia: string | null;
    
    /** Identificador de la dependencia (null si no aplica) */
    id_dependencia: number | null;
    
    /** Clave que identifica el sentido/resolución de la opinión */
    ide_sent_opinion: string;
    
    /** Descripción del sentido/resolución de la opinión */
    sentido_opinion: string;
    
    /** Clave del usuario que generó la opinión */
    clave_usuario: string;
    
    /** Nombre completo del emisor de la opinión */
    emisor_opinion: string;
    
    /** Descripción detallada del propósito de la opinión */
    descripcion_opinion: string;
    
    /** Listado de documentos asociados a la opinión */
    documento_opinion: DocumentoOpinion[];
}

/**
 * Modelo para documentos asociados a la opinion
 */
export interface DocumentoOpinion {
    /** ID de la opinión a la que pertenece el documento */
    id_opinion: number;
    
    idOpinion: number;

    /** Descripción del área solicitante */
    descripcion_solicitante: string;
    
    descripcionSolicitante: string;

    /** ID único del documento (null si no aplica) */
    id_documento: number | null;
    
    /** Nombre original del archivo adjunto */
    nombre_archivo: string;

    nombreArchivo: string;
    
    /** Contenido electrónico del documento (null si no aplica) */
    e_document: string | null;
}