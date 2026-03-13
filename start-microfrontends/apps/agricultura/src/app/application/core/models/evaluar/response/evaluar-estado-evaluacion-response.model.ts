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