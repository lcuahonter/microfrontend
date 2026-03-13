/**
 * Respuesta del servicio que devuelve los datos del solicitante
 * y la información relacionada con su trámite.
 */
export interface SolicitanteEvaluarResponse {
  /** Información relacionada con el trámite. */
  datos_solicitud: DatosSolicitud;

  /** Información general del solicitante (persona física o moral). */
  datos_solicitante: DatosSolicitante;

  /** Información de domicilio del solicitante. */
  domicilio_solicitante: DomicilioSolicitante;

  /** Lista de personas a notificar respecto al trámite. */
  personas_notificacion: [];
}

/**
 * Información general del solicitante.
 */
export interface DatosSolicitante {
  /** Nombre del solicitante (solo en persona física). */
  nombre: string;

  /** Apellido paterno del solicitante. */
  apellido_paterno: string;

  /** Apellido materno del solicitante. */
  apellido_materno: string;

  /** Razón social (en caso de persona moral). */
  razon_social: string;

  /** Registro Federal de Contribuyentes. */
  rfc: string;

  /** Clave Única de Registro de Población. */
  curp: string;

  /** Correo electrónico de contacto. */
  correo_electronico: string;

  /** Descripción del giro o actividad económica. */
  descripcion_giro: string;

  /** Número de identificación fiscal. */
  numero_identificacion_fiscal: string;

  /** Número de Seguridad Social. */
  nss: string;

  /** Tipo de persona: física o moral. */
  tipo_persona: string;
}

/**
 * Información relacionada con el trámite solicitado.
 */
export interface DatosSolicitud {
  /** Número de folio asignado al trámite. */
  num_folio_tramite: string;

  /** Fecha de inicio del trámite. */
  fec_ini_tramite: Date;

  /** Identificador del estado del trámite. */
  ide_est_tramite: string;

  /** Descripción textual del estado del trámite. */
  estado_tramite: string;

  /** Identificador del tipo de trámite. */
  id_tipo_tramite: number;

  /** Descripción de la modalidad del trámite. */
  desc_modalidad: string;
}

/**
 * Información del domicilio del solicitante.
 */
export interface DomicilioSolicitante {
  /** Nombre de la calle. */
  calle: string;

  /** Número exterior del domicilio. */
  numero_exterior: string;

  /** Número interior del domicilio. */
  numero_interior: string;

  /** Código postal. */
  codigo_postal: string;

  /** Nombre de la colonia. */
  colonia: string;

  /** Localidad donde se ubica el domicilio. */
  localidad: string;

  /** País del domicilio. */
  pais: string;

  /** Entidad federativa del domicilio. */
  entidad_federativa: string;

  /** Delegación o municipio del domicilio. */
  delegacion_municipio: string;

  /** Información adicional del domicilio. */
  informacion_extra: string;

  /** Número de teléfono de contacto. */
  telefono: string;

  /** Clave LADA del teléfono. */
  lada: string;
}
