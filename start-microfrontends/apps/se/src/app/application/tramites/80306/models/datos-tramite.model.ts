
/**
 * Importa la interfaz Anexo utilizada en fracciones de importación.
 */
import { Anexo } from "../estados/models/plantas-consulta.model";


/**
 * Representa un trámite en la lista de trámites disponibles.
 * @interface TramiteList
 */
export interface TramiteList {
  /** Descripción del trámite */
  descripcion: string;
  /** Identificador único del trámite */
  id: number;
}


/**
 * Respuesta de la API para la consulta de trámites.
 * @interface RespuestaTramite
 */
export interface RespuestaTramite {
  /** Código de respuesta */
  code: number;
  /** Lista de trámites */
  data: TramiteList[]
  /** Mensaje de la respuesta */
  message: string;
}


/**
 * Representa un contenedor con tipo e identificador.
 * @interface Contenedores
 */
export interface Contenedores {
  /** Tipo de contenedor */
  tipo: string;
  /** Identificador del contenedor */
  id: string;
}


/**
 * Respuesta de la API para la consulta de un contenedor.
 * @interface RespuestaContenedor
 */
export interface RespuestaContenedor {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Datos de la tabla asociados */
  datos: DatosDeLaTabla
  /** Mensaje de la respuesta */
  message: string;
}


/**
 * Respuesta de la API para la consulta de múltiples contenedores.
 * @interface RespuestaContenedores
 */
export interface RespuestaContenedores {
  /** Código de respuesta */
  code: number;
  /** Lista de contenedores */
  data: Contenedores[];
  /** Mensaje de la respuesta */
  message: string;
}


/**
 * Representa los datos de una fila de la tabla de programas.
 * @interface DatosDeLaTabla
 */
export interface DatosDeLaTabla {
  /** Identificador único de la fila */
  id: number;
  /** Folio del programa */
  folioDePrograma: string;
  /** Tipo de programa */
  tipoDePrograma: string;
}


/**
 * Respuesta de la API para la consulta de datos de la tabla.
 * @interface RespuestTablaDatos
 */
export interface RespuestTablaDatos {
  /** Código de respuesta */
  code: number;
  /** Lista de datos de la tabla */
  data: DatosDeLaTabla[];
  /** Mensaje de la respuesta */
  message: string;
}

/**
 * Valor del discriminador para el trámite 80306.
 * @const {string}
 */
export const DISCRIMINATOR_VALUE = '80306';


/**
 * Tipos de TICPSE disponibles para el trámite.
 * @const {object}
 */
export const TICPSE = {
  /** Tipo TICPSE para IMMEX */
  TICPSE_IMMEX: 'TICPSE.IMMEX',
  /** Tipo TICPSE para PROSEC */
  TICPSE_PROSEC: 'TICPSE.PROSEC'
}
/**
 * Interfaz para parámetros de consulta
 * @interface Params
 * @description Define los parámetros utilizados en las consultas y operaciones del trámite 80306
 */
export interface Params{
  /** 
   * Identificador único de la solicitud
   * @type {string}
   * @description ID de la solicitud como cadena de texto (puede ser indefinido)
   */
  idSolicitud?: string;
  /** 
   * Identificador del programa IMMEX
   * @type {string}
   * @description ID del programa de la Industria Manufacturera, Maquiladora y de Servicios
   * de Exportación (puede ser indefinido)
   */
  idPrograma?: string;
  /** 
   * RFC del contribuyente
   * @type {string}
   * @description Registro Federal de Contribuyentes del solicitante (puede ser indefinido)
   */
  rfc?: string;

  /** 
   * Tipo de programa seleccionado
   * @type {string}
   * @description Indica si el programa es IMMEX o PROSEC (puede ser indefinido)
   */
  tipoPrograma?: string;
}

/**
 * Representa un programa IMMEX en una lista o tabla.
 * Contiene información básica del programa.
 * @interface ProgramaLista
 */
export interface ProgramaLista {
  /**
   * Identificador único del programa autorizado.
   */
  idProgramaAutorizado?: string;

  /**
   * Folio único del programa IMMEX.
   */
  folioPrograma?: string;

  /**
   * Tipo de programa IMMEX.
   */
  tipoPrograma: string;

  /**
   * RFC asociado al programa IMMEX.
   */
  rfc?: string;

  /**
   * Identificador compuesto del programa IMMEX.
   */
  idProgramaCompuesto: string;
}

/**
 * Interfaz para payload de solicitud
 * @interface SolicitudPayload
 * @description Estructura básica para payloads de solicitud con identificadores de programa
 */
export interface SolicitudPayload{
  /** ID del programa (puede ser indefinido) */
  idPrograma?: string;
  /** Tipo de programa (puede ser indefinido) */
  tipoPrograma?: string;
}


/**
 * Interfaz para payload de socios y accionistas
 * @interface SocioAccionistaPayload
 * @description Define la estructura del payload para manejar información de socios y accionistas
 * en las solicitudes del trámite 80302
 */
export interface SocioAccionistaPayload{
  /** 
   * Lista de identificadores de solicitudes asociadas a socios y accionistas
   * @type {number[]}
   * @description Array de IDs numéricos que referencian las solicitudes donde participan
   * los socios y accionistas (puede ser indefinido)
   */
  idSolicitud?: number[];
}


/**
 * Interfaz para operaciones IMMEX detalladas
 * @interface OperacionsImmex
 * @description Define la estructura completa para plantas IMMEX con todos sus datos operativos,
 * fiscales y de ubicación, incluyendo información de empleados y capacidades
 */
export interface OperacionsImmex {
  /** Identificador único de la planta (puede ser nulo) */
  idPlanta: string | null;
  /** Nombre de la calle de la planta (puede ser nulo) */
  calle: string | null;
  /** Número interior de la dirección (puede ser nulo) */
  numeroInterior: string | null;
  /** Número exterior de la dirección (puede ser nulo) */
  numeroExterior: string | null;
  /** Código postal de la planta (puede ser nulo) */
  codigoPostal: string | null;
  /** Nombre de la colonia (puede ser nulo) */
  colonia: string | null;
  /** Delegación o municipio (puede ser nulo) */
  delegacionMunicipio: string | null;
  /** Entidad federativa donde se ubica (puede ser nulo) */
  entidadFederativa: string | null;
  /** País de ubicación (puede ser nulo) */
  pais: string | null;
  /** RFC de la planta (puede ser nulo) */
  rfc: string | null;
  /** Domicilio fiscal (puede ser nulo) */
  domicilioFiscal: string | null;
  /** Razón social de la empresa (puede ser nulo) */
  razonSocial: string | null;
  /** Clave de la entidad federativa (puede ser nulo) */
  claveEntidadFederativa: string | null;
  /** Clave de la planta en la empresa (puede ser nulo) */
  clavePlantaEmpresa: string | null;
  /** Clave del país (puede ser nulo) */
  clavePais: string | null;
  /** Clave de delegación o municipio (puede ser nulo) */
  claveDelegacionMunicipio: string | null;
  /** Estado activo/inactivo de la planta */
  estatus: boolean;
  /** Descripción del estatus (puede ser nulo) */
  desEstatus: string | null;
  /** Localidad específica (puede ser nulo) */
  localidad: string | null;
  /** Teléfono de contacto (puede ser nulo) */
  telefono: string | null;
  /** Identificador de la solicitud asociada (puede ser nulo) */
  idSolicitud: string | null;
  /** Número de fax (puede ser nulo) */
  fax: string | null;
  /** Identificador de la dirección (puede ser nulo) */
  idDireccion: string | null;
  /** Indicador testado (puede ser nulo) */
  testadoP: number | null;
  /** Calle de la empresa matriz (puede ser nulo) */
  empresaCalle: string | null;
  /** Número interior de la empresa (puede ser nulo) */
  empresaNumeroInterior: string | null;
  /** Número exterior de la empresa (puede ser nulo) */
  empresaNumeroExterior: string | null;
  /** Código postal de la empresa (puede ser nulo) */
  empresaCodigoPostal: string | null;
  /** Colonia de la empresa (puede ser nulo) */
  empresaColonia: string | null;
  /** Delegación/municipio de la empresa (puede ser nulo) */
  empresaDelegacionMunicipio: string | null;
  /** Entidad federativa de la empresa (puede ser nulo) */
  empresaEntidadFederativa: string | null;
  /** País de la empresa (puede ser nulo) */
  empresaPais: string | null;
  /** Clave de entidad federativa de empresa (puede ser nulo) */
  empresaClaveEntidadFederativa: string | null;
  /** Clave de planta de la empresa (puede ser nulo) */
  empresaClavePlantaEmpresa: string | null;
  /** Clave del país de la empresa (puede ser nulo) */
  empresaClavePais: string | null;
  /** Clave delegación/municipio empresa (puede ser nulo) */
  empresaClaveDelegacionMunicipio: string | null;
  /** Correo electrónico de la empresa (puede ser nulo) */
  empresaCorreoElectronico: string | null;
  /** Tipo de empresa (puede ser nulo) */
  empresaTipo: string | null;
  /** Indicador de permanencia de mercancía (puede ser nulo) */
  permaneceMercancia: string | null;
  /** RFC activo (puede ser nulo) */
  rfcActivo: string | null;
  /** Domicilios inscritos (puede ser nulo) */
  domiciliosInscritos: string | null;
  /** Indicador de persona moral ISR (puede ser nulo) */
  personaMoralISR: string | null;
  /** Opinión del SAT (puede ser nulo) */
  opinionSAT: string | null;
  /** Fecha del formato 32-D (puede ser nulo) */
  fecha32D: string | null;
  /** Lista de firmantes autorizados */
  firmantes: unknown[];
  /** Datos complementarios de la planta */
  datosComplementariosPlantaDTOs: DatosComplementariosPlantaDTO[];
  /** Información de montos */
  montos: Monto[];
  /** Lista de capacidades de la planta */
  listaCapacidad: Capacidad[];
  /** Datos de empleados */
  datosEmpleados: Empleado[];
}

/**
 * Interfaz para datos complementarios de planta DTO
 * @interface DatosComplementariosPlantaDTO
 * @description Estructura para información complementaria específica de plantas industriales
 */
export interface DatosComplementariosPlantaDTO {
  /** Identificador de la planta complementaria (puede ser nulo) */
  idPlantaC: string | null;
  /** Identificador del dato específico (puede ser nulo) */
  idDato: string | null;
  /** Información del amparo del programa (puede ser nulo) */
  amparoPrograma: string | null;
  /** Tipo de documento asociado (puede ser nulo) */
  tipoDocumento: string | null;
  /** Descripción del documento (puede ser nulo) */
  descDocumento: string | null;
  /** Descripción adicional o de otro tipo (puede ser nulo) */
  descripcionOtro: string | null;
  /** Documento de respaldo (puede ser nulo) */
  documentoRespaldo: string | null;
  /** Descripción del documento de respaldo (puede ser nulo) */
  descDocRespaldo: string | null;
  /** Respaldo adicional o de otro tipo (puede ser nulo) */
  respaldoOtro: string | null;
  /** Fecha de firma del documento (puede ser nulo) */
  fechaFirma: string | null;
  /** Fecha de vigencia del documento (puede ser nulo) */
  fechaVigencia: string | null;
  /** Fecha de firma del respaldo (puede ser nulo) */
  fechaFirmaRespaldo: string | null;
  /** Fecha de vigencia del respaldo (puede ser nulo) */
  fechaVigenciaRespaldo: string | null;
}

/**
 * Interfaz para información de montos
 * @interface Monto
 * @description Define los montos financieros asociados a las plantas
 */
export interface Monto {
  /** Identificador de la planta para montos (puede ser nulo) */
  idPlantaM: string | null;
  /** Identificador único del monto (puede ser nulo) */
  idMonto: string | null;
  /** Tipo de monto (puede ser nulo) */
  tipo: string | null;
  /** Descripción del tipo de monto (puede ser nulo) */
  descTipo: string | null;
  /** Cantidad asociada al monto (puede ser nulo) */
  cantidad: string | null;
  /** Descripción detallada del monto (puede ser nulo) */
  descripcion: string | null;
  /** Valor del monto (puede ser nulo) */
  monto: string | null;
  /** Indicador de testado (puede ser nulo) */
  testado: string | null;
  /** Descripción del testado (puede ser nulo) */
  descTestado: string | null;
}

/**
 * Interfaz para capacidades de producción
 * @interface Capacidad
 * @description Define las capacidades productivas y operativas de las plantas industriales
 */
export interface Capacidad {
  /** Identificador de la planta para capacidades (puede ser nulo) */
  idPlantaCa: string | null;
  /** Identificador único de la capacidad (puede ser nulo) */
  idCapacidad: string | null;
  /** Clave del servicio proporcionado (puede ser nulo) */
  claveServicio: string | null;
  /** Descripción del servicio (puede ser nulo) */
  descripcionServicio: string | null;
  /** Clave del tipo de servicio (puede ser nulo) */
  cveTipoServicio: string | null;
  /** Tipo de servicio (puede ser nulo) */
  tipoServicio: string | null;
  /** Fracción arancelaria (puede ser nulo) */
  fraccion: string | null;
  /** Vista de la fracción (puede ser nulo) */
  fraccionVista: string | null;
  /** Unidad de medida técnica (puede ser nulo) */
  umt: string | null;
  /** Descripción de la capacidad (puede ser nulo) */
  descripcion: string | null;
  /** Capacidad efectiva de producción (puede ser nulo) */
  capacidadEfectiva: string | null;
  /** Cálculo de capacidad (puede ser nulo) */
  calculo: string | null;
  /** Número de turnos de trabajo (puede ser nulo) */
  turnos: string | null;
  /** Horas por turno (puede ser nulo) */
  horasTurno: string | null;
  /** Cantidad de empleados (puede ser nulo) */
  cantidadEmpleados: string | null;
  /** Cantidad de maquinaria (puede ser nulo) */
  cantidadMaquinaria: string | null;
  /** Descripción de la maquinaria (puede ser nulo) */
  descripcionMaquinaria: string | null;
  /** Capacidad de producción mensual (puede ser nulo) */
  capacidadMensual: string | null;
  /** Capacidad de producción anual (puede ser nulo) */
  capacidadAnual: string | null;
  /** Indicador de testado (puede ser nulo) */
  testado: string | null;
  /** Descripción del testado (puede ser nulo) */
  descTestado: string | null;
}

/**
 * Interfaz para información de empleados
 * @interface Empleado
 * @description Define los datos laborales y contractuales de empleados en plantas industriales
 */
export interface Empleado {
  /** Identificador de la planta para empleados (puede ser nulo) */
  idPlantaE: string | null;
  /** Identificador único del empleado (puede ser nulo) */
  idEmpleados: string | null;
  /** Total de empleados en la planta (puede ser nulo) */
  totalEmpleados: string | null;
  /** Empleados directos (puede ser nulo) */
  directos: string | null;
  /** Número de cédula profesional (puede ser nulo) */
  cedula: string | null;
  /** Fecha de expedición de la cédula (puede ser nulo) */
  fechaCedula: string | null;
  /** Empleados indirectos (puede ser nulo) */
  indirectos: string | null;
  /** Tipo de contrato (puede ser nulo) */
  contrato: string | null;
  /** Objeto del contrato (puede ser nulo) */
  objetoContrato: string | null;
  /** Fecha de firma del contrato (puede ser nulo) */
  fechaFirma: string | null;
  /** Fecha de fin de vigencia del contrato (puede ser nulo) */
  fechaFinVigencia: string | null;
  /** RFC de la empresa contratante (puede ser nulo) */
  rfcEmpresa: string | null;
  /** Razón social de la empresa (puede ser nulo) */
  razonEmpresa: string | null;
  /** Indicador de testado (puede ser nulo) */
  testado: string | null;
  /** Descripción del testado (puede ser nulo) */
  descTestado: string | null;
}

/**
 * @interface DatosEmpresa
 * Datos de la operación IMMEX
 */
export interface DatosEmpresa {
    /** Registro Federal de Contribuyentes */
    rfc?: string;
    /** Domicilio fiscal */
    domicilioFiscal?: string;
    /** Calle */
    calle?: string;
    /** Número interior */
    numeroInterior?: string;
    /** Número exterior */
    numeroExterior?: string;
    /** Código postal */
    codigoPostal?: string;
    /** Colonia */
    colonia?: string;
    /** Localidad */
    localidad?: string;
    /** Entidad federativa */
    entidadFederativa?: string;
    /** País */
    pais?: string;
    /** Teléfono */
    telefono?: string;
    /** Descripción del estatus */
    desEstatus?: string;
}

/**
 * Representa los datos de un Planta.
 */
export interface Plantas {
  /** 
   * ID único de la planta (opcional)
   */
  id?: number;

  /**
   * Calle de la planta
   */
  calle?: string;

  /**
   * Número exterior de la planta
   */
  numeroExterior?: string;

  /**
   * Número interior de la planta
   */
  numeroInterior?: string;

  /**
   * Código postal de la planta
   */
  codigoPostal?: string;

  /** 
   * Localidad de la planta 
   */
  localidad?: string;

  /** 
   * Colonia de la planta 
   */
  colonia?: string;

  /**
   * Municipio o delegación de la planta
   */
  municipioDelegacion?: string;

  /**
   * Estado de la planta
   */
  estado?: string;

  /** 
   * País de la planta
   */
  pais?: string;

  /**
   * RFC de la planta
   */ 
  rfc?: string;

  /**
   * Fiscal del solicitante de la planta
   */
  fiscalSolicitante?: string;

  /**
   * Razón social de la planta
   */
  razonSocial?: string;

  /** 
   * Estatus de la planta
   */
  desEstatus?: string;

  /** 
   * Indicador de estatus de la planta
   */
  estatus?: boolean;

  /**
   * Entidad federativa de la planta
   */
  entidadFederativa?: string;
}

/**
 * @interface DatosDelModificacion
 * Datos de modificación de la planta
 */
export interface DatosServicios {
    /** Identificador único */
    id?: number;
    /** Calle */
    calle?: string;
    /** Número exterior */
    numeroExterior?: number;
    /** Número interior */
    numeroInterior?: number;
    /** Código postal */
    codigoPosta?: number;
    /** Colonia */
    colonia?: string;
    /** Municipio o alcaldía */
    municipioOAlcaldia?: string;
    /** Entidad federativa */
    entidadFederativa?: string;
    /** País */
    pais?: string;
    /** Teléfono */
    telefono?: string;
    /** Descripción del estatus */
    desEstatus?: string;
}

/** @interface ProductoExportacion
 * Datos de producto de exportación
 */
/**
 * Representa los datos de un producto de exportación.
 * @interface ProductoExportacion
 */
export interface ProductoExportacion {
  /** Complemento del producto */
  complemento?: ComplementoProducto;
  /** Fracción compuesta asociada */
  fraccionCompuesta?: unknown | null;
  /** Clave del servicio IMMEX */
  cveServicioImmex?: ServicioImmex;
  /** Clave del sector */
  cveSector?: string | null;
  /** Identificador del sector PROSEC solicitado */
  idSectorProsecSol?: number | null;
  /** Indicador de fracción seleccionada */
  blnFraccionSeleccionada?: number;
  /** Descripción del testado */
  descripcionTestado?: string;
  /** Bienes producidos asociados */
  bienesProducidos?: unknown | null;
  /** Proyectos IMMEX relacionados */
  proyectosImmex?: ProyectoImmex[];
  /** Proyectos de clientes relacionados */
  proyectosClientes?: ProyectoCliente[];
  /** Lista de NICO DTOs */
  nicoDtos?: NicoDto[];
  /** Clave del producto de exportación */
  claveProductoExportacion?: number;
  /** Identificador de la solicitud */
  idSolicitud?: number | null;
  /** Solicitud asociada */
  solicitud?: unknown | null;
  /** Clave de fracción */
  cveFraccion?: string;
  /** Fracción arancelaria */
  fraccionArancelaria?: string | null;
  /** Sector asociado */
  sector?: string | null;
  /** Indicador de testado */
  testado?: boolean;
  /** Clave del servicio IMMEX (string) */
  claveServicioImmex?: string | null;
  /** Tipo de fracción */
  tipoFraccion?: string;
  /** Indicador de visibilidad */
  visible?: boolean;
  /** Fracción padre */
  fraccionPadre?: string | null;
  /** Fecha de inicio de vigencia */
  fecIniVigencia?: string | null;
  /** Fecha de fin de vigencia */
  fecFinVigencia?: string | null;
  /** Indicador de réplica */
  replica?: boolean;
  /** Indicador de activo */
  activo?: boolean | null;
  /** Identificador del producto de exportación */
  idProductoExp?: string;
}

/**
 * Representa el complemento de un producto de exportación.
 * @interface ComplementoProducto
 */
export interface ComplementoProducto {
  /** Identificador del producto */
  idProducto?: number;
  /** Anexo II relacionado */
  anexoII?: string;
  /** Tipo de producto */
  tipo?: string;
  /** Unidad de medida */
  unidadMedida?: string;
  /** Categoría del producto */
  categoria?: string;
  /** Descripción del producto */
  descripcion?: string;
  /** Valor mensual */
  valorMensual?: string;
  /** Valor anual */
  valorAnual?: string;
  /** Volumen mensual */
  volumenMensual?: string;
  /** Volumen anual */
  volumenAnual?: string;
  /** Indicador de testado */
  testado?: boolean;
  /** Fecha de fin de vigencia */
  fecFinVigencia?: string | null;
  /** Volumen anual solicitado */
  volumenAnualSolicitado?: string | null;
}

/**
 * Representa un servicio IMMEX asociado a un producto de exportación.
 * @interface ServicioImmex
 */
export interface ServicioImmex {
  /** Clave del servicio */
  claveServicio?: string | null;
  /** Nombre del servicio */
  nombre?: string | null;
  /** Tipo de servicio */
  tipoServicio?: string | null;
  /** Fecha de inicio de vigencia */
  fechaInicioVigencia?: string | null;
  /** Fecha de fin de vigencia */
  fechaFinVigencia?: string | null;
  /** Indicador de servicio activo */
  blnActivo?: boolean;
}

/**
 * Representa un proyecto IMMEX relacionado con el producto de exportación.
 * @interface ProyectoImmex
 */
export interface ProyectoImmex {
  /** Clave primaria del producto proyecto */
  productoProyectoPK?: unknown | null;
  /** Tipo de documento */
  tipoDocumento?: string | null;
  /** Descripción del proyecto */
  descripcion?: string | null;
  /** Fecha de firma del documento */
  fechaFirma?: string | null;
  /** Fecha de vigencia del documento */
  fechaVigencia?: string | null;
  /** RFC del firmante */
  rfcFirmante?: string | null;
  /** Razón social del firmante */
  razonFirmante?: string | null;
  /** Indicador de testado */
  testado?: boolean;
  /** Fecha de fin de vigencia */
  fecFinVigencia?: string | null;
}

/**
 * Representa un proyecto de cliente relacionado con el producto de exportación.
 * @interface ProyectoCliente
 */
export interface ProyectoCliente {
  /** Clave primaria del producto proveedor */
  productoProveedorPK?: ProductoProveedorPK;
  /** País de origen */
  paisOrigen?: string | null;
  /** RFC del proveedor */
  rfcProveedor?: string | null;
  /** Razón social del proveedor */
  razonProveedor?: string | null;
  /** País de destino */
  paisDestino?: string;
  /** RFC del cliente */
  rfcClient?: string;
  /** Razón social del cliente */
  razonCliente?: string;
  /** Domicilio del cliente */
  domicilioCliente?: unknown | null;
  /** Indicador de testado */
  testado?: boolean;
  /** Fecha de fin de vigencia */
  fecFinVigencia?: string | null;
}

/**
 * Representa la clave primaria compuesta de producto y proveedor.
 * @interface ProductoProveedorPK
 */
export interface ProductoProveedorPK {
  /** Identificador del producto */
  idProducto?: number;
  /** Identificador del proveedor */
  idProveedor?: number;
}

/**
 * Representa un NICO (Número de Identificación Comercial) asociado al producto de exportación.
 * @interface NicoDto
 */
export interface NicoDto {
  /** Clave NICO */
  claveNico?: string | null;
  /** Descripción del NICO */
  descripcion?: string | null;
  /** Indicador de testado NICO */
  testadoNico?: boolean | null;
  /** Indicador de testado interno */
  testadoInt?: boolean;
}


/**
 * Parámetros para buscar servicios asociados a un trámite.
 * @interface BuscarServicios
 */
export interface BuscarServicios {
  /** Identificador de la solicitud */
  id_solcitud?: string | number | null;
  /** RFC del solicitante */
  rfc?: string | null;
  /** Folio del programa */
  folio_programa?: string | null;
  /** Tipo de programa */
  tipo_programa?: string | null;
}

/**
 * Interfaz para bitácora de modificaciones
 * @interface BitacoraModificacion
 * @description Registra el historial de cambios realizados en el sistema
 */
export interface BitacoraModificacion {
  /** Identificador único de la modificación */
  idModificacion: string | null;
  /** Tipo de modificación realizada */
  tipoModificacion: string | null;
  /** Fecha en que se realizó la modificación */
  fechaModificacion: string | null;
  /** Nuevos valores aplicados */
  valoresNuevos: string | null;
  /** Valores que existían anteriormente */
  valoresAnteriores: string | null;
}

/**
 * Payload para guardar la información completa de un trámite.
 * @interface GuardarPayload
 */
export interface GuardarPayload {
  /** Tipo de solicitud */
  tipoDeSolicitud?: string;
  /** Rol del capturista */
  rol_capturista?: string;
  /** Clave del rol del capturista */
  cveRolCapturista?: string;
  /** Identificador de la solicitud */
  idSolicitud?: number;
  /** Identificador del tipo de trámite */
  idTipoTramite?: number;
  /** RFC del solicitante */
  rfc?: string;
  /** Clave de la unidad administrativa */
  cveUnidadAdministrativa?: string | null;
  /** Costo total del trámite */
  costoTotal?: number | null;
  /** Valor del discriminador */
  discriminatorValue?: string;
  /** Número de serie del certificado */
  certificadoSerialNumber?: string | null;
  /** Certificado digital */
  certificado?: string | null;
  /** Número de folio del trámite original */
  numeroFolioTramiteOriginal?: string | null;
  /** Actividad seleccionada */
  actividadSeleccionada?: string;
  /** Identificador del programa autorizado */
  idProgramaAutorizado?: string;
  /** Tipo de programa */
  tipoPrograma?: string;
  /** Tipo de modalidad */
  tipoModalidad?: string;
  /** Descripción de la modalidad */
  descripcionModalidad?: string;
  /** Folio del programa */
  folioPrograma?: string;
  /** Factor de ampliación */
  factorAmpliacion?: number;
  /** Monto de importaciones */
  montoImportaciones?: number;
  /** Datos del solicitante IMMEX */
  solicitante?: SolicitanteIMMEX;
  /** Plantas IDC asociadas */
  plantasIDC?: OperacionsImmex[];
  /** Fracciones de exportación */
  fraccionesExportacion?: ProductoExportacion[];
  /** Fracciones de importación */
  fraccionesImportacion?: Anexo[];
  /** Empresas submanufacturera asociadas */
  empresaSubmanufacturera?: DatosEmpresa[];
  /** Servicios asociados */
  servicios?: DatosServicios[];
}

/**
 * Representa los datos del solicitante IMMEX.
 * @interface SolicitanteIMMEX
 */
export interface SolicitanteIMMEX {
  /** Domicilio del solicitante */
  solicitanteDomicilio?: object;
  /** Razón social del solicitante */
  razonSocial?: string;
  /** RFC del solicitante */
  rfc?: string;
  /** Correo electrónico del solicitante */
  correoElectronico?: string;
}



