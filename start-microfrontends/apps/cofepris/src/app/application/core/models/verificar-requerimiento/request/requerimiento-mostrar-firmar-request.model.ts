/**
 * Interfaz que representa la solicitud para mostrar un requerimiento
 * que debe ser firmado.
 */
export interface RequerimientoMostrarFirmarRequest {

    /**
     * Identificador de la acción a realizar.
     */
    id_accion: string;

    /**
     * Clave del usuario que realiza la solicitud.
     */
    cve_usuario: string;

    /**
     * Información del solicitante del requerimiento.
     */
    solicitante: {

        /**
         * Nombre del solicitante.
         */
        nombre: string;

        /**
         * Apellido materno del solicitante.
         */
        apellido_materno: string;

        /**
         * Apellido paterno del solicitante.
         */
        apellido_paterno: string;

        /**
         * RFC del solicitante.
         */
        rfc: string;
    };
}

export interface FirmaVerificarRequerimientoRequest {
    /** ID de la acción a realizar */
    id_accion: string;
    /** Datos de la firma electrónica para autorización */
    firma: Firma;
}

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
