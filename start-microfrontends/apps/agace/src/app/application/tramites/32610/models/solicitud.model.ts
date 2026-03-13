import { CatalogosSelect } from '@libs/shared/data-access-user/src';

/**
 * Representa los datos de una persona que desea recibir notificaciones.
 */
export interface RecibirNotificaciones {
  rfc: string; // Registro Federal de Contribuyentes
  curp: string; // Clave Única de Registro de Población
  nombre: string; // Nombre del solicitante
  apellidoPaterno: string; // Apellido paterno del solicitante
  apellidoMaterno: string; // Apellido materno del solicitante
}

/**
 * ID de la persona solicitante.
 * Este campo es opcional y sirve como identificador único para la persona que realiza la solicitud.
 */
export interface RepresentanteLegal {
  idPersonaSolicitud?: string; // Identificador único de la persona que realiza la solicitud
  rfcTercero: string; // RFC del tercero relacionado con la solicitud
  rfc: string; // RFC del representante legal
  nombre: string; // Nombre del representante legal
  apellidoPaterno: string; // Apellido paterno del representante legal
  apellidoMaterno: string; // Apellido materno del representante legal
  telefono: string; // Teléfono del representante legal
  correoElectronico: string;
}

/** Etiqueta visible de la opción */
export interface RadioOptions {
  label: string; // Etiqueta visible de la opción
  value: string | number; // Valor asociado a la opción
  hint?: string; // Texto auxiliar u orientativo
}

/** Opciones disponibles para seleccionar */
export interface InputRadio {
  radioOptions: RadioOptions[]; // Lista de opciones de tipo radio
  isRequired: boolean; // Indica si la selección es obligatoria
}

/**
 * Requisitos que deben cumplirse para la solicitud.
 * Este campo representa un conjunto de opciones de tipo radio que definen los requisitos necesarios para la solicitud.
 */
export interface SolicitudRadioLista {
  requisitos: InputRadio; // Requisitos que deben cumplirse para la solicitud (opciones tipo radio)
  clasificacionInformacion: InputRadio; // Clasificación de la información solicitada (opción de clasificación)
  reconocimientoMutuo: InputRadio; // Reconocimiento mutuo (indica si existe acuerdo de reconocimiento)
}

/**
 * RFC del transportista.
 * Representa el Registro Federal de Contribuyentes del transportista, utilizado para su identificación fiscal.
 */
export interface TransportistasTable {
  rfc: string; // RFC del transportista (Registro Federal de Contribuyentes)
  razonSocial: string; // Razón social del transportista (nombre legal de la empresa)
  domicilio: string; // Domicilio del transportista (dirección física)
  caat: string; // CAAT del transportista (Certificado de Autorización de Autotransporte)
}

/**
 * Catálogo del sector productivo relacionado con la solicitud.
 * Representa el sector al que pertenece la actividad o industria del solicitante.
 */
export interface SolicitudCatologoSelectLista {
  sectorProductivo: CatalogosSelect; // Catálogo del sector productivo relacionado con la solicitud
  servicio: CatalogosSelect; // Catálogo de opciones de servicio en la solicitud
  bimestre: CatalogosSelect; // Catálogo del bimestre correspondiente a la solicitud
  indiqueTodos: CatalogosSelect; // Catálogo que indica si se aplican todas las opciones disponibles
  enSuCaracterDe: CatalogosSelect; // Catálogo de opciones sobre el carácter del miembro
  nacionalidad: CatalogosSelect; // Catálogo de nacionalidades disponibles para la solicitud
  tipoDePersona: CatalogosSelect; // Catálogo del tipo de persona en la solicitud
  tipoDeInstalacion: CatalogosSelect; // Catálogo del tipo de instalación relacionada con la solicitud
}

/**
 * Denominación de la entidad o empresa.
 * Representa el nombre o razón social de la entidad que tiene los empleados.
 */
export interface NumeroDeEmpleados {
  denominacion: string; // Denominación de la entidad o empresa
  RFC: string; // RFC de la entidad o empresa
  numeroDeEmpleados: string; // Número total de empleados de la entidad o empresa
  bimestre: string; // Bimestre al que corresponde la información de los empleados
}

/** Indica si es instalación principal */
export interface Domicilios {
instalacionAduanera: string; // Indica si es una instalación aduanera
instalacionFiscal: string; // Indica si es instalación fiscal
instalacionAlmacen: string; // Indica si cuenta con almacén
instalacionDistribucion: string; // Indica si cuenta con centro de distribución
instalacionTemporal: string; // Indica si es una instalación temporal
instalacionTransitoria: string; // Indica si es una instalación transitoria
telefonoContacto?: string; // Teléfono de contacto de la instalación
correoContacto?: string; // Correo electrónico de contacto
nombreResponsable?: string; // Nombre del responsable de la instalación
cargoResponsable?: string; // Cargo del responsable
horarioOperacion?: string; // Horario de operación
diasOperacion?: string; // Días de operación (ej. Lunes a Viernes)
longitud?: string; // Coordenada de longitud
latitud?: string; // Coordenada de latitud
referenciasDireccion?: string; // Referencias adicionales de la dirección
fechaInicioOperacion?: string; // Fecha de inicio de operaciones
fechaRegistro?: string; // Fecha en que se registró la instalación
certificadoISO?: string; // Indica si cuenta con certificación ISO
certificadoOEA?: string; // Certificación OEA (Operador Económico Autorizado)
certificadoCTPAT?: string; // Certificación CTPAT
cuentaConRampa?: string; // Indica si cuenta con rampa de carga
cuentaConBascula?: string; // Indica si cuenta con báscula
cuentaConSistemaSeguridad?: string; // Indica si cuenta con sistema de seguridad
idInstalacion?: string; // Identificador único de la instalación
nombreInstalacion?: string; // Nombre o alias de la instalación
}

/**
 * Nombre del inventario.
 * Representa el nombre del inventario o producto registrado.
 */
export interface Inventarios {
  nombre: string; // Nombre del inventario o producto registrado
  lugarRadicacion: string; // Lugar de radicación del inventario
  anexo24: string; // Anexo 24 asociado al inventario
}
/** Identificador del miembro en la empresa */
export interface SeccionSociosIC {
  idMiembroEmpresa?: string; // Identificador del miembro en la empresa
  idSolicitud?: string; // Identificador de la solicitud relacionada
  tipoPersona?: string; // Tipo de persona (Física o Moral)
  tipoPersonaMuestra: string; // Tipo de persona mostrado al usuario
  nombreCompleto: string; // Nombre completo del miembro
  rfc: string; // RFC del miembro
  caracterDe: string; // Carácter o rol dentro de la empresa
  nacionalidad: string; // Nombre del país de origen
  tipoCaracter?: string; // Tipo de carácter (adicional)
  paisClave?: string; // Clave del país
  tributarMexico: string; // Indica si tributa en México
  nombreEmpresa: string; // Nombre de la empresa
  nombre?: string; // Nombre de la persona (si aplica)
  apellidoPaterno?: string; // Apellido paterno (si aplica)
  apellidoMaterno?: string; // Apellido materno (si aplica)
  razonSocial?: string; // Razón social (si aplica)
}

/**
 * Información relacionada con empresas subcontratadas.
 */
export interface SeccionSubcontratados {
  subcontrataRFCBusqueda?: string; // RFC para búsqueda de la empresa subcontratada (opcional)
  subcontrataRFC: string; // RFC de la empresa subcontratada
  subcontrataRazonSocial: string; // Razón social de la empresa subcontratada
  subcontrataEmpleados?: string; // Número de empleados subcontratados (opcional)
  subcontrataBimestre?: string; // Bimestre correspondiente a la subcontratación (opcional)
}

export interface EnlaceOperativo {
  rfc: string; // RFC del enlace operativo, identificador fiscal único
  nombre: string; // Nombre del enlace operativo
  apellidoPaterno: string; // Apellido paterno del enlace operativo
  apellidoMaterno: string; // Apellido materno del enlace operativo
  claveCiudad: string; // Clave de la ciudad del enlace operativo
  ciudad: string; // Ciudad del enlace operativo
  cargo: string; // Cargo que desempeña el enlace operativo
  telefono: string; // Teléfono del enlace operativo
  correo: string; // Correo electrónico del enlace operativo
  suplente: string; // Indica si es suplente de otro enlace operativo
  calle: string; // Calle donde reside el enlace operativo
  numeroExterior: string; // Número exterior de la vivienda del enlace operativo
  numeroInterior: string; // Número interior de la vivienda del enlace operativo
  colonia: string; // Colonia donde reside el enlace operativo
  codigoPostal: string; // Código postal de la residencia del enlace operativo
  localidad: string; // Localidad donde reside el enlace operativo
  delegacionMunicipio: string; // Delegación o municipio donde reside el enlace operativo
}

/**
 * Interfaz que representa los datos necesarios para guardar un formulario completo de solicitud.
 * Incluye datos del solicitante, terceros, subcontrataciones, instalaciones, transportistas y más.
 *
 * @interface GuardarDatosFormulario
 */
export interface GuardarDatosFormulario {
  idPersonaSolicitud: string; // Identificador único de la persona que realiza la solicitud
  rfcTercero: string; // RFC del tercero relacionado con la solicitud
  rfc: string; // RFC del solicitante
  nombre: string; // Nombre del solicitante
  apellidoPaterno: string; // Apellido paterno del solicitante
  apellidoMaterno: string; // Apellido materno del solicitante
  telefono: string; // Teléfono de contacto del solicitante
  correoElectronico: string; // Correo electrónico del solicitante
  agregarEnlaceRfcTercero: string; // RFC del tercero a agregar en el enlace
  agregarEnlaceRfc: string; // RFC del solicitante a agregar en el enlace
  agregarEnlaceNombre: string; // Nombre del solicitante a agregar en el enlace
  agregarEnlaceApellidoPaterno: string; // Apellido paterno del solicitante a agregar en el enlace
  agregarEnlaceApellidoMaterno: string; // Apellido materno del solicitante a agregar en el enlace
  agregarEnlaceCiudadEstado: string; // Ciudad o estado del solicitante a agregar en el enlace
  agregarEnlaceCargo: string; // Cargo del solicitante a agregar en el enlace
  agregarEnlaceTelefono: string; // Teléfono de contacto del solicitante a agregar en el enlace
  agregarEnlaceCorreoElectronico: string; // Correo electrónico del solicitante a agregar en el enlace
  agregarEnlaceSuplente: boolean; // Indica si el solicitante es suplente
  '2089': number | string; // Valor asociado al código 2089
  '2090': number | string; // Valor asociado al código 2090
  '2091': number | string; // Valor asociado al código 2091
  '2042': number | string; // Valor asociado al código 2042
  '2043': number | string; // Valor asociado al código 2043
  '2044': number | string; // Valor asociado al código 2044
  fechaInicioComercio: string; // Fecha de inicio de operaciones de comercio exterior
  fechaPago: string; // Fecha de pago asociada a la solicitud
  monto: string; // Monto total asociado a la solicitud
  operacionesBancarias: string; // Detalles de las operaciones bancarias relacionadas con la solicitud
  llavePago: string; // Llave única de pago asociada a la solicitud
  transportistaRFC: string; // RFC del transportista relacionado con la solicitud
  transportistaRFCModifTrans: string; // RFC del transportista modificado relacionado con la solicitud
  transportistaRazonSocial: string; // Razón social del transportista relacionado con la solicitud
  transportistaDomicilio: string; // Domicilio del transportista relacionado con la solicitud
  transportistaCaat: string; // CAAT del transportista relacionado con la solicitud
  transportistaIdDomicilio: string; // Identificador del domicilio del transportista relacionado con la solicitud
  transportistaIdRFC: string; // Identificador del RFC del transportista relacionado con la solicitud
  transportistaIdRazonSocial: string; // Identificador de la razón social del transportista relacionado con la solicitud
  transportistaIdCaat: string; // Identificador del CAAT del transportista relacionado con la solicitud
  miembroCaracterDe: string | number; // Carácter del miembro en la solicitud
  miembroTributarMexico: number | string; // Indica si el miembro tiene obligación de tributar en México
  miembroNacionalidad: string | number; // Nacionalidad del miembro
  miembroRfc: string; // RFC del miembro
  miembroRegistroFederal: string; // Registro federal del miembro ante autoridades pertinentes
  miembroNombreCompleto: string; // Nombre completo del miembro
  miembroTipoPersonaMuestra: string | number; // Tipo de persona muestra en la solicitud
  miembroNombre: string; // Nombre del miembro
  miembroApellidoPaterno: string; // Apellido paterno del miembro
  miembroApellidoMaterno: string; // Apellido materno del miembro
  miembroNombreEmpresa: string; // Nombre de la empresa del miembro
  subcontrataRFCBusqueda: string; // RFC de la subcontrata para la búsqueda
  subcontrataRFC: string; // RFC de la subcontrata
  subcontrataRazonSocial: string; // Razón social de la subcontrata
  subcontrataEmpleados: string; // Número de empleados de la subcontrata
  subcontrataBimestre: number; // Bimestre en el que se está realizando la subcontratación
  principales: string | number; // Nombre o identificación de las instalaciones principales
  municipio: string; // Nombre del municipio donde se encuentra la instalación
  tipoDeInstalacion: string | number; // Tipo de instalación en la que se encuentra la empresa
  entidadFederativa: string; // Entidad federativa (estado) donde se encuentra ubicada la instalación
  registroSESAT: string; // Registro ante la SE/SAT relacionado con la instalación
  descripcion: string; // Descripción de la instalación o domicilio
  codigoPostal: string; // Código postal de la ubicación de la instalación
  procesoProductivo: string | number; // Proceso productivo realizado en la instalación
  goceDelInmueble: string | number; // Indica si la empresa tiene el derecho de uso y goce del inmueble
  empresa: string | number; // Empresa propietaria de la instalación
  comercioExterior: string | number; // Indica si la instalación realiza operaciones de comercio exterior
  mutuo: string | number; // Indica si existe un reconocimiento mutuo (como C-TPAT) de la instalación
  catseleccionados: number; // Número de catálogos seleccionados
  servicio: number; // Número de servicio asociado a la solicitud
  '190': string | number; // Valor asociado con el código 190
  '191': string | number; // Valor asociado con el código 191
  '199': string | number; // Valor asociado con el código 199
  empleados: string; // Número de empleados relacionados con la solicitud
  bimestre: number; // El bimestre relacionado con la solicitud
  '2034': string | number; // Valor asociado con el código 2034
  '236': string | number; // Valor asociado con el código 236
  '237': string | number; // Valor asociado con el código 237
  '238': string | number; // Valor asociado con el código 238
  '239': string | number; // Valor asociado con el código 239
  '240': string | number; // Valor asociado con el código 240
  '243': string | number; // Valor asociado con el código 243
  '244': string | number; // Valor asociado con el código 244
  '245': string | number; // Valor asociado con el código 245
  indiqueTodos: number; // Indica si se seleccionaron todos los elementos (1 o 0)
  '246': string | number; // Valor asociado con el código 246
  file1: string; // Primer archivo relacionado con la solicitud
  file2: string; // Segundo archivo relacionado con la solicitud
  '247': string | number; // Valor asociado con el código 247
  '248': string | number; // Valor asociado con el código 248
  identificacion: string; // Identificación relacionada con la solicitud
  lugarDeRadicacion: string; // Lugar de radicación donde se procesa la solicitud
  '249': string | number; // Valor asociado con el código 249
  '250': string | number; // Valor asociado con el código 250
  '251': string | number; // Valor asociado con el código 251
  checkbox1: boolean; // Primer valor de tipo booleano
  checkbox2: boolean; // Segundo valor de tipo booleano
  checkbox3: boolean; // Tercer valor de tipo booleano
  actualmente2: string; // Estado actual 2, relacionado con la solicitud
  actualmente1: string; // Estado actual 1, relacionado con la solicitud
  numeroDeEmpleadosLista: NumeroDeEmpleados[]; // Lista de objetos que representan los empleados con su número de empleados
  domiciliosDatos: Domicilios[]; // Lista de objetos con información sobre domicilios de la empresa o entidad
  listaSeccionSociosIC: SeccionSociosIC[]; // Lista de objetos que representan las secciones de socios del IC
  enlaceOperativosLista: EnlaceOperativo[]; // Lista de objetos con datos relacionados con los enlaces operativos
}

/**
 * Representa la información del RFC del enlace operativo.
 */
export interface RFCEnlaceOperativo {
  enlaceOperativorfc: string; // RFC del enlace operativo
  denominacionRazonsocial: string;// Denominación o razón social
  domicilio: string;// Domicilio asociado
}

/**
 * Representa la información de un transportista en la lista de transportistas.
 */
export interface TransportistasListaInterface {
  enlaceOperativorfc: string; // RFC del enlace operativo del transportista
  denominacionRazonsocial: string; // Denominación o razón social del transportista
  domicilio: string; // Domicilio del transportista
  ccat: string; // Código CAAT del transportista
}
