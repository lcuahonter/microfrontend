/**
 * Modelo de respuesta para declaraciones
 */
export interface DeclaracionResponse {
    /** Clave de la declaración */
    cve_declaracion: string;
    
    /** Descripción de la declaración */
    descripcion: string;
    
    /** Indica si acepta la declaración (0 = no, 1 = sí) */
    acepto: number;
}