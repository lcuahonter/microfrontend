
/**
 * Interfaz que representa los datos de la octava temporal.
 */
export interface OctavaTemporal {
    cantidad: number,
    unidadDeMedida: string,
    fraccionArancelaria: string,
    descripción: string,
    colonia: string,
    precioUnitarioUSD: string,
    totalUsd: number
}

/**
 * Interfaz que representa la fracción arancelaria para el proceso.
 */
export interface FraccionArancelariaProsec {
    fraccionArancelariaProsec: number | string,
    descripción: string
}


/**
 * Modelo de respuesta para catálogos.
 */ 
export interface PaisesBloqueCatalogo {
    descripcion: string;
    clave?: string;
    id: number;
    bloque?: boolean;
}

/*
* Modelo para almacenar la respuesta de las apis de catálogos para paises de bloque
*/
export interface CatalogosBloquesResponse {
    codigo: string;
    mensaje: string;
    datos: PaisesBloqueCatalogo[];
}