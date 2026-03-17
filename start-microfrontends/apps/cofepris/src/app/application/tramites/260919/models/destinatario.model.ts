/**
 * Interfaz que representa los datos de un destinatario.
 */
export interface Destinatario {
  /** Identificador único del destinatario. */
  id: number;

  /** Nombre del destinatario. */
  nombre: string;

  /** RFC del destinatario. */
  rfc: string;

  /** CURP del destinatario. */
  curp: string;

  /** Teléfono del destinatario. */
  telefono: string;

  /** Correo electrónico del destinatario. */
  correoElectronico: string;

  /** Tipo de persona (física o moral). */
  tipoPersona: string;

  /** Calle del domicilio del destinatario. */
  calle: string;

  /** Número exterior del domicilio del destinatario. */
  numeroExterior: string;

  /** Número interior del domicilio del destinatario. */
  numeroInterior: string;

  /** País del domicilio del destinatario. */
  pais: string;

  /** Colonia del domicilio del destinatario. */
  colonia: string;

  /** Municipio del domicilio del destinatario. */
  municipio: string;

  /** Localidad del domicilio del destinatario. */
  localidad: string;

  /** Estado del domicilio del destinatario. */
  estado: string;

  /** Estado alternativo del domicilio del destinatario. */
  estado2: string;

  /** Código postal del domicilio del destinatario. */
  codigopostal: string;

  /** Domicilio completo del destinatario. */
  domicilio: string;

  /** Lada telefónica del destinatario. */
  lada: string;

  /** Primer apellido del destinatario. */
  primerApellido: string;

  /** Segundo apellido del destinatario. */
  segundoApellido: string;

  /** Denominación del destinatario (en caso de persona moral). */
  denominacion: string;
}

/**
 * Interfaz que representa los trámites asociados.
 */
export interface TramitesAsociados {
  /**
   * Razón social legal del destinatario.
   */
  nombreORazónSocial: string;

  /**
   * Apellido paterno del destinatario.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del destinatario.
   */
  apellidoMaterno: string;
  /** Número del trámite asociado. */
  No: number;

  /** Folio del trámite asociado. */
  folioTramite: number;

  /** Tipo de trámite asociado. */
  tipoTramite: string;

  /** Estatus del trámite asociado. */
  estatus: string;

  /** Fecha de alta del registro del trámite asociado. */
  fechaaltaderegistro: number;
}

