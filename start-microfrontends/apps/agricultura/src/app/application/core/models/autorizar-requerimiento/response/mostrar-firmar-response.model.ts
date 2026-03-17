/** MostrarFirmarResponse */
export interface MostrarFirmarResponse {
    /** ID del dictamen firmado */
    id_dictamen: number;
    /** Fecha de firma del dictamen */
    fecha_firma: string;
    /** Cadena original para verificación de firma */
    cadena_original: string;
    /** Datos de firma de oficios relacionados */
    firma_oficios: FirmaOficios;
}

/** FirmaOficios */
export interface FirmaOficios {
    /** Fecha de firma de los oficios */
    fecha_firma: string;
    /** Cadena original de los oficios */
    cadena_original: string;
}