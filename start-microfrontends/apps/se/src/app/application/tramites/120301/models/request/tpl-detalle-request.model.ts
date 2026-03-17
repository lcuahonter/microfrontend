/**
 * Modelo de solicitud para el tramite 120301.
 * Este modelo define los campos necesarios para realizar una detalle de TPL.
 */
export interface TplDetalleRequest {
    
    /** ID único del mecanismo de asignación. */
    id_mecanismo_asignacion: number;
    
    /** Clave de la fracción arancelaria. */
    cve_fraccion: string;
    
    /** Código del país (normalmente siglas de 3 letras). */
    codigo_pais: string;
    
    /** ID de la categoría textil asociada. */
    id_categoria_textil: number;
    
    /** ID de la fracción HTS (Sistema Armonizado) de USA. */
    id_fraccion_hts_usa: number;
}