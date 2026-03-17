export const FECHA_INICIO = {
  /** Etiqueta para la fecha de inicio de operaciones de comercio exterior. */
  labelNombre: 'Fecha de Inicio de Operaciones de Comercio Exterior',
  /** Indica si el campo es obligatorio. */
  required: false,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

export const FECHA_PAGO = {
  /** Etiqueta para la fecha de pago. */
  labelNombre: 'Fecha de Pago',
  /** Indica si el campo es obligatorio. */
  required: false,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/** Modelo que representa un domicilio en el trámite. */
export interface Domicillio {
  /** Identificador único del domicilio. */
  instalacionPrincipal: string;
  /** Tipo de instalación. */
  tipoInstalacion: string;
  /** Nombre de la entidad federativa. */
  entidadFederativa: string;
  /** Nombre del municipio o delegación. */
  municipioDelegacion: string;
  /** Dirección completa. */
  direccion: string;
  /** Código postal del domicilio. */
  codigoPostal: string;
  /** Registro en SESAT. */
  registroSESAT: string;
  /** Proceso productivo en el domicilio. */
  procesoProductivo: string;
  /** Documento que acredita la propiedad o posesión del inmueble. */
  acreditaInmueble: string;
  /** Operaciones de comercio exterior realizadas en el inmueble. */
  operacionesCExt: string;
  /** Indica si la instalación cuenta con certificación CTPAT. */
  instalacionCtpat: string;
  /** Perfil de la instalación general. */
  instalacionPerfil: string;
  /** Perfil de la instalación como Recinto Fiscalizado Estratégico (RFE). */
  instalacionPerfilRFE: string;
  /** Perfil de la instalación en el sector automotriz. */
  instalacionPerfilAuto: string;
  /** Perfil de la instalación en el sector ferroviario. */
  instalacionPerfilFerro: string;
  /** Perfil de la instalación como Recinto Fiscal (RF). */
  instalacionPerfilRf: string;
  /** Perfil de la instalación dedicada a mensajería y paquetería. */
  instalacionPerfilMensajeria: string;
}

/** Modelo que representa una entidad federativa en el trámite. */
export interface EntidadFederativa {
  /** Nombre de la entidad federativa. */
  entidadFederativa: string;
  /** Nombre del municipio o delegación. */
  municipioDelegacion: string;
  /** Dirección completa. */
  direccion: string;
  /** Código postal del domicilio. */
  codigoPostal: string;
  /** Registro en SESAT. */
  registroSESAT: string;
}

/** Modelo que representa una querella en el trámite. */
export interface Querella {
  /** Sistema o datos para identificación. */
  sistemaIdentificacion: string;
  /** Clave del tipo de instalación. */
  lugarRadicacion: string;
  /** Indica si cuenta con sistema de control de inventarios. */
  indiqueSiCuenta: boolean;
}

/** Modelo que representa una empresa en el trámite. */
export interface Empresa {
  /** Identificador del miembro en la empresa. */
  idMiembroEmpresa?: string;
  /** Identificador de la solicitud relacionada. */
  idSolicitud?: string;
  /** Tipo de persona (Física o Moral). */
  tipoPersona?: string;
  /** Tipo de persona mostrado al usuario. */
  tipoPersonaMuestra: string;
  /** Nombre completo del miembro. */
  nombreCompleto: string;
  /** RFC del miembro. */
  rfc: string;
  /** Carácter o rol dentro de la empresa. */
  caracterDe: string;
  /** Nombre del país de origen. */
  nacionalidad: string;
  /** Tipo de carácter (adicional). */
  tipoCaracter?: string;
  /** Clave del país. */
  paisClave?: string;
  /** Indica si tributa en México. */
  tributarMexico: string;
  /** Nombre de la empresa. */
  nombreEmpresa: string;
  /** Nombre de la persona (si aplica). */
  nombre?: string;
  /** Apellido paterno (si aplica). */
  apellidoPaterno?: string;
  /** Apellido materno (si aplica). */
  apellidoMaterno?: string;
  /** Razón social (si aplica). */
  razonSocial?: string;
}

/** Modelo que representa un enlace operativo en el trámite. */
export interface EnlaceOperativo {
  /** RFC del enlace operativo. */
  rfc: string;
  /** Nombre del enlace operativo. */
  nombre: string;
  /** Apellido paterno del enlace operativo. */
  apellidoPaterno: string;
  /** Apellido materno del enlace operativo. */
  apellidoMaterno: string;
  /** Clave de la ciudad del enlace operativo. */
  claveCiudad: string;
  /** Ciudad en la que se encuentra el enlace operativo. */
  ciudad: string;
  /** Cargo que desempeña el enlace operativo. */
  cargo: string;
  /** Teléfono del enlace operativo. */
  telefono: string;
  /** Correo electrónico del enlace operativo. */
  correo: string;
  /** Indica si la persona es suplente de otro enlace operativo. */
  suplente: string;
  /** Calle donde reside el enlace operativo. */
  calle: string;
  /** Número exterior de la vivienda del enlace operativo. */
  numeroExterior: string;
  /** Número interior de la vivienda del enlace operativo. */
  numeroInterior: string;
  /** Colonia donde reside el enlace operativo. */
  colonia: string;
  /** Código postal de la residencia del enlace operativo. */
  codigoPostal: string;
  /** Localidad donde reside el enlace operativo. */
  localidad: string;
  /** Delegación o municipio donde reside el enlace operativo. */
  delegacionMunicipio: string;
}

/** Modelo que representa una persona para recibir notificaciones. */
export interface RecibirNotificaciones {
  /** Registro Federal de Contribuyentes. */
  rfc: string;
  /** Clave Única de Registro de Población. */
  curp: string;
  /** Nombre del solicitante. */
  nombre: string;
  /** Apellido paterno del solicitante. */
  apellidoPaterno: string;
  /** Apellido materno del solicitante. */
  apellidoMaterno: string;
}

/** Modelo que representa un transportista en el trámite. */
export interface TransportistasTable {
  /** RFC del transportista. */
  rfc: string;
  /** Razón social del transportista. */
  razonSocial: string;
  /** Domicilio del transportista. */
  domicilio: string;
  /** CAAT del transportista. */
  caat: string;
}

/** Modelo que representa una empresa controlada en el trámite. */
export interface ControladasTable {
  /** RFC de la empresa controlada. */
  rfc: string;
  /** Razón social de la empresa controlada. */
  razonSocial: string;
  /** Domicilio de la empresa controlada. */
  domicilio: string;
  /** Participación accionaria de la empresa controlada. */
  accinaria: string;
  /** Importaciones realizadas por la empresa controlada. */
  importaciones: string;
  /** Exportaciones realizadas por la empresa controlada. */
  exportaciones: string;
}