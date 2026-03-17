/**
 * Modelo de request para fraccion arancelaria
 */
export interface FraccionValidarRequest {
    /** Clave de la fracción arancelaria */
    clave_fraccion_arancelaria: string | null;
    
    /** Tipo de fracción arancelaria */
    tipo_fraccion_arancelaria: string | null;
    
    
    /** Datos de la mercancía */
    mercancia: MercanciaRequest;
    
    /** Tratados seleccionados */
    tratados_seleccionados: TratadoSeleccionado[];
}

/**
 * Modelo para datos de mercancía
 */
export interface MercanciaRequest {
    /** ID descripción alterna UE */
    id_descripcion_alterna_ue: number | null;
    
    
    /** ID descripción alterna AELC */
    id_descripcion_alterna_aelc: number | null;
    
    /** ID descripción alterna SGP */
    id_descripcion_alterna_sgp: number | null;
    
    /** ID descripción alterna ACE */
    id_descripcion_alterna_ace: number| null;
    
    /** Indica si requiere juegos o surtidos */
    requiere_juegos_o_surtidos: boolean | null;
    
    /** Indica si el peso es requerido */
    peso_es_requerido: boolean | null;
    
    /** Indica si el volumen es requerido */
    volumen_es_requerido: boolean | null;
    
    /** Fracción NALADI */
    fraccion_naladi: string | null;
    
    /** Fracción NALADISA 93 */
    fraccion_naladisa93: string | null;
    
    /** Fracción NALADISA 96 */
    fraccion_naladisa96: string | null;

    /** Fracción NALADISA 02 */
    fraccion_naladisa02: string | null;

    /** Tipo de proceso de mercancía */
    tipo_proceso_mercancia: string | null;

    /** Valor transaccional FOB */
    valor_transaccional_fob: number | null;

    /** Costo neto AP */
    costo_neto_ap: number | null;
}

/**
 * Modelo para tratados seleccionados
 */
export interface TratadoSeleccionado {
    /** Clave del grupo de criterio */
    cve_grupo_criterio: string | null;
    
    /** ID del bloque comercial */
    id_bloque: number | null;
    
    /** Clave del tratado o acuerdo */
    cve_tratado_acuerdo: string | null;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number | null;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** ID descripción alterna fracción */
    id_desc_alterna_fraccion: number | null;
    
    /** ID tipo proceso mercancía */
    ide_tipo_proceso_mercancia: string | null;
}