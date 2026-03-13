import { CatalogosSelect } from "@libs/shared/data-access-user/src";

/** Indica si es instalación principal */
export interface Domicilios {
  /** Indica si es instalación principal */
  instalacionPrincipal: string;

  /** Clave del tipo de instalación */
  cveTipoInstalacion?: string;

  /** Tipo de instalación */
  tipoInstalacion: string;

  /** Clave de la entidad federativa */
  cveEntidadFederativa?: string;

  /** Nombre de la entidad federativa */
  entidadFederativa: string;

  /** Clave de delegación o municipio */
  cveDelegacionMunicipio?: string;

  /** Nombre del municipio o delegación */
  municipioDelegacion: string;

  /** Dirección completa */
  direccion: string;

  /** Código postal del domicilio */
  codigoPostal: string;

  /** Registro en SESAT */
  registroSESAT: string;

  /** Proceso productivo en el domicilio */
  procesoProductivo: string;

  /**
   * Documento que acredita la propiedad o posesión del inmueble.
   */
  acreditaInmueble: string;

  /**
   * Operaciones de comercio exterior realizadas en el inmueble.
   */
  operacionesCExt: string;

  /**
   * Indica si la instalación cuenta con certificación CTPAT.
   */
  instalacionCtpat: string;

  /**
   * Perfil de la instalación general.
   */
  instalacionPerfil: string;

  /**
   * Perfil de la instalación como Recinto Fiscalizado Estratégico (RFE).
   */
  instalacionPerfilRFE: string;

  /**
   * Perfil de la instalación en el sector automotriz.
   */
  instalacionPerfilAuto: string;

  /**
   * Perfil de la instalación en el sector ferroviario.
   */
  instalacionPerfilFerro: string;

  /**
   * Perfil de la instalación como Recinto Fiscal (RF).
   */
  instalacionPerfilRf: string;

  /**
   * Perfil de la instalación dedicada a mensajería y paquetería.
   */
  instalacionPerfilMensajeria: string;

  /**
   * Número exterior del domicilio.
   */
  noExterior?: string;

  /**
   * Número interior del domicilio (opcional).
   */
  noInterior?: string;

  /**
   * Clave de la colonia (opcional).
   */
  cveColonia?: string;

  /**
   * Nombre de la calle (opcional).
   */
  calle?: string;

  /**
   * Descripción de la colonia (opcional).
   */
  descCol?: string;

  /**
   * Identificador del recinto (opcional).
   */
  idRecinto?: string;
}
/**
 * Nombre del inventario.
 * Representa el nombre del inventario o producto registrado.
 */
export interface Inventarios {
  /**
   * Nombre del inventario.
   * Representa el nombre del inventario o producto registrado.
   */
  nombre: string;

  /**
   * Lugar de radicación del inventario.
   * Representa la ubicación o el lugar donde se encuentra registrado el inventario.
   */
  lugarRadicacion: string;

  /**
   * Anexo 24 asociado al inventario.
   * Hace referencia al Anexo 24 correspondiente en el contexto del inventario.
   */
  anexo24: string;
}
/** Etiqueta visible de la opción */
export interface RadioOptions {
  /** Etiqueta visible de la opción */
  label: string;

  /** Valor asociado a la opción */
  value: string | number;

  /** Texto auxiliar u orientativo */
  hint?: string;
}
/** Opciones disponibles para seleccionar */
export interface InputRadio {
  /** Opciones disponibles para seleccionar */
  radioOptions: RadioOptions[];

  /** Indica si la selección es obligatoria */
  isRequired: boolean;
}

/**
 * Denominación de la entidad o empresa.
 * Representa el nombre o razón social de la entidad que tiene los empleados.
 */
export interface NumeroDeEmpleados {
  /**
   * Denominación de la entidad o empresa.
   * Representa el nombre o razón social de la entidad que tiene los empleados.
   */
  denominacion: string;

  /**
   * RFC de la entidad o empresa.
   * Representa el Registro Federal de Contribuyentes de la entidad que emplea a las personas.
   */
  RFC: string;

  /**
   * Número total de empleados de la entidad o empresa.
   * Indica la cantidad de empleados que tiene la entidad o empresa en el período correspondiente.
   */
  numeroDeEmpleados: string;

  /**
   * Bimestre al que corresponde la información de los empleados.
   * Representa el período bimestral para el cual se está reportando el número de empleados.
   */
  bimestre: string;
}
/** Identificador del miembro en la empresa */
export interface SeccionSociosIC {
  /** Identificador del miembro en la empresa */
  idMiembroEmpresa?: string;

  /** Identificador de la solicitud relacionada */
  idSolicitud?: string;

  /** Tipo de persona (Física o Moral) */
  tipoPersona?: string;

  /** Tipo de persona mostrado al usuario */
  tipoPersonaMuestra: string;

  /** Nombre completo del miembro */
  nombreCompleto: string;

  /** RFC del miembro */
  rfc: string;

  /** Carácter o rol dentro de la empresa */
  caracterDe: string;

  /** Nombre del país de origen */
  nacionalidad: string;

  /** Tipo de carácter (adicional) */
  tipoCaracter?: string;

  /** Clave del país */
  paisClave?: string;

  /** Indica si tributa en México */
  tributarMexico: string;

  /** Nombre de la empresa */
  nombreEmpresa: string;

  /** Nombre de la persona (si aplica) */
  nombre?: string;

  /** Apellido paterno (si aplica) */
  apellidoPaterno?: string;

  /** Apellido materno (si aplica) */
  apellidoMaterno?: string;

  /** Razón social (si aplica) */
  razonSocial?: string;
}

/**
 * Enlace operativo.
 * Es un identificador único asignado a la persona a nivel fiscal.
 */
export interface EnlaceOperativo {
  /**
   * RFC del enlace operativo.
   * Es un identificador único asignado a la persona a nivel fiscal.
   */
  rfc: string;

  /**
   * Nombre del enlace operativo.
   * Representa el primer nombre de la persona.
   */
  nombre: string;

  /**
   * Apellido paterno del enlace operativo.
   * Es el apellido que corresponde al padre del individuo.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del enlace operativo.
   * Es el apellido que corresponde a la madre del individuo.
   */
  apellidoMaterno: string;

  /**
   * Clave de la ciudad del enlace operativo.
   * Es una clave numérica o alfanumérica que identifica de manera única una ciudad.
   */
  claveCiudad: string;

  /**
   * Ciudad en la que se encuentra el enlace operativo.
   * Es el nombre de la ciudad donde reside la persona.
   */
  ciudad: string;

  /**
   * Cargo que desempeña el enlace operativo.
   * Es la posición o función que ocupa la persona dentro de una organización.
   */
  cargo: string;

  /**
   * Teléfono del enlace operativo.
   * Es el número telefónico donde se puede contactar a la persona.
   */
  telefono: string;

  /**
   * Correo electrónico del enlace operativo.
   * Es la dirección de correo electrónico para comunicarse con la persona.
   */
  correo: string;

  /**
   * Indica si la persona es suplente de otro enlace operativo.
   * Es un valor que determina si el enlace operativo puede reemplazar a otro en su ausencia.
   */
  suplente: string;

  /**
   * Calle donde reside el enlace operativo.
   * Es el nombre de la vía pública en la que se ubica la dirección de la persona.
   */
  calle: string;

  /**
   * Número exterior de la vivienda del enlace operativo.
   * Es el número que identifica el exterior de la casa o edificio en la dirección.
   */
  numeroExterior: string;

  /**
   * Número interior de la vivienda del enlace operativo.
   * Es el número que identifica un departamento o unidad dentro de un edificio, si aplica.
   */
  numeroInterior: string;

  /**
   * Colonia donde reside el enlace operativo.
   * Es el nombre de la zona o barrio dentro de una ciudad o municipio.
   */
  colonia: string;

  /**
   * Código postal de la residencia del enlace operativo.
   * Es el código numérico que facilita la localización de la dirección.
   */
  codigoPostal: string;

  /**
   * Localidad donde reside el enlace operativo.
   * Es el nombre de la localidad dentro de un municipio o delegación.
   */
  localidad: string;

  /**
   * Delegación o municipio donde reside el enlace operativo.
   * Es la demarcación territorial dentro de una ciudad o estado donde reside la persona.
   */
  delegacionMunicipio: string;
}

/**
 * Catálogo del sector productivo relacionado con la solicitud.
 * Representa el sector al que pertenece la actividad o industria del solicitante.
 */
export interface SolicitudCatologoSelectLista {
  /**
   * Catálogo del sector productivo relacionado con la solicitud.
   * Representa el sector al que pertenece la actividad o industria del solicitante.
   */
  sectorProductivo: CatalogosSelect;

  /**
   * Catálogo de opciones de servicio en la solicitud.
   * Representa el tipo de servicio que se está solicitando o asociando.
   */
  servicio: CatalogosSelect;

  /**
   * Catálogo del bimestre correspondiente a la solicitud.
   * Indica el período bimestral para el cual se realiza la solicitud.
   */
  bimestre: CatalogosSelect;

  /**
   * Catálogo que indica si se aplican todas las opciones disponibles.
   * Permite marcar si la solicitud aplica a todas las categorías o casos.
   */
  indiqueTodos: CatalogosSelect;

  /**
   * Catálogo de opciones sobre el carácter del miembro.
   * Representa el rol o tipo de responsabilidad del miembro en la solicitud.
   */
  enSuCaracterDe: CatalogosSelect;

  /**
   * Catálogo de nacionalidades disponibles para la solicitud.
   * Permite seleccionar la nacionalidad asociada al solicitante o entidad.
   */
  nacionalidad: CatalogosSelect;

  /**
   * Catálogo del tipo de persona en la solicitud.
   * Determina si el solicitante es una persona física o moral.
   */
  tipoDePersona: CatalogosSelect;

  /**
   * Catálogo del tipo de instalación relacionada con la solicitud.
   * Representa la naturaleza o tipo de instalación asociada al servicio o solicitud.
   */
  tipoDeInstalacion: CatalogosSelect;
}

/**
 * Requisitos que deben cumplirse para la solicitud.
 * Este campo representa un conjunto de opciones de tipo radio que definen los requisitos necesarios para la solicitud.
 */
export interface SolicitudRadioLista {
  /**
   * Requisitos que deben cumplirse para la solicitud.
   * Este campo representa un conjunto de opciones de tipo radio que definen los requisitos necesarios para la solicitud.
   */
  requisitos: InputRadio;

  /**
   * Clasificación de la información solicitada.
   * Este campo representa una opción de clasificación para la información que se está solicitando.
   */
  clasificacionInformacion: InputRadio;

  /**
   * Reconocimiento mutuo.
   * Este campo define una opción de radio que indica si existe o no un acuerdo de reconocimiento mutuo entre las partes involucradas.
   */
  reconocimientoMutuo: InputRadio;
}
/**
 * Información relacionada con empresas subcontratadas.
 */
export interface SeccionSubcontratados {
  /**
   * RFC utilizado para realizar la búsqueda de la empresa subcontratada (opcional).
   */
  subcontrataRFCBusqueda?: string;

  /**
   * RFC de la empresa subcontratada.
   */
  subcontrataRFC: string;

  /**
   * Razón social de la empresa subcontratada.
   */
  subcontrataRazonSocial: string;

  /**
   * Número de empleados subcontratados (opcional).
   */
  subcontrataEmpleados?: string;

  /**
   * Bimestre correspondiente a la subcontratación (opcional).
   */
  subcontrataBimestre?: string;
}
/**
 * ID de la persona solicitante.
 * Este campo es opcional y sirve como identificador único para la persona que realiza la solicitud.
 */
export interface RepresentanteLegal {
  /**
   * ID de la persona solicitante.
   * Este campo es opcional y sirve como identificador único para la persona que realiza la solicitud.
   */
  idPersonaSolicitud?: string;

  /**
   * RFC del tercero relacionado con la solicitud.
   * Este RFC pertenece a una persona o entidad distinta al solicitante, pero que está vinculada al proceso.
   */
  rfcTercero: string;

  /**
   * RFC del representante legal.
   * Es un identificador fiscal único asignado a la persona que actúa como representante legal.
   */
  rfc: string;

  /**
   * Nombre del representante legal.
   * Es el primer nombre del representante legal en el proceso.
   */
  nombre: string;

  /**
   * Apellido paterno del representante legal.
   * Es el apellido que corresponde al padre del representante legal.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del representante legal.
   * Es el apellido que corresponde a la madre del representante legal.
   */
  apellidoMaterno: string;

  /**
   * Teléfono del representante legal.
   * Es el número de teléfono del representante legal para contacto.
   */
  telefono: string;

  /**
   * Correo electrónico del representante legal.
   * Es la dirección de correo electrónico a través de la cual se puede contactar al representante legal.
   */
  correoElectronico: string;
}
/**
 * Representa los datos de una persona que desea recibir notificaciones.
 */
export interface RecibirNotificaciones {
  /** Registro Federal de Contribuyentes */
  rfc: string;

  /** Clave Única de Registro de Población */
  curp: string;

  /** Nombre del solicitante */
  nombre: string;

  /** Apellido paterno del solicitante */
  apellidoPaterno: string;

  /** Apellido materno del solicitante */
  apellidoMaterno: string;
}

