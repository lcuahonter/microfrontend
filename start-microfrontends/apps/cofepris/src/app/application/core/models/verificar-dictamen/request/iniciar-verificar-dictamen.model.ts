/**
 * Modelo para iniciar la autorización del dictamen.
 */
export interface IniciarVerificarDictamen {
    /**
     * Clave del usuario que inicia la autorización.
     */
    cve_usuario: string;

    /**
     * Identificador de la acción.
     */
    id_accion: string;
}

/** FirmaAutorizarDictamenRequest */
export interface FirmaVerificarDictamenRequest {
    /** ID de la acción a realizar */
    id_accion: string;
    /** Datos de la firma electrónica para autorización */
    firma: Firma;

     id_dictamen: string | number | undefined;
}

/** Firma */
export interface Firma {
    /** ID de la solicitud a firmar */
    id_solicitud: number;
    /** Cadena original para verificación de firma */
    cadena_original: string;
    /** Número de serie del certificado digital */
    cert_serial_number: string;
    /** Clave del usuario que firma */
    clave_usuario: string;
    /** Fecha y hora de la firma */
    fecha_firma: string;
    /** Clave del rol del firmante */
    clave_rol: string;
    /** Sello digital de la firma */
    sello: string;
    /** Fecha de fin de vigencia del certificado */
    fecha_fin_vigencia: string;
}
