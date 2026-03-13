/**
 * Modelo de request para insumos y tratados
 */
export interface InsumoTratadosRequest {
    /** Datos del insumo */
    insumo: Insumo;
    
    /** Datos de la mercancía */
    mercancia: Mercancia;
    
    /** Tratados seleccionados para el insumo */
    tratados_seleccionados_insumo: TratadoSeleccionadoInsumo[];
}

/**
 * Modelo para datos del insumo
 */
export interface Insumo {
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** Nombre del insumo */
    nombre: string | null;
    
    /** Descripción del fabricante/productor */
    desc_fabricante_productor: string | null;
    
    /** Descripción del proveedor */
    desc_proveedor: string | null;
    
    /** Clave de la fracción arancelaria */
    cve_fraccion: string | null;
    
    /** Importe del valor */
    imp_valor: number | null;
    
    /** ID tipo de insumo */
    ide_tipo_insumo: string;
    
    /** Peso del insumo */
    peso: number | null;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** Volumen del insumo */
    volumen: boolean | null;
    
    /** RFC del fabricante/productor */
    rfc_fabricante_productor: string | null;
    
    /** Tratados originarios */
    tratados_originarios: TratadoOriginario[];
    
    /** Fracción arancelaria prevalidada */
    fraccion_arancelaria_prevalidada: boolean | null;
}

/**
 * Modelo para tratado originario
 */
export interface TratadoOriginario {
    /** ID del criterio de tratado */
    id_criterio_tratado: number;
    
    /** ID de la solicitud */
    id_solicitud: number;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number;
    
    /** Clave del tratado o acuerdo */
    cve_tratado_acuerdo: string;
    
    /** Clave del país */
    clave_pais: string;
    
    /** Clave del bloque */
    clave_bloque: string | null;
}

/**
 * Modelo para datos de mercancía
 */
export interface Mercancia {
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** Indica si el peso es requerido */
    peso_es_requerido: boolean | null;
    
    /** Indica si el volumen es requerido */
    volumen_es_requerido: boolean | null;
}

/**
 * Modelo para tratado seleccionado de insumo
 */
export interface TratadoSeleccionadoInsumo {
    /** ID del criterio de tratado */
    id_criterio_tratado: number;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number;
    
    /** Clave del tratado o acuerdo */
    cve_tratado_acuerdo: string;
    
    /** Clave del país */
    clave_pais: string;
    
    /** Clave del bloque */
    clave_bloque: string | null;
    
    /** Clave del grupo de criterio */
    cve_grupo_criterio: string;
}