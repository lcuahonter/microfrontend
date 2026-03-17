/**
 * Interfaz que representa la respuesta del servicio
 * para mostrar la información de un requerimiento a firmar.
 */
export interface RequerimientoMostrarFirmarResponse {

    /**
     * Fecha en la que se realizó la firma del requerimiento.
     * Formato: ISO 8601.
     */
    fecha_firma: string;

    /**
     * Cadena original utilizada para el proceso de firma.
     */
    cadena_original: string;
}
