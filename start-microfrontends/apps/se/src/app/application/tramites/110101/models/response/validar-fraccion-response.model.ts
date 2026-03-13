/**
 * Modelo de respuesta para validación de mercancía
 */
export interface FraccionValidarResponse {
    /** Descripción de la mercancía */
    descripcion: string;
    
    /** Indica si el peso es requerido */
    peso_requerido: number | null;
    
    /** Indica si el volumen es requerido */
    volumen_requerido: boolean | null;
    
    /** Detalles adicionales de la mercancía */
    mercancia: DetalleMercancia;
    
    /** Indica si hay errores en la validación */
    has_errors: boolean;
    
    /** Mensaje de error (null si no hay errores) */
    error_message: string | null;
    
    /** Indica si cumple con la acumulación */
    cumple_acumulacion: boolean;
}

/**
 * Modelo para detalles de mercancía
 */
export interface DetalleMercancia {
    /** Indica si el peso es requerido */
    peso_es_requerido: boolean | null;
    
    /** Indica si el volumen es requerido */
    volumen_es_requerido: boolean | null;
    
    /** Indica si el proceso es requerido */
    proceso_es_requerido: boolean;
    
    /** Indica si el peso textil es requerido */
    peso_textil_es_requerido: boolean;
    
    /** Descripción alterna modificada (null si no aplica) */
    descripcion_alterna_modificada: string | null;
    
    /** Procesos solicitados */
    procesos_solicitados: ProcesoSolicitado[];
}

/**
 * Modelo de respuesta para procesos solicitado
 */
export interface ProcesoSolicitado {
    /** ID único del proceso CEROR */
    id_proceso_ceror: number | null;
    
    /** Nombre del proceso */
    nombre: string | null;
    
    /** Fecha de inicio de vigencia */
    fec_ini_vigencia: string | null;
    
    /** Fecha de fin de vigencia (null si no aplica) */
    fec_fin_vigencia: string | null;
    
    /** Indica si el proceso está activo */
    activo: boolean | null;
    
    /** Indica si cumple con el proceso */
    cumple_proceso: boolean | null;
}