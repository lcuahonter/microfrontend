/** GenerarCadenaResponse */
export interface GenerarCadenaResponse {
    /** Número de folio del trámite */
    num_folio_tramite: string | null;
    /** Indica si es extranjero */
    boolean_extranjero: boolean;
    /** Documentos requeridos para la firma */
    documento_requerido?: DocumentoRequerido[];
    /** Datos del solicitante */
    solicitante: Solicitante;
    /** Clave del rol del capturista */
    cve_rol_capturista: string;
    /** Clave del usuario capturista */
    cve_usuario_capturista: string;
    /** Fecha de firma */
    fecha_firma: string;
}

/** DocumentoRequerido */
export interface DocumentoRequerido {
    /** ID del documento seleccionado */
    id_documento_seleccionado: number;
}

/** Solicitante */
export interface Solicitante {
    /** RFC del solicitante */
    rfc: string;
    /** Número de serie del certificado digital */
    certificado_serial_number: string;
}