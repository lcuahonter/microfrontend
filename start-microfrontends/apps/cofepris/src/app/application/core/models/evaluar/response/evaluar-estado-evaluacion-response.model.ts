/**
 * Modelo de respuesta para opciones de evaluación
 */
export interface EvaluacionOpcionResponse {
    /** Estado actual de la evaluación */
    estado_evaluacion: string;
    
    /** Clave de la opción seleccionada */
    cve_opcion: string;
    
    /** Tipo de opinión generada */
    opinion: string;
}

/** IniciarDictamenResponse */
export interface GenerarDictamenResponse {
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
    /** Nombre del sentido del dictamen */
    nombre_sentido_dictamen?:string;
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
    numero_folio_alterno: number | string;
    /** Indica si aplica la ley aduanera 144a */
    aplica_ley_aduanera_144a: boolean;
    /** Historial de observaciones del dictamen */
    historial_observaciones: HistorialObservacione[];
    /** Indica si el dictaminador califica como exportador */
    calificacion_dictaminador_exportador?: boolean;
    /** Indica si el dictaminador califica como exportador JPN */
    calificacion_dictaminador_exportador_jpn?:boolean;
    /** Indica si la descripción ALADI es correcta */
    calificacion_descripcion_aladi?: boolean;
    /** Indica si tiene fracción ALADI */
    tiene_fraccion_aladi?:boolean;
    /** Indica si el dictaminador califica al exportador */
    dictaminador_califica_exportador?:boolean;
    /** Indica si el dictaminador califica al exportador JPN */
    dictaminador_califica_exportador_jpn?:boolean;

    usoAutorizadoDictamen:string | null;
    descripcionUsoAutorizado:string | null;
    idRestriccionTipoTramites:string[] | [];
    plazoVigencia:number | null;
    fechaFinVigencia:string | null;
    justificacionNegativa:string | null;
    observacion:string | null;
    idMotivoTipoTramites:string[] | [];
    numMuestras:string | null;
    siglasDictaminador:string | null;
    numeroGenerico1:string | null;
    aceptada?:boolean | null;
    ide_sentido_dictamen?:string | null;
    descripcionObjetoimportacion?: string | null;
    descripcionDetalladaMercancia?: string | null;
    idClasificacionToxicologicaTipoTramite?: string | null;
    blnGenerico1?: boolean | null;
    descripcion_objetoimportacion?: string | null;
    descripcion_detallada_mercancia?:string | null;
    id_clasificacion_toxicologica_tipo_tramite?: string | null;
    id_motivo_tipo_tramites?: string[] | [];
    paisesFacturador?: string[] | null;
    paisesFormula?: string[] | null;
    idRestriccionTipoTramite?: string | null;
    descripcionObjetoImportacion?: string | null;
    
    fundamento_del_dictamen?: string | null;
    descripcion_fundamento_del_dictamen?: string | null;
    justificacion_del_dictamen?: string | null;
    descripcion_justificacion_del_dictamen?: string | null;
    requesito_cumplir?: string | null;
    tipo_analisis?: string | null;
    
    negativo_del_dictamen?: boolean | null;
    descripcion_negativo_del_dictamen?: string | null;
    fundamento_oficio_del_dictamen?: string | null;
    descripcion_fundamento_oficio_del_dictamen?: string | null;
    observaciones?:any[]|null;
    tipoAnalisis?:string | null;
    fundamentoDelDictamen?:string | null;
    descripcionFundamentoDelDictamen?:string | null;
    justificacionDelDictamen?:string | null;
    descripcionJustificacionDelDictamen?:string | null;
    requesitoCumplir?:string | null;
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
    nombre?: string,
    apellido_paterno?: string,
    apellido_materno?: string,
}