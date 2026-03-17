import { TipoPersona } from "@libs/shared/data-access-user/src";

/**
 * Interfaz que representa la información completa del trámite a validar y guardar.
 *
 * @property {string} justificacion - Justificación del trámite.
 * @property {string} cve_regimen - Clave del régimen.
 * @property {string} cve_clasificacion_regimen - Clasificación del régimen.
 * @property {Object} solicitante - Información del solicitante.
 * @property {string} solicitante.rfc - RFC del solicitante.
 * @property {string} solicitante.nombre - Nombre o razón social del solicitante.
 * @property {boolean} solicitante.es_persona_moral - Indica si es persona moral.
 * @property {string} solicitante.certificado_serial_number - Número de certificado.
 * @property {Object} representacion_federal - Datos de representación federal.
 * @property {string} representacion_federal.cve_entidad_federativa - Clave de entidad federativa.
 * @property {string} representacion_federal.cve_unidad_administrativa - Clave de unidad administrativa.
 * @property {string} permiso_general - Tipo de permiso solicitado.
 * @property {string} cve_pais_destino - País de destino.
 * @property {string[]} aduanas_entrada - Lista de aduanas de entrada.
 * @property {string} uso_final_mercancia - Uso final de la mercancía.
 * @property {string} semestre - Semestre aplicable.
 * @property {boolean} anio_curso - Indica si corresponde al año en curso.
 * @property {string} fecha_unica_entrada - Fecha única de entrada.
 * @property {Array} mercancias - Lista de mercancías.
 * @property {Array} destinatarios - Lista de destinatarios.
 * @property {Array} proveedores - Lista de proveedores.
 * @property {Object} pago - Información de pago.
 */
export interface ValidarGuardar {
  justificacion: string;
  cve_regimen: string;
  cve_clasificacion_regimen: string;
  solicitante: {
    rfc: string;
    nombre: string;
    es_persona_moral: boolean;
    certificado_serial_number: string
  };
  representacion_federal: {
    cve_entidad_federativa: string;
    cve_unidad_administrativa: string;
  };
  permiso_general: string;
  cve_pais_destino: string;
  aduanas_entrada: string[];
  uso_final_mercancia: string;
  semestre: string | undefined;
  anio_curso: boolean | null;
  fecha_unica_entrada: string | undefined;

  mercancias: {
    fraccion_arancelaria: string;
    descripcion_fraccion: string;
    descripcion_mercancia: string;
    umt: string;
    cve_umt?: string;
    umc: string | null;
    cantidad_umt: number;
    valor_comercial: number;
    tipo_moneda: string;
    pais_origen: string | null;
  }[];

  destinatarios: {
    rfc: string;
    curp: string;
    nombre: string | null;
    calle: string;
    lada: string | null;
    telefono: string;
    nacionalidad: string | null;
    tipo_persona: string | null;
    primer_apellido: string | null;
    segundo_apellido: string | null;
    denominacion_razon_social: string | null;
    cve_pais: string;
    cve_estado: string | null;
    cve_entidad_federativa: string;
    cve_municipio: string;
    cve_localidad: string;
    codigo_postal: string;
    cve_colonia: string;
    numero_exterior: string;
    numero_interior: string;
    correo_electronico: string;
  }[];

  proveedores: {
    nombre: string | null;
    calle: string;
    lada: string;
    telefono: string;
    tipo_persona: TipoPersona | null;
    primer_apellido: string | null;
    segundo_apellido: string | null;
    denominacion_razon_social: string | null;
    cve_pais: string;
    cve_estado: string | null;
    codigo_postal: string;
    numero_exterior: string;
    numero_interior: string;
    correo_electronico: string;
  }[];

  pago?: {
    banco: string;
    cve_banco: string;
    clave_referencia: string;
    cadena_dependencia: string;
    llave_pago: string;
    fecha_pago: string;
    importe_pago: string;
  };
}


/**
 * Interfaz que representa la información del destinatario
 * utilizada para el registro o actualización de datos.
 *
 * @property {string} nacionalidad - Nacionalidad del destinatario.
 * @property {string} tipo_persona - Tipo de persona (Física o Moral).
 * @property {string | null} rfc - Registro Federal de Contribuyentes.
 * @property {string | null} curp - Clave Única de Registro de Población.
 * @property {string | null} nombre - Nombre del destinatario.
 * @property {string | null} primer_apellido - Primer apellido.
 * @property {string | null} segundo_apellido - Segundo apellido.
 * @property {string | null} razon_social - Razón social (para persona moral).
 * @property {string} cve_pais - Clave del país.
 * @property {string} pais - Nombre del país.
 * @property {string} estado - Estado o entidad federativa.
 * @property {string} cve_estado - Clave del estado.
 * @property {string} cve_entidad_federativa - Clave de la entidad federativa.
 * @property {string} municipio - Municipio.
 * @property {string} cve_municipio - Clave del municipio.
 * @property {string} localidad - Localidad.
 * @property {string} cve_localidad - Clave de la localidad.
 * @property {string} codigo_postal - Código postal.
 * @property {string} colonia - Colonia.
 * @property {string} cve_colonia - Clave de la colonia.
 * @property {string} calle - Calle del domicilio.
 * @property {string} numero_exterior - Número exterior.
 * @property {string} numero_interior - Número interior.
 * @property {string} lada - Lada telefónica.
 * @property {string} telefono - Número telefónico.
 * @property {string} correo_electronico - Correo electrónico de contacto.
 */
export interface GuardarDestinatarioPayloadCustom {
  nacionalidad: string;
  tipo_persona: string;
  rfc?: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  razon_social: string;
  cve_pais: string;
  pais: string;
  estado?: string;
  cve_estado?: string;
  municipio?: string;
  cve_municipio?: string;
  localidad?: string;
  cve_localidad?: string;
  codigo_postal?: string;
  colonia?: string;
  cve_colonia?: string;
  calle?: string;
  numero_exterior?: string;
  numero_interior?: string;
  lada?: string;
  telefono?: string;
  correo_electronico?: string;
}

/**
 * Interfaz que representa los datos del destinatario final.
 *
 * @property {string} nacionalidad - Nacionalidad del destinatario.
 * @property {string} tipo_persona - Tipo de persona (física o moral).
 * @property {string|null} rfc - Registro Federal de Contribuyentes.
 * @property {string|null} curp - Clave Única de Registro de Población.
 * @property {string|null} nombre - Nombre del destinatario.
 * @property {string|null} primer_apellido - Primer apellido.
 * @property {string|null} segundo_apellido - Segundo apellido.
 * @property {string|null} razon_social - Razón social.
 * @property {string} cve_pais - Clave del país.
 * @property {string} pais - Nombre del país.
 * @property {string} estado - Estado o entidad federativa.
 * @property {string} cve_estado - Clave del estado.
 * @property {string|null} cve_entidad_federativa - Clave de la entidad federativa.
 * @property {string} municipio - Municipio.
 * @property {string|null} cve_municipio - Clave del municipio.
 * @property {string} localidad - Localidad.
 * @property {string|null} cve_localidad - Clave de la localidad.
 * @property {string} codigo_postal - Código postal.
 * @property {string} colonia - Colonia.
 * @property {string|null} cve_colonia - Clave de la colonia.
 * @property {string} calle - Calle.
 * @property {string} numero_exterior - Número exterior.
 * @property {string|null} numero_interior - Número interior.
 * @property {string} lada - Lada telefónica.
 * @property {string} telefono - Teléfono de contacto.
 * @property {string} correo_electronico - Correo electrónico.
 */
export interface GuardarDestinatarioPayloadFinal {
  nacionalidad: string;
  tipo_persona: string;

  rfc: string | null;
  curp: string | null;

  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido: string | null;
  razon_social: string | null;

  cve_pais: string;
  pais?: string;

  estado?: string;
  cve_estado?: string;

  cve_entidad_federativa?: string | null;

  municipio?: string;
  cve_municipio?: string | null;

  localidad?: string;
  cve_localidad?: string | null;

  codigo_postal?: string;
  colonia?: string;
  cve_colonia?: string | null;

  calle?: string;
  numero_exterior?: string;
  numero_interior?: string | null;

  lada?: string;
  telefono?: string;
  correo_electronico?: string;
}


/**
 * Interfaz que representa los datos del proveedor.
 *
 * @property {string} tipo_persona - Tipo de persona (física o moral).
 * @property {string|null} nombre - Nombre del proveedor.
 * @property {string|null} primer_apellido - Primer apellido.
 * @property {string|null} segundo_apellido - Segundo apellido.
 * @property {string|null} razon_social - Razón social.
 * @property {string} cve_pais - Clave del país.
 * @property {string} pais - País.
 * @property {string} calle - Calle del domicilio.
 * @property {string} numero_exterior - Número exterior.
 * @property {string|null} numero_interior - Número interior.
 * @property {string} lada - Lada telefónica.
 * @property {string} telefono - Teléfono.
 * @property {string} correo_electronico - Correo electrónico.
 * @property {string|null} colonia - Colonia.
 * @property {string} estado - Estado.
 * @property {string} codigo_postal - Código postal.
 * @property {string} cve_estado - Clave del estado.
 */
export interface GuardarProveedorPayload {
 tipo_persona: string;

  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido: string | null;
  razon_social: string | null;

  cve_pais: string;
  pais?: string;

  calle?: string;
  numero_exterior?: string;
  numero_interior?: string | null;

  lada?: string;
  telefono?: string;
  correo_electronico?: string;

  colonia?: string | null;
  estado?: string;
  codigo_postal?: string;
  cve_estado?: string;
}


/**
 * Interfaz que representa la información del proveedor
 * utilizada para el registro o actualización de datos.
 *
 * @property {string|null} rfc - Registro Federal de Contribuyentes.
 * @property {string|null} curp - Clave Única de Registro de Población.
 * @property {string|null} nombre - Nombre del proveedor.
 * @property {string|null} primer_apellido - Primer apellido.
 * @property {string|null} segundo_apellido - Segundo apellido.
 * @property {string|null} razon_social - Razón social del proveedor.
 * @property {string} nacionalidad - Nacionalidad del proveedor.
 * @property {string} tipo_persona - Tipo de persona (física o moral).
 * @property {string} cve_pais - Clave del país.
 * @property {string} pais - Nombre del país.
 * @property {string} estado - Estado o entidad federativa.
 * @property {string|null} cve_estado - Clave del estado.
 * @property {string} municipio - Municipio.
 * @property {string|null} cve_municipio - Clave del municipio.
 * @property {string} colonia - Colonia.
 * @property {string|null} cve_colonia - Clave de la colonia.
 * @property {string} localidad - Localidad.
 * @property {string|null} cve_localidad - Clave de la localidad.
 * @property {string} calle - Calle del domicilio.
 * @property {string} numero_exterior - Número exterior.
 * @property {string|null} numero_interior - Número interior.
 * @property {string} lada - Lada telefónica.
 * @property {string} telefono - Teléfono de contacto.
 * @property {string} correo_electronico - Correo electrónico.
 * @property {string|null} codigo_postal - Código postal.
 */
export interface GuardarProveedorPayloadCustom {
  rfc: string | null;
  curp: string | null;

  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido: string | null;
  razon_social: string | null;

  nacionalidad: string;
  tipo_persona: string;

  cve_pais: string;
  pais?: string;

  estado?: string;
  cve_estado?: string | null;

  municipio?: string;
  cve_municipio?: string | null;

  colonia?: string;
  cve_colonia?: string | null;

  localidad?: string;
  cve_localidad?: string | null;

  calle?: string;
  numero_exterior?: string;
  numero_interior?: string | null;

  lada?: string;
  telefono?: string;
  correo_electronico?: string;

  codigo_postal?: string | null;
}





