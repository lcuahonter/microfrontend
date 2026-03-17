/**
 * Modelo para almacenar la respuesta del API `catalogo/recintos-fiscalizados/`
 * 
 * @see API_GET_RECINTO
 */
export interface RecintoResponse {
    codigo: string;
    mensaje: string;
    datos: Recinto[];
}

/**
 * Modelo para cada una de los recintos regresados por el API `catalogo/recintos-fiscalizados/`
 *
 * @see API_GET_RECINTO
 */
export interface Recinto {
    id_recinto_fiscalizado: string;
    title?: string; // Campo opcional para almacenar el título
    nombre: string;
    descripcion: string;
}