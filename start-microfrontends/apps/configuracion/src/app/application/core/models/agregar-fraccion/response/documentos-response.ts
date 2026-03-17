/**
 * Representa la información asociada a un documento requerido dentro del catálogo.
 *
 * @interface DocumentosResponse
 *
 * @property {number | string} id - Identificador único del documento, puede ser numérico o alfanumérico.
 * @property {string} descripcion - Descripción completa del documento requerido.
 */
export interface DocumentosResponse {
    id: number | string;
    descripcion: string;
}
