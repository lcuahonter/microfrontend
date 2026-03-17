/**
 * Interfaz que define la estructura de un requerimiento.
 * Utilizada para representar el estado y fechas clave de un requerimiento específico.
 */
export interface RequerimientosResponse {
    /**
     * Estado actual del requerimiento.
     */
    estado_requerimiento: string | null;
    
    /**
     * Fecha de creación del requerimiento.
     */
    fecha_creacion: string;
    
    /**
     * Fecha de emisión del requerimiento.
     */
    fecha_emision: string;
    
    /**
     * Fecha de atención del requerimiento.
     */
    fecha_atencion: string;
    
    /**
     * ID único del requerimiento.
     */
    id_requeriminento: number;
    
    /**
     * Código del estado del requerimiento.
     */
    id_est_requerimiento: string;

    /**
     * Estado del requerimiento en formato opcional.
     */
    estadoRequerimiento?: string;
}