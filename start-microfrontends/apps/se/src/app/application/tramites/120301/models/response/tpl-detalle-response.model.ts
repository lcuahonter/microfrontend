/**
 *  Modelo de salida para el tramite 120301.
 * Interfaz que representa la estructura detallada de tpl.
 */
export interface TplDetalleResponse {
    /** ID único del mecanismo de asignación. */
    id_mecanismo_asignacion: number;
    
    /** ID único del cupo asignado. */
    id_cupo: number;
    
    /** Fracción arancelaria completa. */
    fraccion_arancelaria: string;
    
    /** Descripción detallada del producto. */
    descripcion_producto: string;
    
    /** Tratado o bloque comercial aplicable. */
    tratado_bloque: string;
    
    /** Clasificación específica del subproducto (puede estar vacío). */
    clasificacion_subproducto: string;
    
    /** Tipo de mecanismo de asignación aplicado. */
    mecanismo_asignacion: string;
    
    /** Código de categoría textil. */
    categoria_textil: string;
    
    /** Régimen aplicable (Exportación/Importación). */
    regimen: string;
    
    /** Descripción detallada de la categoría textil. */
    descripcion_categoria_textil: string;
    
    /** Unidad de medida para el cupo. */
    unidad_medida: string;
    
    /** Fecha de inicio de vigencia (formato DD/MM/YYYY). */
    fecha_inicio_vigencia: string;
    
    /** Fecha de fin de vigencia (formato DD/MM/YYYY). */
    fecha_fin_vigencia: string;
    
    /** Factor de conversión aplicable. */
    factor_conversion: number;
    
    /** ID de la categoría textil. */
    id_categoria_textil: number;
    
    /** Identificador único del régimen. */
    identificador_regimen: string;
    
    /** País de origen o destino. */
    pais_origen_destino: string;
    
    /** Código de país (normalmente siglas de 3 letras). */
    codigo_pais: string;
    
    /** Indica si requiere descripción detallada de la mercancía. */
    descripcion_mercancia: boolean;
    
    /** ID de la fracción HTS (Sistema Armonizado) de USA. */
    id_fraccion_hts_usa: number;
    
    /** Unidad de medida oficial. */
    unidad_medida_oficial: string;
    
    /** Monto disponible para asignación. */
    monto_disponible: number;
    
    /** Indica si se debe solicitar mercancía (puede ser nulo). */
    solicitar_mercancia: boolean | null;
    
    /** Fracción HTS USA específica (puede ser nulo). */
    fraccion_hts_usa: string | null;
}