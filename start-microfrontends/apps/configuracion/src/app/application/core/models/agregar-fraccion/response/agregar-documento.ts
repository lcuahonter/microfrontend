/**
 * Representa la información asociada a un documento dentro del proceso de agregación.
 *
 * @interface AgregarDocumentoResponse
 * 
 * @property {string | number} id - Identificador único del documento, puede ser numérico o alfanumérico.
 * @property {string} nombre - Nombre o descripción del documento.
 */
export interface AgregarDocumentoResponse {
    id: string | number;
    nombre: string;
}
