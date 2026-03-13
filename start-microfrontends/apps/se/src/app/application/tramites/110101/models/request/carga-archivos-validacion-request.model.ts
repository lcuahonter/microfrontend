import { ElementoValido } from "../response/archivo-mercancia-response.model";

/**
 * Modelo de respuesta para elementos procesados
 */
export interface ElementosProcesadosRequest {
    /** Items procesados */
    items: ElementoValido[];
    
    /** Tratados seleccionados */
    tratados_seleccionados: TratadoSeleccionado[];
    
    /** Indica si el peso es requerido */
    peso: boolean;
    
    /** Indica si el volumen es requerido */
    volumen: boolean;
}

/**
 * Modelo para tratado seleccionado
 */
export interface TratadoSeleccionado {
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number | null;
    
    /** Clave del grupo de criterio */
    cve_grupo_criterio: string | null;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** Clave del tratado o acuerdo */
    cve_tratado_acuerdo: string | null;
}