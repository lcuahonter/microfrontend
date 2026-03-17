/**
 * Modelo de respuesta para detalle dictamen
 */
export interface DictamenDetalleResponse {
    /** ID único del dictamen */
    id_dictamen: number;
    
    /** Estado actual del dictamen */
    estado_dictamen: string;
    
    /** Sentido o resolución del dictamen */
    sentido_dictamen: string;
    
    /** Fecha de creación del dictamen */
    fecha_creacion: string;
    
    /** Tipo de dictamen */
    tipo_dictamen: string;
    
    /** Nombre de quien dictaminó */
    dictaminado: string;
    
    /** Fecha de emisión del dictamen */
    fecha_emision: string;
    
    /** Fecha de verificación del dictamen */
    fecha_verificacion: string;
    
    /** Nombre de quien verificó */
    verificado: string;
    
    /** Nombre de quien autorizó */
    autorizado: string;
    
    /** Fecha de autorización */
    fecha_autorizacion: string;
    
    /** Justificación del dictamen */
    justificacion: string;
    
    /** Fecha de inicio de vigencia */
    fecha_inicio_vigencia: string;
    
    /** Fecha de fin de vigencia */
    fecha_fin_vigencia: string;
    
    /** Texto completo del dictamen */
    texto_dictamen: string;
    
    /** Listado de observaciones asociadas */
    observaciones: ObservacionDictamen[];
}

/**
 * Modelo para observaciones de dictámenes
 */
export interface ObservacionDictamen {
    /** Fecha de atención de la observación */
    fecha_atencion: string;
    
    /** Fecha de la observación */
    fecha_observacion: string;
    
    /** Nombre de la persona */
    nombre: string;
    
    /** Apellido paterno */
    apellido_paterno: string;
    
    /** Apellido materno */
    apellido_materno: string;
    
    /** Texto de la observación */
    observacion: string;
    
    /** Estado de la observación */
    estado_observacion: string;
    
    /** ID único de la observación */
    id_observacion: number;
}