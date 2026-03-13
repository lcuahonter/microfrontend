/**
 * Respuesta paginada del listado de facturas de expedición
 */
export interface FacturasTplResponse {
    /** Listado de facturas en la página actual */
    content: FacturaExpedicionResponse[];
    
    /** Metadatos de paginación y ordenamiento */
    pageable: PageableResponse;
    
    /** Indica si es la última página disponible */
    last: boolean;
    
    /** Total de elementos existentes en todas las páginas */
    totalElements: number;
    
    /** Total de páginas disponibles */
    totalPages: number;
    
    /** Indica si es la primera página */
    first: boolean;
    
    /** Cantidad de elementos por página */
    size: number;
    
    /** Número de página actual (base 0) */
    number: number;
    
    /** Configuración de ordenamiento aplicada */
    sort: SortResponse[];
    
    /** Cantidad de elementos en la página actual */
    numberOfElements: number;
    
    /** Indica si la respuesta no contiene elementos */
    empty: boolean;
}

/**
 * Detalle de una factura de expedición individual
 */
export interface FacturaExpedicionResponse {
    /** ID único de la factura en el sistema */
    id_factura_expedicion: number;
    
    /** Número de factura asignado por el emisor */
    num_factura: string;
    
    /** Razón social del consignatario/emisor */
    razon_social_consig_emisor: string;
    
    /** Dirección fiscal del consignatario/emisor */
    direccion_consig_emisor: string;
    
    /** 
     * Fecha de expedición en formato DD-MM-YYYY HH:mm:ss 
     * @example "17-02-2025 00:00:00"
     */
    fecha_expedicion: string;
    
    /** Cantidad de unidades facturadas */
    cantidad: number;
    
    /** Descripción de la unidad de medida */
    descripcion: string;
    
    /** Importe total en dólares estadounidenses */
    imp_dls: number;
    
    /** Cantidad total original sin devoluciones */
    cantidad_total: number;
    
    /** Cantidad devuelta en esta transacción */
    cantidad_devolucion: number;
    
    /** Suma acumulada de cantidades devueltas */
    suma_cantidad_devolucion: number;
    
    /** Cantidad disponible para operaciones */
    cantidad_disponible: number;
}

/**
 * Metadatos de configuración de paginación
 */
export interface PageableResponse {
    /** Número de página actual (base 0) */
    pageNumber: number;
    
    /** Tamaño de página solicitado */
    pageSize: number;
    
    /** Criterios de ordenamiento aplicados */
    sort: SortResponse[];
    
    /** Offset actual de registros */
    offset: number;
    
    /** Indica si la consulta está paginada */
    paged: boolean;
    
    /** Indica si la consulta no está paginada */
    unpaged: boolean;
}

/**
 * Criterio de ordenamiento
 */
export interface SortResponse {
    /** 
     * Nombre de la propiedad por la que se ordena 
     * @example "fecha_expedicion"
     */
    property?: string;
    
    /** 
     * Dirección del ordenamiento (ASC/DESC) 
     * @example "DESC"
     */
    direction?: string;
    
    /** 
     * Indica si el ordenamiento ignora mayúsculas/minúsculas 
     * @default true
     */
    ignoreCase?: boolean;
    
    /** 
     * Estrategia de ordenamiento 
     * @example "AUTO"
     */
    nullHandling?: string;
    
    /** 
     * Indica si el orden es ascendente 
     * @deprecated Usar direction en su lugar
     */
    ascending?: boolean;
}