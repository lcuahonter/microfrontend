import { DestinatarioConfiguracionItem } from "../enum/destinatario-tabla.enum";

export type SimpleCatalogoResponse<T> = Pick<
    CatalogosResponse,
    'codigo' | 'mensaje'
> & { datos: T };


export type SimpleTableResponse<T> = Pick<
    TableResponse,
    'codigo' | 'mensaje'
> & { datos: T };

/** Modelo para almacenar la respuesta de las apis de catálogos */
export interface CatalogosResponse {
    codigo: string;
    mensaje: string;
    datos: Catalogos[];
}

/** Modelo para almacenar la respuesta de las apis de catálogos */
export interface TableResponse {
    codigo: string;
    mensaje: string;
    datos: DestinatarioConfiguracionItem[];
}
/**
 * Modelo para cada uno de los registros regresados por las diferentes APIs
 */
export interface Catalogos {
    clave: string;
    descripcion: string;
    title?: string; // Campo opcional para almacenar el título
}