/** 
 * Solicitud para el trámite T40201.
 */
export interface T40201Request {
  /** Identificador de la solicitud; null si aún no existe. */
  id_solicitud: number | null;
  /** Datos del solicitante principal. */
  solicitante: Solicitante;
  /** Lista de transportistas marítimos asociados a la solicitud. */
  transportistas_maritimos: PersonaSolicitud[];
}

/** Información del solicitante principal. */
export interface Solicitante {
  /** RFC del solicitante. */
  rfc: string;
  /** Nombre completo o razón social del solicitante. */
  nombre: string | null;
  /** Indica si el solicitante es persona moral. */
  es_persona_moral: boolean;
  /** Número de serie del certificado asociado al solicitante. */
  certificado_serial_number: string;
}

/** Datos de una persona (o entidad) incluida en la solicitud. */
export interface PersonaSolicitud {
  /** Indica si la persona es moral (empresa). */
  persona_moral: boolean;
  /** Indica si la persona es extranjera. */
  boolean_extranjero: boolean;
  /** Nombre o razón social (según persona). */
  nombre: string;
  /** Apellido paterno (si aplica). */
  apellido_paterno: string;
  /** Apellido materno (si aplica). */
  apellido_materno: string;
  /** RFC de la persona. */
  rfc: string;
  /** Número de seguridad social (NSS) si aplica. */
  nss: string;
  /** CURP de la persona si aplica. */
  curp: string;
  /** Combinación CURP/NSS o campo auxiliar. */
  curp_nss: string;
  /** Correo electrónico de contacto. */
  correo_electronico: string;
  /** Razón social; solo para personas morales (opcional). */
  razon_social?: string;
  /** Calle del domicilio principal. */
  domicilio_calle: string;
  /** Director general (para persona moral) o null si no aplica. */
  director_general: DirectorGeneral | null;
  /** Domicilio fiscal o de contacto. */
  domicilio: Domicilio;
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

/** Representa un domicilio postal o fiscal. */
export interface Domicilio {
  /** Calle del domicilio. */
  calle: string;
  /** Número exterior. */
  numero_exterior: string;
  /** Número interior (opcional). */
  numero_interior?: string;
  /** Código postal. */
  codigo_postal: string;
  /** Ciudad. */
  ciudad: string;
  /** País. */
  pais: string;
  /** Entidad federativa (estado). */
  entidad_federativa: string;
  /** Información capturar el estado cuando es extranjero */
  informacion_extra:string
  /** Delegación o municipio. */
  delegacion_municipio: string;
  /** Colonia o localidad. */
  colonia: string;
}

/** Respuesta al guardar una solicitud. */
export interface GuardarResponse {
  /** Identificador asignado a la solicitud guardada. */
  id_solicitud: number;
  /** Fecha de creación en formato ISO. */
  fecha_creacion: string;
}
