/**
 * Respuesta principal que contiene datos paginados de facturas TPL asociadas
 */
export interface FacturaTplAsociadaResponse {

    /** Arreglo de registros de asociación factura-expedición */
    content: AsociacionFacturaExpedicionResponse[];

    /** Metadatos de configuración de paginación */
    pageable: PageableResponse;

    /** Indica si es la última página */
    last: boolean;

    /** Número total de elementos en todas las páginas */
    totalElements: number;

    /** Número total de páginas disponibles */
    totalPages: number;

    /** Indica si es la primera página */
    first: boolean;

    /** Número de elementos por página */
    size: number;

    /** Número de página actual (base 0) */
    number: number;

    /** Criterios de ordenamiento aplicados */
    sort: SortResponse[];

    /** Número de elementos en la página actual */
    numberOfElements: number;

    /** Indica si el contenido está vacío */
    empty: boolean;

}

/**
 * Registro de asociación entre factura y expedición con detalles
 */
export interface AsociacionFacturaExpedicionResponse {
    /** ID único de la expedición */
    id_expedicion: number;

    /** ID único de la factura TPL */
    id_factura_expedicion: number;

    /** Cantidad asociada entre expedición y factura */
    cantidad_asociada: number;

    /** Información detallada de la factura TPL */
    factura_expedicion: {
        /** Cantidad total en la factura */
        cantidad: number;

        /** Número de factura */
        num_factura: string;

        /** 
         * Fecha de expedición en formato YYYY-MM-DD HH:mm:ss 
         * @example "2025-02-17 00:00:00"
         */
        fecha_expedicion: string;

        /** ID del documento */
        id_documento: number;

        /** Razón social del emisor */
        razon_social: string;

        /** Domicilio fiscal */
        domicilio: string;

        /** Detalles de la unidad de medida */
        unidad_medida: {
            /** Clave/código de la unidad */
            clave: string;

            /** Descripción de la unidad */
            descripcion: string;
        };

        /** Importe en dólares estadounidenses */
        importe_dolares: number;

        /** Cantidad disponible */
        cantidad_disponible: number;
    };
}

/**
 * Metadatos de configuración de paginación
 */
export interface PageableResponse {
    /** Número de página actual (base 0) */
    pageNumber: number;

    /** Tamaño de página (elementos por página) */
    pageSize: number;

    /** Criterios de ordenamiento */
    sort: SortResponse[];

    /** Desplazamiento actual */
    offset: number;

    /** Indica si los resultados están paginados */
    paged: boolean;

    /** Indica si los resultados no están paginados */
    unpaged: boolean;
}

/**
 * Especificación de criterios de ordenamiento
 */
export interface SortResponse {
    /** Nombre de la propiedad por ordenar */
    property?: string;

    /** Dirección del ordenamiento (ASC/DESC) */
    direction?: string;

    /** Indica si el ordenamiento ignora mayúsculas/minúsculas */
    ignoreCase?: boolean;

    /** Manejo de valores nulos */
    nullHandling?: string;

    /** Indica si el orden es ascendente (obsoleto) */
    ascending?: boolean;
}