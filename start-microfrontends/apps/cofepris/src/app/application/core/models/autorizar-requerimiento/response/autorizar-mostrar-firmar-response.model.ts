/** MostrarFirmarResponse */
export interface AutorizarMostrarFirmarResponse {
    /** ID del requerimiento firmado */
    id_requerimiento: number;
    /** Fecha de firma del requerimiento */
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