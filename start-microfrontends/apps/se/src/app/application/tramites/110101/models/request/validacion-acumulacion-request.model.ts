/**
 * Modelo de request para consulta de acumulacion de fracción arancelaria con tratados
 */
export interface AcumulacionFraccionTratadosRequest {
    /** Clave de la fracción arancelaria */
    clave_fraccion_arancelaria: string | null;
    
    /** Tratados seleccionados */
    tratados_seleccionados: TratadoSeleccionadoFraccion[];
}

/**
 * Modelo para tratado seleccionado de fracción
 */
export interface TratadoSeleccionadoFraccion {
    /** Clave del grupo de criterio */
    cve_grupo_criterio: string | null;
    
    /** Clave del tratado o acuerdo */
    cve_tratado_acuerdo: string | null;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number | null;
}