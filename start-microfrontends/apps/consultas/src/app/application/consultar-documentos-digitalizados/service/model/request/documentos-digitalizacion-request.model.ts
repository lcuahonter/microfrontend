/**
 * Modelo de request para consulta de documentos digitalizados
 */
export interface DocumentoDigitalizadoRequest {
    /** Opción de consulta */
    opcion_de_consulta: string;
    
    /** Documento electrónico */
    e_document: string;
    
    /** RFC que realiza la consulta */
    rfc_consulta: string;
    
    /** Fecha de inicio del periodo */
    fecha_inicio: string;
    
    /** Fecha de fin del periodo */
    fecha_fin: string;
    
    /** Configuración de paginación */
    paginacion?: PaginacionRequest;
    
    /** Datos de autorización */
    datos_autorizacion: DatosAutorizacionRequest;
}

/**
 * Modelo para configuración de paginación
 */
export interface PaginacionRequest {
    /** Número de página */
    page: number;
    
    /** Tamaño de página */
    page_size: number;
    
    /** Campo por el cual ordenar */
    sort_by: string;
    
    /** Dirección del ordenamiento */
    sort_direction: string;
}

/**
 * Modelo para datos de autorización
 */
export interface DatosAutorizacionRequest {
    /** RFC del propietario */
    rfc_propietario: string;
    
    /** Número de serie del certificado */
    cert_serial_number?: string;
    
    /** Indica si es usuario interno */
    es_usuario_interno?: boolean;
    
    /** Indica si el ingreso es con FIEL */
    ingreso_con_fiel?: boolean;
    
    /** Tipo de certificado */
    tipo_certificado?: string;
}