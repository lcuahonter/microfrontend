import { Catalogo } from '@libs/shared/data-access-user/src';

/** Representa un contribuyente con datos personales y de contacto. */
export interface Contribuyente {
  /** Código o clave del país del contribuyente. */
  pais: string;
  /** Calle del domicilio del contribuyente. */
  calle: string;
  /** Número exterior del domicilio. */
  num_exterior: string;
  /** Número interior del domicilio. */
  num_interior: string;
  /** Información adicional del domicilio. */
  informacion_extra: string;
  /** Clave del país en sistema. */
  cve_pais: string;
  /** Nombre del país. */
  nombre_pais: string;
  /** Clave de la entidad federativa. */
  cve_entidad: string;
  /** Nombre de la entidad federativa. */
  nombre_entidad: string;
  /** Clave de delegación o municipio. */
  cve_deleg_mun: string;
  /** Nombre de la delegación o municipio. */
  nombre_delegacion: string;
  /** Clave de la colonia. */
  cve_colonia: string;
  /** Nombre de la colonia. */
  nombre_colonia: string;
  /** Identificador de la persona en la solicitud. */
  id_persona_sol: string;
  /** Identificador relacionado (posible referencia). */
  id_persona_persona_sol_r: string;
  /** Identificador de la solicitud asociada. */
  id_solicitud: string;
  /** Nombre o razón social del contribuyente. */
  nombre: string;
  /** Apellido materno. */
  apellido_materno: string;
  /** Apellido paterno. */
  apellido_paterno: string;
  /** Razón social (si aplica). */
  razon_social: string;
  /** RFC del contribuyente. */
  rfc: string;
  /** CURP del contribuyente. */
  curp: string;
  /** Correo electrónico de contacto. */
  correo_electronico: string;
  /** Teléfono de contacto. */
  telefono: string;
  /** Descripción del giro o actividad económica. */
  descripcion_giro: string;
  /** Dirección estructurada del contribuyente. */
  domicilio: ContribuyenteDirecicon;
  /** Indicador si es persona moral (string booleana). */
  bln_persona_moral: string;
  /** Indicador si es extranjero (string booleana). */
  bln_extranjero: string;
  /** Tipo de persona (física/moral). */
  tipo_persona: string;
  /** Tipo de sociedad (si aplica). */
  tipo_sociedad: string;
}

/** Representa una dirección detallada del contribuyente con catálogos. */
export interface ContribuyenteDirecicon {
  /** Identificador de la dirección en la solicitud. */
  id_direccion_sol: string;
  /** Calle de la dirección. */
  calle: string;
  /** Número exterior de la dirección. */
  num_exterior: string;
  /** Número interior de la dirección. */
  num_interior: string;
  /** Código postal. */
  cp: string;
  /** Catálogo de la colonia. */
  colonia: Catalogo;
  /** Catálogo de la localidad. */
  localidad: Catalogo;
  /** Catálogo de la delegación o municipio. */
  delegacion_municipio: Catalogo;
  /** Catálogo de la entidad federativa. */
  entidad_federativa: Catalogo;
  /** Catálogo del país. */
  pais: Catalogo;
}

/** Datos de empresas CAAT vinculadas o registradas. */
export interface EmpresasCaat {
  /** Nombre o razón social. */
  nombre: string;
  /** Apellido materno de contacto. */
  apellido_materno: string;
  /** Apellido paterno de contacto. */
  apellido_paterno: string;
  /** Correo electrónico de contacto. */
  correo_electronico: string;
  /** CURP si aplica. */
  curp: string;
  /** Razón social de la empresa. */
  razon_social: string;
  /** RFC de la empresa/persona. */
  rfc: string;
  /** Número de seguridad social (NSS) si aplica. */
  nss: string;
  /** Indicador de extranjero (boolean). */
  extranjero: boolean;
  /** Indicador de persona moral (boolean). */
  persona_moral: boolean;
  /** Indicador de preponderancia o campo auxiliar. */
  preponderante: string;
  /** Calle de la dirección. */
  calle: string;
  /** Número exterior de la dirección. */
  numero_exterior: string;
  /** Número interior de la dirección. */
  numero_interior: string;
  /** Código postal. */
  codigo_postal: string;
  /** Estado/municipio/colonia combinado. */
  estado_municipio_col: string;
  /** Ciudad. */
  ciudad: string;
  /** Clave del país. */
  clave_pais: string;
  /** Nombre del país. */
  nombre_pais: string;
  /** Clave de la entidad federativa. */
  clave_entidad: string;
  /** Nombre de la entidad federativa. */
  nombre_entidad: string;
  /** Clave de la delegación/municipio. */
  clave_delegacion_municipio: string;
  /** Nombre de la delegación/municipio. */
  nombre_delegacion: string;
  /** Clave de la colonia. */
  clave_colonia: string;
  /** Nombre de la colonia. */
  nombre_colonia: string;
  /** Nombre de la localidad (puede ser null). */
  nombre_localidad: string;
  /** Clave o folio marítimo. */
  clave_folio_maritimo: string;
  /** Tipo de marítimo. */
  tipo_maritimo: string;
  /** Fecha inicio de vigencia (string). */
  fec_ini_vigencia: string;
  /** Fecha fin de vigencia (string). */
  fec_fin_vigencia: string;
  /** Identificador de persona en la solicitud. */
  id_persona_solicitud: string;
  /** Nombre de la dirección. */
  nombre_direc: string;
  /** Apellido materno en la dirección. */
  direc_ap_ma: string;
  /** Apellido paterno en la dirección. */
  direc_ap_pa: string;
}
