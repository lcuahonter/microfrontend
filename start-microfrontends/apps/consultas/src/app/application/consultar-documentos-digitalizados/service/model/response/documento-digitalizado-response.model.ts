/**
 * Modelo de respuesta para consulta de documentos digitalizados
 */
export interface DocumentoDigitalizadoResponse {
    /** Listado de documentos encontrados */
    documentos: Documento[];
    
    /** Página actual de resultados */
    pagina_actual: number;
    
    /** Total de páginas disponibles */
    total_paginas: number;
    
    /** Total de registros encontrados */
    total_registros: number;
    
    /** Tamaño de página configurado */
    tamanio_pagina: number;
}

/**
 * Modelo para documento de consulta
 */
export interface Documento {
    /** ID único del documento */
    id_documento: number;
    
    /** ID del tipo de documento */
    id_tipo_documento: number;
    
    /** Nombre del tipo de documento */
    nombre_tipo_documento: string;
    
    /** Nombre del documento */
    nombre_documento: string;
    
    /** RFC del propietario del documento */
    rfc_propietario: string;
    
    /** RFC que realizó la consulta */
    rfc_consulta: string;
    
    /** Fecha de creación del registro */
    fecha_creacion: string;
    
    /** Identificador del documento electrónico */
    e_document: string;
    
    /**Uso exclusivo UI */
    selected?: boolean;
}