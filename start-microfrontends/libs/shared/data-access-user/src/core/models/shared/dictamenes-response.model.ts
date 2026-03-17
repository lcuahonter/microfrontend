/**
 * Interfaz que define la estructura de un dictamen.
 * Utilizada para representar el estado y fechas clave de un dictamen específico.
 */
export interface DictamenesResponse {
    /**
     * ID único del dictamen en el sistema.
     */
    id_dictamen: number;
    
    /**
     * Fecha de creación del registro en formato YYYY-MM-DD HH:MM:SS.
     */
    fecha_creacion: string;
    
    /**
     * Fecha de emisión formal del dictamen (null si no aplica).
     */
    fecha_emision: string | null;
    
    /**
     * Fecha de autorización final (null si no aplica).
     */
    fecha_autorizacion: string | null;
    
    /**
     * Descripción del tipo de dictamen.
     */
    tipo: string;
    
    /**
     * Estado actual del dictamen.
     */
    estado_dictamen: string;
    
    /**
     * Sentido/resolución del dictamen.
     */
    sentido_dictamen: string;
}