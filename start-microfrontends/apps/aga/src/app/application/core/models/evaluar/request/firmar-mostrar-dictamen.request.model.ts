/** MostrarFirmarRequest */
export interface MostrarFirmarRequest {
    /** ID de la acción a realizar */
    id_accion: string;
    /** Clave del usuario */
    cve_usuario: string;
    /** ID del sentido del dictamen */
    ide_sentido_dictamen: string;
    /** Justificación del dictamen */
    justificacion_dictamen: string;
    /** Fecha de inicio de vigencia autorizada */
    fecha_inicio_vigencia: string,
    /** Fecha de fin de vigencia autorizada */
    fecha_fin_vigencia: string,
    /** Texto del dictamen */
    texto_dictamen: string,
    /** Datos del solicitante */
    solicitante: Solicitante;
}

/** Solicitante */
export interface Solicitante {
    /** RFC del solicitante */
    rfc: string;
    /** Nombre del solicitante */
    nombre: string;
    /** Apellido paterno del solicitante */
    apellido_paterno: string;
    /** Apellido materno del solicitante */
    apellido_materno: string;
}
