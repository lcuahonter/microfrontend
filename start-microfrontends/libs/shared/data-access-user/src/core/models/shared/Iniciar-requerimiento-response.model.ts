/** IniciarRequerimientoResponse */
export interface IniciarRequerimientoResponse {
    /** ID del requerimiento iniciado */
    id_requerimiento: number;
    /** Justificación del requerimiento */
    justificacion: string;
    /** Indica si contiene área específica */
    contiene_area: string;
    /** Indica si puede generar requerimiento de datos */
    puede_generar_requerimiento_datos: boolean;
    /** Indica si debe mostrar el campo de área */
    mostrar_contiene_area: boolean;
    /** Indica si requiere autorizador */
    requiere_autorizador: boolean;
    /** Indica si requiere documentos específicos */
    requiere_doc_especificos: boolean;
    /** Lista de documentos requeridos */
    documentos: Documentos[];
    /** Lista de áreas y dependencias disponibles */
    areas_dependencias: AreasDependencia[];
    /** Alcances del requerimiento */
    alcances_requerimiento?: AreasDependencia[];
    /** tipo de requerimiento */
    alcance_requerimiento?: string;
    // tipo requerimiento
    tipo_requerimiento?: string;
    /** Observacion en una autorizacion de requerimiento*/
    observaciones?: Observacion[];
    /** Historial de observaciones del dictamen */
    historial_observaciones: HistorialObservacione[];
    id_tipo_requerimiento?: string;
    motivo?: string;
    fundamento?: string;
    siglas_participante_externo?: string;
    estado_requerimiento?: string;
    id_est_requerimiento?: string;
    cve_area?: string;
    descripcion?: string;
    fecha_autorizacion?: string;
    fecha_verificacion?: string;
    fecha_creacion?: string;
    fecha_emision?: string;
    fecha_atencion?: string;
    desc_atencion_requerimiento?: string;
    num_folio_tramite?: string;
    id_motivo_rechd_ttra?: string;
    motivo_requerimiento?: string;
    numero_oficio_requerimiento?: string;
    dias_subsanar?: number;
    documentos_especificos?: Documentos[];
}

/** AreasDependencia */
export interface AreasDependencia {
    /** Descripción del área o dependencia */
    descripcion: string;
    /** Clave identificadora del área o dependencia */
    clave: string;
}

/** Documentos */
export interface Documentos {
    /** ID del documento solicitud */
    id_documento_solicitud: number;
    /** ID del documento */
    id_documento: number;
    /** Nombre del documento */
    nombre: string;
    /** ID del tipo de documento */
    id_tipo_documento: number;
    /** Tipo de documento */
    tipo_documento: string;
    /** Estado del documento solicitud */
    estado_documento_solicitud: string;
    /** Indica si es requerido */
    requerido: boolean;
    /** ID del documento requerimiento */
    id_documento_requerimiento: null;
    /** ID del e-document */
    id_e_document: string;
    /** UUID del documento */
    documento_uuid?: string;


}

/** Observacion en una autorizacion de requerimiento*/
export interface Observacion {
    id_observacion?: number;
    fecha_observacion?: string;
    fecha_atencion?: string | null; // Puede venir null
    nombre_completo?: string;
    estado_observacion?: string;
    observacion?: string;
    ide_estado_observacion?: string;
    cve_usuario?: string;
    id_dictamen?: number | null;
    id_requerimiento?: number | null;
    id_opinion?: number | null;
    persona?: Persona;
    fechaObservacion?: string;
    fechaAtencion?: string | null;
    estadoObservacion?: string;
    generadaPor?: string;
    estatusObservacion?: string;
}

export interface Persona {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
}

/** HistorialObservacione */
export interface HistorialObservacione {
    /** ID de la observación */
    id_observacion: number;
    /** ID del estado de la observación */
    ide_estado_observacion: string;
    /** Estado de la observación */
    estado_observacion: string;
    /** Observación */
    observacion: string;
    /** Clave del usuario */
    cve_usuario: string;
    /** Fecha de la observación */
    fecha_observacion: string;
    /** Fecha de atención de la observación */
    fecha_atencion: string;
    /** ID del dictamen relacionado */
    id_dictamen: number;
    /** ID del requerimiento relacionado */
    id_requerimiento: number;
    /** ID de la opinión relacionada */
    id_opinion: number;
}

