/** MostrarFirmarResponse */
export interface MostrarFirmarResponse {
    /** ID del dictamen generado */
    id_dictamen: number;
    /** Fecha de firma del dictamen */
    fecha_firma: Date;
    /** Cadena original para firma electrónica */
    cadena_original: string;
}