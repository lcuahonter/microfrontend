/**
 * Request para la creación o actualización de una solicitud de trámite.
 */
export interface SolicitudTramiteRequest {

  /** Identificador único de la solicitud */
  id_solicitud: number | null;

  /** Identificador del tipo de trámite */
  id_tipo_tramite: string | null;

  /** RFC del solicitante */
  rfc: string;

  /** Rol del usuario que captura la solicitud (ej. Solicitante) */
  rol_capturista: string | null;

  /** Clave de la unidad administrativa */
  cve_unidad_administrativa: string | null;

  /** Costo total del trámite */
  costo_total: number | null;

  /** Número de serie del certificado utilizado */
  certificado_serial_number: string | null;

  /** Folio del trámite original, en caso de reapertura o relación */
  numero_folio_tramite_original: string | null;

  /** Información del representante legal */
  representante_legal: RepresentanteLegal;
}

/**
 * Información del representante legal del solicitante.
 */
export interface RepresentanteLegal {

  /** Nombre(s) del representante legal */
  nombre: string | null;

  /** Apellido paterno del representante legal */
  ap_paterno: string | null;

  /** Apellido materno del representante legal */
  ap_materno: string | null;

  /** Teléfono de contacto del representante legal */
  telefono: string | null;
}
