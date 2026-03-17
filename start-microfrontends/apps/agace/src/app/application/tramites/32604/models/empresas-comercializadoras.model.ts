import { CatalogosSelect } from '@libs/shared/data-access-user/src';

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

/**
 * Enlace operativo.
 * Es un identificador único asignado a la persona a nivel fiscal.
 */
export interface EnlaceOperativo {
  /**
   * Ciudad y estado del enlace operativo (de datos externos).
   */
  ciudadestado?: string;

  /**
   * Cargo del enlace operativo (de datos externos).
   */
  agregarEnlaceCargo?: string;
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
 * ID de la persona solicitante.
 * Este campo es opcional y sirve como identificador único para la persona que realiza la solicitud.
 */
export interface RepresentanteLegal {
  /**
   * Ciudad y estado del representante legal (de datos externos).
   */
  ciudadestado?: string;

  /**
   * Cargo del representante legal (de datos externos).
   */
  agregarEnlaceCargo?: string;

  /**
   * Ciudad y estado del representante legal para agregar enlace (de datos externos).
   */
  agregarEnlaceCiudadEstado?: string;

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
 * RFC del transportista.
 * Representa el Registro Federal de Contribuyentes del transportista, utilizado para su identificación fiscal.
 */
export interface TransportistasTable {
  /**
   * RFC del transportista.
   * Representa el Registro Federal de Contribuyentes del transportista, utilizado para su identificación fiscal.
   */
  transportistaRFCModifTrans: string;

  /**
   * Razón social del transportista.
   * Es el nombre legal de la empresa o entidad que presta el servicio de transporte.
   */
  transportistaRazonSocial: string;

  /**
   * Domicilio del transportista.
   * Dirección física donde se encuentra ubicado el transportista o su empresa.
   */
  transportistaDomicilio: string;

  /**
   * CAAT del transportista.
   * Representa el Certificado de Autorización de Autotransporte, necesario para la operación legal del transportista.
   */
  transportistaCaat: string;
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
   * Perfil de la instalación dedicada a mensajería y paquetería.
   */
  instalacionPerfilAlmacen: string;
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

/**
 * Interface para el miembro de empresa desde el archivo JSON.
 */
export interface MiembroEmpresa {
  id: number;
  caracterDe: string;
  rfc: string;
  instalacionesPrincipales: string;
  registroFederalContribuyentes: string;
  nacionalidad: string;
  nombreCompleto: string;
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
 * Interfaz que representa los datos necesarios para guardar un formulario completo de solicitud.
 * Incluye datos del solicitante, terceros, subcontrataciones, instalaciones, transportistas y más.
 *
 * @interface GuardarDatosFormulario
 */
export interface GuardarDatosFormulario {
  /**
   * Identificador único de la persona que realiza la solicitud.
   */
  idPersonaSolicitud: string;

  /**
   * RFC del tercero relacionado con la solicitud.
   */
  rfcTercero: string;

  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * Nombre del solicitante.
   */
  nombre: string;

  /**
   * Apellido paterno del solicitante.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del solicitante.
   */
  apellidoMaterno: string;

  /**
   * Teléfono de contacto del solicitante.
   */
  telefono: string;

  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;

  /**
   * RFC del tercero a agregar en el enlace.
   */
  agregarEnlaceRfcTercero: string;

  /**
   * RFC del solicitante a agregar en el enlace.
   */
  agregarEnlaceRfc: string;

  /**
   * Nombre del solicitante a agregar en el enlace.
   */
  agregarEnlaceNombre: string;

  /**
   * Apellido paterno del solicitante a agregar en el enlace.
   */
  agregarEnlaceApellidoPaterno: string;

  /**
   * Apellido materno del solicitante a agregar en el enlace.
   */
  agregarEnlaceApellidoMaterno: string;

  /**
   * Ciudad o estado del solicitante a agregar en el enlace.
   */
  agregarEnlaceCiudadEstado: string;

  /**
   * Cargo del solicitante a agregar en el enlace.
   */
  agregarEnlaceCargo: string;

  /**
   * Teléfono de contacto del solicitante a agregar en el enlace.
   */
  agregarEnlaceTelefono: string;

  /**
   * Correo electrónico del solicitante a agregar en el enlace.
   */
  agregarEnlaceCorreoElectronico: string;

  /**
   * Indica si el solicitante es suplente.
   */
  agregarEnlaceSuplente: boolean;

  /**
   * Valor asociado al código 2089.
   */
  '2089': number | string;

  /**
   * Valor asociado al código 2090.
   */
  '2090': number | string;

  /**
   * Valor asociado al código 2091.
   */
  '2091': number | string;

  /**
   * Valor asociado al código 2042.
   */
  '2042': number | string;

  /**
   * Valor asociado al código 2043.
   */
  '2043': number | string;

  /**
   * Valor asociado al código 2044.
   */
  '2044': number | string;

  /**
   * Fecha de inicio de operaciones de comercio exterior.
   */
  fechaInicioComercio: string;

  /**
   * Fecha de pago asociada a la solicitud.
   */
  fechaPago: string;

  /**
   * Monto total asociado a la solicitud.
   */
  monto: string;

  /**
   * Detalles de las operaciones bancarias relacionadas con la solicitud.
   */
  operacionesBancarias: string;

  /**
   * Llave única de pago asociada a la solicitud.
   */
  llavePago: string;

  /**
   * RFC del transportista relacionado con la solicitud.
   */
  transportistaRFC: string;

  /**
   * RFC del transportista modificado relacionado con la solicitud.
   */
  transportistaRFCModifTrans: string;

  /**
   * Razón social del transportista relacionado con la solicitud.
   */
  transportistaRazonSocial: string;

  /**
   * Domicilio del transportista relacionado con la solicitud.
   */
  transportistaDomicilio: string;

  /**
   * CAAT del transportista relacionado con la solicitud.
   */
  transportistaCaat: string;

  /**
   * Identificador del domicilio del transportista relacionado con la solicitud.
   */
  transportistaIdDomicilio: string;

  /**
   * Identificador del RFC del transportista relacionado con la solicitud.
   */
  transportistaIdRFC: string;

  /**
   * Identificador de la razón social del transportista relacionado con la solicitud.
   */
  transportistaIdRazonSocial: string;

  /**
   * Identificador del CAAT del transportista relacionado con la solicitud.
   */
  transportistaIdCaat: string;

  /**
   * Carácter del miembro en la solicitud.
   */
  miembroCaracterDe: string | number;

  /**
   * Indica si el miembro tiene obligación de tributar en México.
   */
  miembroTributarMexico: number | string;

  /**
   * Nacionalidad del miembro.
   */
  miembroNacionalidad: string | number;

  /**
   * Registro Federal de Contribuyentes (RFC) del miembro.
   */
  miembroRfc: string;

  /**
   * Registro federal del miembro ante autoridades pertinentes.
   */
  miembroRegistroFederal: string;

  /**
   * Nombre completo del miembro.
   */
  miembroNombreCompleto: string;

  /**
   * Tipo de persona muestra en la solicitud.
   */
  miembroTipoPersonaMuestra: string | number;

  /**
   * Nombre del miembro.
   */
  miembroNombre: string;

  /**
   * Apellido paterno del miembro.
   */
  miembroApellidoPaterno: string;

  /**
   * Apellido materno del miembro.
   */
  miembroApellidoMaterno: string;

  /**
   * Nombre de la empresa del miembro.
   */
  miembroNombreEmpresa: string;

  /**
   * RFC de la subcontrata para la búsqueda.
   */
  subcontrataRFCBusqueda: string;

  /**
   * RFC de la subcontrata.
   */
  subcontrataRFC: string;

  /**
   * Razón social de la subcontrata.
   */
  subcontrataRazonSocial: string;

  /**
   * Número de empleados de la subcontrata.
   */
  subcontrataEmpleados: string;

  /**
   * Bimestre en el que se está realizando la subcontratación.
   */
  subcontrataBimestre: number;

  /**
   * Nombre o identificación de las instalaciones principales.
   */
  principales: string | number;

  /**
   * Nombre del municipio donde se encuentra la instalación.
   */
  municipio: string;

  /**
   * Tipo de instalación en la que se encuentra la empresa.
   */
  tipoDeInstalacion: string | number;

  /**
   * Entidad federativa (estado) donde se encuentra ubicada la instalación.
   */
  entidadFederativa: string;

  /**
   * Registro ante la SE/SAT relacionado con la instalación.
   */
  registroSESAT: string;

  /**
   * Descripción de la instalación o domicilio.
   */
  descripcion: string;

  /**
   * Código postal de la ubicación de la instalación.
   */
  codigoPostal: string;

  /**
   * Proceso productivo realizado en la instalación.
   */
  procesoProductivo: string | number;

  /**
   * Indica si la empresa tiene el derecho de uso y goce del inmueble.
   */
  goceDelInmueble: string | number;

  /**
   * Empresa propietaria de la instalación.
   */
  empresa: string | number;

  /**
   * Indica si la instalación realiza operaciones de comercio exterior.
   */
  comercioExterior: string | number;

  /**
   * Indica si existe un reconocimiento mutuo (como C-TPAT) de la instalación.
   */
  mutuo: string | number;

  /**
   * Número de catálogos seleccionados.
   */
  catseleccionados: number;

  /**
   * Número de servicio asociado a la solicitud.
   */
  servicio: number;

  /**
   * Valor asociado con el código 190 (puede ser un número o una cadena).
   */
  '190': string | number;

  /**
   * Valor asociado con el código 191 (puede ser un número o una cadena).
   */
  '191': string | number;

  /**
   * Valor asociado con el código 199 (puede ser un número o una cadena).
   */
  '199': string | number;

  /**
   * Número de empleados relacionados con la solicitud.
   */
  empleados: string;

  /**
   * El bimestre relacionado con la solicitud.
   */
  bimestre: number;

  /**
   * Valor asociado con el código 2034 (puede ser un número o una cadena).
   */
  '2034': string | number;

  /**
   * Valor asociado con el código 236 (puede ser un número o una cadena).
   */
  '236': string | number;

  /**
   * Valor asociado con el código 237 (puede ser un número o una cadena).
   */
  '237': string | number;

  /**
   * Valor asociado con el código 238 (puede ser un número o una cadena).
   */
  '238': string | number;

  /**
   * Valor asociado con el código 239 (puede ser un número o una cadena).
   */
  '239': string | number;

  /**
   * Valor asociado con el código 240 (puede ser un número o una cadena).
   */
  '240': string | number;

  /**
   * Valor asociado con el código 243 (puede ser un número o una cadena).
   */
  '243': string | number;

  /**
   * Valor asociado con el código 244 (puede ser un número o una cadena).
   */
  '244': string | number;

  /**
   * Valor asociado con el código 245 (puede ser un número o una cadena).
   */
  '245': string | number;

  /**
   * Indica si se seleccionaron todos los elementos (1 o 0).
   */
  indiqueTodos: number;

  /**
   * Valor asociado con el código 246 (puede ser un número o una cadena).
   */
  '246': string | number;

  /**
   * Primer archivo relacionado con la solicitud.
   */
  file1: string;

  /**
   * Segundo archivo relacionado con la solicitud.
   */
  file2: string;

  /**
   * Valor asociado con el código 247 (puede ser un número o una cadena).
   */
  '247': string | number;

  /**
   * Valor asociado con el código 248 (puede ser un número o una cadena).
   */
  '248': string | number;

  /**
   * Identificación relacionada con la solicitud.
   */
  identificacion: string;

  /**
   * Lugar de radicación donde se procesa la solicitud.
   */
  lugarDeRadicacion: string;

  /**
   * Valor asociado con el código 249 (puede ser un número o una cadena).
   */
  '249': string | number;

  /**
   * Valor asociado con el código 250 (puede ser un número o una cadena).
   */
  '250': string | number;

  /**
   * Valor asociado con el código 251 (puede ser un número o una cadena).
   */
  '251': string | number;

  /**
   * Primer valor de tipo booleano, relacionado con algún tipo de validación o configuración.
   */
  checkbox1: boolean;

  /**
   * Segundo valor de tipo booleano, relacionado con algún tipo de validación o configuración.
   */
  checkbox2: boolean;

  /**
   * Tercer valor de tipo booleano, relacionado con algún tipo de validación o configuración.
   */
  checkbox3: boolean;

  /**
   * Estado actual 2, relacionado con la solicitud.
   */
  actualmente2: string;

  /**
   * Estado actual 1, relacionado con la solicitud.
   */
  actualmente1: string;

  /**
   * Lista de objetos que representan los empleados con su número de empleados.
   */
  numeroDeEmpleadosLista: NumeroDeEmpleados[];

  /**
   * Lista de objetos que contienen información sobre los domicilios de la empresa o entidad.
   */
  domiciliosDatos: Domicilios[];

  /**
   * Lista de objetos que representan las secciones de socios del IC (Índice de Contribuyentes).
   */
  listaSeccionSociosIC: SeccionSociosIC[];

  /**
   * Lista de objetos que contienen los datos relacionados con los enlaces operativos.
   */
  enlaceOperativosLista: EnlaceOperativo[];
}

/**
 * Representa la respuesta de una consulta realizada.
 *
 * @property {boolean} success Indica si la consulta fue exitosa.
 * @property {ConsultaDatos} datos Datos resultantes de la consulta.
 * @property {string} message Mensaje de la respuesta.
 */
export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos resultantes de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

/**
 * Representa la estructura de los datos consultados.
 *
 * @property {SolicitudState} solicitudFormulario - Información sobre exención de impuestos.
 */
export interface ConsultaDatos {
  /**
   * Información sobre exención de impuestos.
   * @type {TecnicaForm}
   */
  solicitudFormulario: SolicitudState;
}

/**
 * Representa el estado de una solicitud para empresas comercializadoras.
 *
 * @property idPersonaSolicitud Identificador de la persona asociada a la solicitud.
 * @property rfcTercero RFC del tercero relacionado.
 * @property rfc RFC de la persona o empresa.
 * @property nombre Nombre de la persona.
 * @property apellidoPaterno Apellido paterno de la persona.
 * @property apellidoMaterno Apellido materno de la persona.
 * @property telefono Número de teléfono de contacto.
 * @property correoElectronico Correo electrónico de contacto.
 * @property agregarEnlaceRfcTercero RFC del tercero para agregar enlace.
 * @property agregarEnlaceRfc RFC para agregar enlace.
 * @property agregarEnlaceNombre Nombre para agregar enlace.
 * @property agregarEnlaceApellidoPaterno Apellido paterno para agregar enlace.
 * @property agregarEnlaceApellidoMaterno Apellido materno para agregar enlace.
 * @property agregarEnlaceCiudadEstado Ciudad y estado para agregar enlace.
 * @property agregarEnlaceCargo Cargo para agregar enlace.
 * @property agregarEnlaceTelefono Teléfono para agregar enlace.
 * @property agregarEnlaceCorreoElectronico Correo electrónico para agregar enlace.
 * @property agregarEnlaceSuplente Indica si se agrega un suplente.
 * @property "2089" Valor numérico relacionado con la solicitud.
 * @property "2090" Valor numérico relacionado con la solicitud.
 * @property "2091" Valor numérico relacionado con la solicitud.
 * @property "2042" Valor numérico relacionado con la solicitud.
 * @property "2043" Valor numérico relacionado con la solicitud.
 * @property "2044" Valor numérico relacionado con la solicitud.
 * @property fechaInicioComercio Fecha de inicio de operaciones comerciales.
 * @property fechaPago Fecha de pago.
 * @property monto Monto de la operación.
 * @property operacionesBancarias Información sobre operaciones bancarias.
 * @property llavePago Llave de pago.
 * @property transportistaRFC RFC del transportista.
 * @property transportistaRFCModifTrans RFC modificado del transportista.
 * @property transportistaRazonSocial Razón social del transportista.
 * @property transportistaDomicilio Domicilio del transportista.
 * @property transportistaCaat CAAT del transportista.
 * @property transportistaIdDomicilio Identificador de domicilio del transportista.
 * @property transportistaIdRFC Identificador de RFC del transportista.
 * @property transportistaIdRazonSocial Identificador de razón social del transportista.
 * @property transportistaIdCaat Identificador de CAAT del transportista.
 * @property miembroCaracterDe Caracter de miembro.
 * @property miembroTributarMexico Indica si tributa en México.
 * @property miembroNacionalidad Nacionalidad del miembro.
 * @property miembroRfc RFC del miembro.
 * @property miembroRegistroFederal Registro federal del miembro.
 * @property miembroNombreCompleto Nombre completo del miembro.
 * @property miembroTipoPersonaMuestra Tipo de persona del miembro.
 * @property miembroNombre Nombre del miembro.
 * @property miembroApellidoPaterno Apellido paterno del miembro.
 * @property miembroApellidoMaterno Apellido materno del miembro.
 * @property miembroNombreEmpresa Nombre de la empresa del miembro.
 * @property subcontrataRFCBusqueda RFC de subcontratista para búsqueda.
 * @property subcontrataRFC RFC del subcontratista.
 * @property subcontrataRazonSocial Razón social del subcontratista.
 * @property subcontrataEmpleados Número de empleados subcontratados.
 * @property subcontrataBimestre Bimestre de subcontratación.
 * @property principales Número de principales.
 * @property municipio Municipio relacionado.
 * @property tipoDeInstalacion Tipo de instalación.
 * @property entidadFederativa Entidad federativa.
 * @property registroSESAT Registro en SESAT.
 * @property descripcion Descripción adicional.
 * @property codigoPostal Código postal.
 * @property procesoProductivo Proceso productivo.
 * @property goceDelInmueble Goce del inmueble.
 * @property empresa Identificador de la empresa.
 * @property comercioExterior Comercio exterior.
 * @property mutuo Mutuo.
 * @property catseleccionados Categorías seleccionadas.
 * @property servicio Servicio relacionado.
 * @property "190" Valor numérico relacionado.
 * @property "191" Valor numérico relacionado.
 * @property "199" Valor numérico relacionado.
 * @property empleados Número de empleados.
 * @property bimestre Bimestre correspondiente.
 * @property "2034" Valor numérico relacionado.
 * @property "236" Valor numérico relacionado.
 * @property "237" Valor numérico relacionado.
 * @property "238" Valor numérico relacionado.
 * @property "239" Valor numérico relacionado.
 * @property "240" Valor numérico relacionado.
 * @property "243" Valor numérico relacionado.
 * @property "244" Valor numérico relacionado.
 * @property "245" Valor numérico relacionado.
 * @property indiqueTodos Indica si se seleccionan todos.
 * @property "246" Valor numérico relacionado.
 * @property file1 Archivo adjunto 1.
 * @property file2 Archivo adjunto 2.
 * @property "247" Valor numérico relacionado.
 * @property "248" Valor numérico relacionado.
 * @property identificacion Identificación.
 * @property lugarDeRadicacion Lugar de radicación.
 * @property "249" Valor numérico relacionado.
 * @property "250" Valor numérico relacionado.
 * @property "251" Valor numérico relacionado.
 * @property checkbox1 Estado del primer checkbox.
 * @property checkbox2 Estado del segundo checkbox.
 * @property checkbox3 Estado del tercer checkbox.
 * @property actualmente2 Información actual 2.
 * @property actualmente1 Información actual 1.
 */
export interface SolicitudState {
  idPersonaSolicitud?: string;
  rfcTercero?: string;
  rfc?: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  telefono?: string;
  correoElectronico?: string;
  agregarEnlaceRfcTercero?: string;
  agregarEnlaceRfc?: string;
  agregarEnlaceNombre?: string;
  agregarEnlaceApellidoPaterno?: string;
  agregarEnlaceApellidoMaterno?: string;
  agregarEnlaceCiudadEstado?: string;
  agregarEnlaceCargo?: string;
  agregarEnlaceTelefono?: string;
  agregarEnlaceCorreoElectronico?: string;
  agregarEnlaceSuplente?: boolean;
  "2089"?: number;
  "2090"?: number;
  "2091"?: number;
  "2042"?: number;
  "2043"?: number;
  "2044"?: number;
  fechaInicioComercio?: string;
  fechaPago?: string;
  monto?: string;
  operacionesBancarias?: string;
  llavePago?: string;
  transportistaRFC?: string;
  transportistaRFCModifTrans?: string;
  transportistaRazonSocial?: string;
  transportistaDomicilio?: string;
  transportistaCaat?: string;
  transportistaIdDomicilio?: string;
  transportistaIdRFC?: string;
  transportistaIdRazonSocial?: string;
  transportistaIdCaat?: string;
  miembroCaracterDe?: number;
  miembroTributarMexico?: number;
  miembroNacionalidad?: number;
  miembroRfc?: string;
  miembroRegistroFederal?: string;
  miembroNombreCompleto?: string;
  miembroTipoPersonaMuestra?: string;
  miembroNombre?: string;
  miembroApellidoPaterno?: string;
  miembroApellidoMaterno?: string;
  miembroNombreEmpresa?: string;
  subcontrataRFCBusqueda?: string;
  subcontrataRFC?: string;
  subcontrataRazonSocial?: string;
  subcontrataEmpleados?: string;
  subcontrataBimestre?: number;
  principales?: number;
  municipio?: string;
  tipoDeInstalacion?: number;
  entidadFederativa?: string;
  registroSESAT?: string;
  descripcion?: string;
  codigoPostal?: string;
  procesoProductivo?: number;
  goceDelInmueble?: number;
  empresa?: number;
  comercioExterior?: number;
  mutuo?: number;
  catseleccionados?: number;
  servicio?: number;
  "190"?: number;
  "191"?: number;
  "199"?: number;
  empleados?: string;
  bimestre?: number;
  "2034"?: number;
  "236"?: number;
  "237"?: number;
  "238"?: number;
  "239"?: number;
  "240"?: number;
  "243"?: number;
  "244"?: number;
  "245"?: number;
  indiqueTodos?: number;
  "246"?: number;
  file1?: string;
  file2?: string;
  "247"?: number;
  "248"?: number;
  identificacion?: string;
  lugarDeRadicacion?: string;
  "249"?: number;
  "250"?: number;
  "251"?: number;
  checkbox1?: boolean;
  checkbox2?: boolean;
  checkbox3?: boolean;
  actualmente2?: string;
  actualmente1?: string;
}
