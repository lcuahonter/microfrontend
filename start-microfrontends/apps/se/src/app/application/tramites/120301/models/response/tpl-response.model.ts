/** Interfaz que representa la estructura de respuesta de una plantilla de asignación textil. */
export interface TplResponse {
    /** Número de constancia o certificado. */
    num_constancia: string;
    
    /** Fracción arancelaria asociada. */
    fraccion_arancelaria: string;
    
    /** Clasificación del régimen aplicable. */
    clasificacion_regimen: string;
    
    /** Nombre del país relacionado. */
    pais: string;
    
    /** Descripción de la categoría textil. */
    desc_categoria_textil: string;
    
    /** Fecha de inicio de vigencia (formato YYYY-MM-DD). */
    fecha_inicio: string;
    
    /** Fecha de fin de vigencia (formato YYYY-MM-DD). */
    fecha_fin: string;
    
    /** ID del mecanismo de asignación. */
    id_mecanismo_asignacion: number;
    
    /** Clave del país (código abreviado). */
    cve_pais: string;
    
    /** ID de la categoría textil. */
    id_categoria_textil: number;
    
    /** ID de la fracción HTS (Sistema Armonizado) de USA. */
    id_fraccion_hts_usa: number;
    
    /** ID único de la asignación. */
    id_asignacion: number;
}