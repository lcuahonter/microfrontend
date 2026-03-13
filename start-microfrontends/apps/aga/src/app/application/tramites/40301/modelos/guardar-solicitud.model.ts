/** 
 * Solicitud para el trámite T40301.
 */
export interface GuardarSolicitudRequest {
    tipo_agente: string, 
    /** Datos del solicitante principal. */
    solicitante: Solicitante
    /** Director general de una persona moral. */
    director_general: DirectorGeneral
}

/** Información del solicitante principal. */
export interface Solicitante {
  /** RFC del solicitante. */
  rfc: string;
  /** Nombre completo o razón social del solicitante. */
  nombre: string;
  /** Indica el tipo de persona del solicitante. */
  tipo_persona: string;
  /** Número de serie del certificado asociado al solicitante. */
  certificado_serial_number?: string;
}

/** Director general de una persona moral. */
export interface DirectorGeneral {
  /** Nombre del director general. */
  nombre: string;
  /** Apellido paterno del director. */
  apellido_paterno: string;
  /** Apellido materno del director (opcional). */
  apellido_materno?: string;
}

/** Respuesta al guardar una solicitud. */
export interface GuardarSolicitudResponse {
  /** Identificador asignado a la solicitud guardada. */
  id_solicitud: number;
  /** Fecha de creación en formato ISO. */
  fecha_creacion: string;
}
