/** Modelo para almacenar la respuesta de las apis de catálogos */
export interface CatalogosResponse {
    codigo: string;
    mensaje: string;
    datos: Catalogos[];
}

/**
 * Modelo para cada uno de los registros regresados por las diferentes APIs
 */
export interface Catalogos {
    clave: string;
    descripcion: string;
    title?: string; // Campo opcional para almacenar el título
}

/** Modelo para almacenar la respuesta de las apis de catálogos.
 * Este modelo es una copia del anterior, pero se utilizará para las respuesta de los catálogos que contienen un
 * campo boleano dentro de la propiedad datos, que indica si el registro es valido o no.
 * @see CatalogosResponse
 * */
export interface CatalogosBooleanResponse {
    codigo: string;
    mensaje: string;
    datos: boolean;
}

/** Modelo para almacenar la respuesta de las apis de catálogos.
 * Este modelo es una copia del anterior, pero se utilizará para las respuesta de los catálogos que contienen un
 * campo numérico dentro de la propiedad datos.
 * @see CatalogosResponse
 * */
export interface CatalogosNumeroResponse {
    codigo: string;
    mensaje: string;
    datos: number;
}