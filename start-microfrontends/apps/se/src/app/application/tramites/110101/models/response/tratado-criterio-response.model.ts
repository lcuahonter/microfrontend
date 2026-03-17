/**
 * Modelo de respuesta para criterios de tratados
 */
export interface CriterioTratadoResponse {
    /** ID único del criterio de tratado */
    id_criterio_tratado: number;
    
    /** ID del bloque comercial (null si no aplica) */
    id_bloque: number | null;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number;
    
    /** Clave del grupo de criterio */
    cve_grupo_criterio: string;
    
    /** Nombre del país o bloque comercial */
    nombre_pais_bloque: string;
    
    /** Nombre del tratado o acuerdo */
    tratado_nombre: string;
    
    /** Clave del país (null si es bloque) */
    cve_pais: string | null;
    
    /** Mensaje de agregado (null si no aplica) */
    mensaje_agregado: string | null;

    /** Cve tratado acuerdo (null si no aplica)*/
    cve_tratado_acuerdo: string | null;
    
    /** Cve tratado acuerdo bloque (null si no aplica)*/
    cve_tratado_acuerdo_bloque: string | null;
}