/** IniciarAutorizacionResponse */
export interface IniciarAutorizacionResponse {
    /** ID del dictamen */
    id_dictamen: number;
    /** ID del tipo de dictamen */
    ide_tipo_dictamen: string;
    /** ID del estado del dictamen */
    ide_est_dictamen: string;
    /** Estado del dictamen */
    estado_dictamen: string;
    /** Fecha de creación del dictamen */
    fecha_creacion: string;
    /** Fecha de emisión del dictamen */
    fecha_emision: string;
    /** Fecha de observación del dictamen */
    fecha_observacion: string;
    /** Fecha de autorización del dictamen */
    fecha_autorizacion: string;
    /** Fecha de verificación del dictamen */
    fecha_verificacion: string;
    /** Fecha de cita del dictamen */
    fecha_cita: string;
    /** ID del sentido del dictamen */
    ide_sent_dictamen: string;
    /** Sentido del dictamen */
    sentido_dictamen: string;
    /** Texto del dictamen */
    texto_dictamen: string;
    /** Justificación del dictamen */
    justificacion: string;
    /** Opinión del dictamen */
    opinion: string;
    /** Número de folio del trámite */
    num_folio_tramite: string;
    /** Fecha de inicio de vigencia */
    fecha_inicio_vigencia: string;
    /** Fecha de fin de vigencia */
    fecha_fin_vigencia: string;
    /** Plazo en años */
    plazo_anios: string;
    /** Plazo en meses */
    plazo_meses: string;
    /** Número de folio externo */
    numero_folio_externo: string;
    /** Plazo total */
    plazo: string;
    /** ID del tipo de dictamen */
    id_tipo_dictamen: number;
    /** Número de folio alterno */
    numero_folio_alterno: string;
    /** Indica si aplica la ley aduanera 144a */
    aplica_ley_aduanera_144a: boolean;
    /** Indica si el dictaminador califica como exportador */
    calificacion_dictaminador_exportador?: boolean | null;
    /** Indica si el dictaminador califica como exportador JPN */
    calificacion_dictaminador_exportador_jpn?:boolean | null;
    /** Indica si la descripción ALADI es correcta */
    calificacion_descripcion_aladi?: boolean | null;
    /** Indica si tiene fracción ALADI */
    mostrar_calificacion_ue?:boolean | null;
    /** Indica si el dictaminador califica al exportador JPN */
    mostrar_calificacion_jpn?:boolean | null;

    historial_observaciones?: HistorialObservaciones[];
}

/** Historial de observaciones */
export interface HistorialObservaciones {
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