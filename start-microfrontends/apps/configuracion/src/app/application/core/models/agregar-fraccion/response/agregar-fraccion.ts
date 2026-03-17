/**
 * Representa la información asociada a una fracción dentro de un catálogo o lista jerárquica.
 *
 * @interface FraccionesResponse
 * 
 * @property {string | number} id - Identificador único de la fracción, puede ser numérico o alfanumérico.
 * @property {string} title - Nombre de la fracción.
 */
export interface FraccionesResponse {
    id: string | number;
    title: string;
    children: FraccionesResponse[]
}
