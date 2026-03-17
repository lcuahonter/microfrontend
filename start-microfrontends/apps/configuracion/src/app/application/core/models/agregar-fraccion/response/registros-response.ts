/**
 * Representa la información asociada a un registro dentro del sistema.
 *
 * @interface RegistrosResponse
 * 
 * @property {number | string} id - Identificador único del registro, puede ser numérico o alfanumérico.
 * @property {string} tratamiento - Tipo o descripción del tratamiento asociado al registro.
 * @property {string} fecha - Fecha relacionada con el registro, en formato de texto.
 */
export interface RegistrosResponse {
    id: number | string;
    tratamiento: string;
    fecha: string;
    activo: string;
}
