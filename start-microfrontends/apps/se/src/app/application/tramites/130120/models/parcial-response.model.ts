/**
 * Modelo para la respuesta parcial de la solicitud de permiso de importación con modificación temporal de mercancía.
 */
export interface ParcialResponse {

    /** ID único de la solicitud */
    id_solicitud: number;

    /** ID de la expedición relacionada */
    id_expedicion: number;
}