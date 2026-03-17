/**
 * Modelo de respuesta para validación de acumulación
 */
export interface ValidacionAcumulacionResponse {
    /** Indica si hay errores (null si no aplica) */
    has_errors: boolean | null;
    
    /** Mensaje de error (null si no aplica) */
    error_message: string | null;
    
    /** Indica si cumple con la acumulación */
    cumple_acumulacion: boolean;
}