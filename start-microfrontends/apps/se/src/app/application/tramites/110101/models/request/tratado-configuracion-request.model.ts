/**
 * Modelo de request para criterios de tratados configuracion
 */
export interface CriterioConfiguracionRequest {
    /** Clave del grupo de criterio */
    cve_grupo_criterio: string;
    
    /** Clave del tratado o acuerdo */
    cve_tratado_acuerdo: string | null;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number;
}