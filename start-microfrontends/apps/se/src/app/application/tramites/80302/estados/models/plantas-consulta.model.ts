/**
 * @fileoverview Modelos de datos para la gestión de plantas y consultas del trámite 80302
 * @description Este archivo contiene todas las interfaces y tipos utilizados para manejar
 * la información de plantas, solicitudes y datos relacionados con el trámite 80302
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

/**
 * Interfaz para información de domicilio de plantas
 * @interface DomicilioInfo
 * @description Define la estructura de datos para almacenar información de direcciones y ubicaciones
 */
export interface DomicilioInfo {
  /** Identificador único del domicilio */
  id?: number;
  /** Nombre de la calle de la dirección */
  calle?: string;
  /** Número exterior de la dirección */
  numeroExterior?: string;
  /** Número interior de la dirección */
  numeroInterior?: string;
  /** Código postal de la dirección */
  codigoPostal?: string;
  /** Nombre de la localidad */
  localidad?: string;
  /** Nombre de la colonia */
  colonia?: string;
  /** Delegación o municipio de la dirección */
  delegacionMunicipio?: string;
  /** Entidad federativa donde se ubica la dirección */
  entidadFederativa?: string;
  /** País de la dirección */
  pais?: string;
  /** Número telefónico de contacto */
  telefono?: string;
  /** Identificador de la planta (como cadena de texto) */
  idPlanta?: string;
  /** Identificador de la solicitud (puede estar indefinido) */
  idSolicitud?: string;
  /** Razón social de la empresa */
  razonSocial?: string;
  /** Estado de la planta, puede ser 'Baja' o 'Activada' */
  desEstatus?: 'Baja' | 'Activada';
  /** Valor booleano para el estado activo/inactivo */
  estatus?: boolean;
  /** RFC (Registro Federal de Contribuyentes) */
  rfc?: string;
}
  
/**
 * Interfaz para información complementaria de personas
 * @interface Complimentaria
 * @description Define los datos personales básicos de socios o personas relacionadas con la solicitud
 */
export interface Complimentaria {
  /** RFC (Registro Federal de Contribuyentes) de la persona */
  rfc?: string;
  /** Nombre de la persona */
  nombre?: string;
  /** Primer apellido de la persona */
  apellidoPrimer?: string;
  /** Segundo apellido de la persona */
  apellidoSegundo?: string;
}

/**
 * Interfaz para información de notarios federales
 * @interface Federetarios
 * @description Define los datos específicos de notarios federales involucrados en la solicitud
 */
export interface Federetarios {
  /** Nombre del notario federal */
  nombre?: string;
  /** Primer apellido del notario */
  apellidoPrimer?: string;
  /** Segundo apellido del notario */
  apellidoSegundo?: string;
  /** Número del acta notarial */
  numeroActa?: string;
  /** Fecha del acta notarial */
  fetchActa?: string;
  /** Número de la notaría */
  numeroNotaria?: string;
  /** Municipio o delegación del notario */
  municipioDelegacion?: string;
  /** Estado donde se ubica la notaría */
  estado?: string;
}

/**
 * Interfaz extendida para operaciones comerciales
 * @interface Operacions
 * @description Combina información complementaria, de notarios federales y domicilio
 * para operaciones comerciales complejas
 * @extends {Complimentaria}
 * @extends {Federetarios}
 * @extends {DomicilioInfo}
 */
export interface Operacions extends Complimentaria, Federetarios, DomicilioInfo {
  /** Razón social de la empresa */
  razonSocial?: string;
  /** RFC fiscal del solicitante */
  fiscalSolicitante?: string;
  /** RFC (Registro Federal de Contribuyentes) */
  rfc?: string;
  /** Nombre de la persona o empresa */
  nombre?: string;
  /** Primer apellido */
  apellidoPrimer?: string;
  /** Segundo apellido */
  apellidoSegundo?: string;
  /** Número del acta */
  numeroActa?: string;
  /** Fecha del acta */
  fetchActa?: string;
  /** Número de notaría */
  numeroNotaria?: string;
  /** Municipio o delegación */
  municipioDelegacion?: string;
  /** Estado */
  estado?: string;
  /** Identificador único */
  id?: number;
  /** Calle de la dirección */
  calle?: string;
  /** Número exterior de la dirección */
  numeroExterior?: string;
  /** Número interior de la dirección */
  numeroInterior?: string;
  /** Código postal */
  codigoPostal?: string;
  /** Localidad */
  localidad?: string;
  /** Colonia */
  colonia?: string;
  /** Delegación o municipio */
  delegacionMunicipio?: string;
  /** Entidad federativa */
  entidadFederativa?: string;
  /** País */
  pais?: string;
  /** Teléfono de contacto */
  telefono?: string;
  /** ID de la planta (como cadena de texto) */
  idPlanta?: string;
  /** ID de la solicitud */
  idSolicitud?: string;
  /** Estado de la operación: 'Baja' o 'Activada' */
  desEstatus?: 'Baja' | 'Activada';
  /** Estado booleano para activo/inactivo */
  estatus?: boolean;
}

/**
 * Interfaz para registro de bitácora de cambios
 * @interface Bitacora
 * @description Estructura para registrar modificaciones y cambios en el sistema
 */
export interface Bitacora {
  /** Tipo de modificación realizada */
  tipoModificion: string;
  /** Fecha de la modificación */
  fetchModificion: string;
  /** Valores anteriores antes de la modificación */
  valoresAnteriores: string;
  /** Nuevos valores después de la modificación */
  valoresNuevos: string;
}

/**
 * Interfaz para anexos de fracciones arancelarias
 * @interface Anexo
 * @description Define la estructura para productos de exportación e importación con fracciones arancelarias
 */
export interface Anexo {
  /** Tipo de fracción arancelaria */
  tipoFraccion?: string;
  /** Fracción arancelaria para exportación */
  fraccionArancelariaExportacion?: string;
  /** Fracción arancelaria para importación */
  fraccionArancelariaImportacion?: string;
  /** Descripción del producto o fracción */
  descripcion?: string;
  /** Valores anteriores en modificaciones */
  valoresAnteriores?: string;
  /** Fracción arancelaria de la mercancía de importación */
  fraccionArancelariaDeLaMercanciaDeImportacion?: number;
  /** Cantidad del producto */
  cantidad?: number;
  /** Valor monetario del producto */
  valor?: number;
  /** Unidad de medida del producto */
  unidadMedida?: string;
}

/**
 * Interfaz para datos de modificación del programa
 * @interface DatosModificacion
 * @description Contiene información básica para modificaciones de programas IMMEX
 */
export interface DatosModificacion {
  /** RFC (Registro Federal de Contribuyentes) */
  rfc: string;
  /** Código de representación federal */
  representacionFederal: string;
  /** Tipo de modalidad del programa */
  tipoModalidad: string;
  /** Descripción detallada de la modalidad */
  descripcionModalidad: string;
}

/**
 * Interfaz para información de socios y accionistas
 * @interface DatosSocioAccionista
 * @description Define los datos personales y fiscales de socios y accionistas
 */
export interface DatosSocioAccionista {
  /** Identificador de la solicitud (puede ser nulo) */
  idSolicitud?: number | null;
  /** Nombre del socio o accionista */
  nombre?: string;
  /** RFC (Registro Federal de Contribuyentes) */
  rfc?: string;
  /** Apellido paterno */
  apellidoPaterno?: string;
  /** Apellido materno */
  apellidoMaterno?: string;
  /** CURP (Clave Única de Registro de Población), puede ser nulo */
  curp?: string | null;
  /** Descripción del giro comercial, puede ser nulo */
  descripcionGiro?: string | null;
  /** Dirección de correo electrónico, puede ser nulo */
  correoElectronico?: string | null;
}

/**
 * Interfaz para información de notarios públicos
 * @interface Notario
 * @description Define los datos completos de notarios públicos que intervienen en actos jurídicos
 */
export interface Notario {
  /** Identificador único del notario (puede ser nulo) */
  idNotario?: string | null;
  /** Identificador de la solicitud asociada (puede ser nulo) */
  idSolicitud?: string | null;
  /** Nombre del notario público (puede ser nulo) */
  nombreNotario?: string | null;
  /** Apellido materno del notario (puede ser nulo) */
  apellidoMaterno?: string | null;
  /** Apellido paterno del notario (puede ser nulo) */
  apellidoPaterno?: string | null;
  /** RFC del notario público (puede ser nulo) */
  rfc?: string | null;
  /** Número del acta notarial (puede ser nulo) */
  numeroActa?: string | null;
  /** Fecha en que se firmó el acta (puede ser nulo) */
  fechaActa?: string | null;
  /** Número de la notaría (puede ser nulo) */
  numeroNotaria?: string | null;
  /** Número del notario público (puede ser nulo) */
  numeroNotario?: string | null;
  /** Delegación o municipio donde se ubica la notaría (puede ser nulo) */
  delegacionMunicipio?: string | null;
  /** Entidad federativa de la notaría */
  entidadFederativa: string | null;
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
 * Interfaz para productos de exportación
 * @interface ProductoExportacion
 * @description Define la estructura completa para productos destinados a exportación con todas
 * sus especificaciones técnicas, fracciones arancelarias y proyectos asociados
 */
export interface ProductoExportacion {
  /** Información complementaria del producto */
  complemento: Complemento;
  /** Fracción compuesta (puede ser nulo) */
  fraccionCompuesta: string | null;
  /** Clave del servicio IMMEX */
  cveServicioImmex: CveServicioImmex;
  /** Clave del sector (puede ser nulo) */
  cveSector: string | null;
  /** ID del sector PROSEC solicitado (puede ser nulo) */
  idSectorProsecSol: string | null;
  /** Indicador booleano de fracción seleccionada */
  blnFraccionSeleccionada: number;
  /** Descripción testada (puede ser nulo) */
  descripcionTestado: string | null;
  /** Información de bienes producidos (puede ser nulo) */
  bienesProducidos: string | null;
  /** Lista de proyectos IMMEX asociados */
  proyectosImmex: ProyectoImmex[];
  /** Lista de proyectos de clientes */
  proyectosClientes: ProyectoCliente[];
  /** Lista de códigos NICO */
  nicoDtos: NicoDto[];
  /** Clave del producto de exportación (puede ser nulo) */
  claveProductoExportacion: number | null;
  /** ID de la solicitud (puede ser nulo) */
  idSolicitud: string | null;
  /** Información de la solicitud (puede ser nulo) */
  solicitud: string | null;
  /** Clave de la fracción (puede ser nulo) */
  cveFraccion: string | null;
  /** Fracción arancelaria (puede ser nulo) */
  fraccionArancelaria: string | null;
  /** Sector económico (puede ser nulo) */
  sector: string | null;
  /** Indicador de testado */
  testado: boolean;
  /** Clave del servicio IMMEX (puede ser nulo) */
  claveServicioImmex: string | null;
  /** Tipo de fracción (puede ser nulo) */
  tipoFraccion: string | null;
  /** Indicador de visibilidad */
  visible: boolean;
  /** Fracción padre (puede ser nulo) */
  fraccionPadre: string | null;
  /** Fecha de inicio de vigencia (puede ser nulo) */
  fecIniVigencia: string | null;
  /** Fecha de fin de vigencia (puede ser nulo) */
  fecFinVigencia: string | null;
  /** Indicador de réplica */
  replica: boolean;
  /** Indicador de estado activo (puede ser nulo) */
  activo: boolean | null;
  /** ID del producto de exportación (puede ser nulo) */
  idProductoExp: string | null;
}

/**
 * Interfaz para información complementaria de productos
 * @interface Complemento
 * @description Define datos adicionales y especificaciones técnicas de productos
 */
export interface Complemento {
  /** ID del producto (puede ser nulo) */
  idProducto: number | null;
  /** Referencia al Anexo II (puede ser nulo) */
  anexoII: string | null;
  /** Tipo de producto (puede ser nulo) */
  tipo: string | null;
  /** Unidad de medida (puede ser nulo) */
  unidadMedida: string | null;
  /** Categoría del producto (puede ser nulo) */
  categoria: string | null;
  /** Descripción del producto (puede ser nulo) */
  descripcion: string | null;
  /** Valor mensual del producto (puede ser nulo) */
  valorMensual: string | null;
  /** Valor anual del producto (puede ser nulo) */
  valorAnual: string | null;
  /** Volumen mensual de producción (puede ser nulo) */
  volumenMensual: string | null;
  /** Volumen anual de producción (puede ser nulo) */
  volumenAnual: string | null;
  /** Indicador de testado */
  testado: boolean;
  /** Fecha de fin de vigencia (puede ser nulo) */
  fecFinVigencia: string | null;
  /** Volumen anual solicitado (puede ser nulo) */
  volumenAnualSolicitado: string | null;
}

/**
 * Interfaz para clave de servicio IMMEX
 * @interface CveServicioImmex
 * @description Define las características del servicio IMMEX autorizado
 */
export interface CveServicioImmex {
  /** Clave única del servicio (puede ser nulo) */
  claveServicio: string | null;
  /** Nombre del servicio (puede ser nulo) */
  nombre: string | null;
  /** Tipo de servicio IMMEX (puede ser nulo) */
  tipoServicio: string | null;
  /** Fecha de inicio de vigencia (puede ser nulo) */
  fechaInicioVigencia: string | null;
  /** Fecha de fin de vigencia (puede ser nulo) */
  fechaFinVigencia: string | null;
  /** Indicador de servicio activo */
  blnActivo: boolean;
}

/**
 * Interfaz para proyectos IMMEX
 * @interface ProyectoImmex
 * @description Define la información de proyectos específicos dentro del programa IMMEX
 */
export interface ProyectoImmex {
  /** Clave primaria del producto-proyecto */
  productoProyectoPK: ProductoProyectoPK;
  /** Tipo de documento del proyecto (puede ser nulo) */
  tipoDocumento: string | null;
  /** Descripción del proyecto (puede ser nulo) */
  descripcion: string | null;
  /** Fecha de firma del proyecto (puede ser nulo) */
  fechaFirma: string | null;
  /** Fecha de vigencia del proyecto (puede ser nulo) */
  fechaVigencia: string | null;
  /** RFC del firmante (puede ser nulo) */
  rfcFirmante: string | null;
  /** Razón social del firmante (puede ser nulo) */
  razonFirmante: string | null;
  /** Indicador de testado */
  testado: boolean;
  /** Fecha de fin de vigencia (puede ser nulo) */
  fecFinVigencia: string | null;
}

/**
 * Interfaz para clave primaria de producto-proyecto
 * @interface ProductoProyectoPK
 * @description Define la relación entre productos y proyectos IMMEX
 */
export interface ProductoProyectoPK {
  /** ID del producto (puede ser nulo) */
  idProducto: number | null;
  /** ID del proyecto IMMEX (puede ser nulo) */
  idProyectoImmex: number | null;
}

/**
 * Interfaz para proyectos de clientes
 * @interface ProyectoCliente
 * @description Define la relación comercial con clientes y proveedores en proyectos
 */
export interface ProyectoCliente {
  /** Clave primaria del producto-proveedor */
  productoProveedorPK: ProductoProveedorPK;
  /** País de origen del producto (puede ser nulo) */
  paisOrigen: string | null;
  /** RFC del proveedor (puede ser nulo) */
  rfcProveedor: string | null;
  /** Razón social del proveedor (puede ser nulo) */
  razonProveedor: string | null;
  /** País de destino del producto (puede ser nulo) */
  paisDestino: string | null;
  /** RFC del cliente (puede ser nulo) */
  rfcClient: string | null;
  /** Razón social del cliente (puede ser nulo) */
  razonCliente: string | null;
  /** Domicilio del cliente (puede ser nulo) */
  domicilioCliente: string | null;
  /** Indicador de testado */
  testado: boolean;
  /** Fecha de fin de vigencia (puede ser nulo) */
  fecFinVigencia: string | null;
}

/**
 * Interfaz para clave primaria de producto-proveedor
 * @interface ProductoProveedorPK
 * @description Define la relación entre productos y proveedores
 */
export interface ProductoProveedorPK {
  /** ID del producto (puede ser nulo) */
  idProducto: number | null;
  /** ID del proveedor (puede ser nulo) */
  idProveedor: number | null;
}

/**
 * Interfaz para códigos NICO (Nomenclatura de Insumos para Cómputo de Origen)
 * @interface NicoDto
 * @description Define la estructura para códigos de nomenclatura utilizados en el cálculo de origen
 */
export interface NicoDto {
  /** Clave del código NICO (puede ser nulo) */
  claveNico: string | null;
  /** Descripción del código NICO (puede ser nulo) */
  descripcion: string | null;
  /** Indicador de testado NICO como string (puede ser nulo) */
  testadoNico: string | null;
  /** Indicador de testado NICO como booleano */
  testadoInt: boolean;
}

/**
 * Interfaz para anexo de importación
 * @interface AnexoImportacion
 * @description Define la estructura completa para productos de importación con fracciones arancelarias
 * y especificaciones técnicas detalladas
 */
export interface AnexoImportacion {
  /** Fracción padre (puede ser nulo) */
  fraccionPadre: string | null;
  /** Descripción de la fracción padre (puede ser nulo) */
  descripcionFraccionPadre: string | null;
  /** Tipo de fracción arancelaria (puede ser nulo) */
  tipoFraccion: string | null;
  /** Indicador de exención (puede ser nulo) */
  exenta: string | null;
  /** Fracción compuesta (puede ser nulo) */
  fraccionCompuesta: string | null;
  /** Clave de la fracción padre (puede ser nulo) */
  claveFraccionPadre: string | null;
  /** Unidad de medida (puede ser nulo) */
  unidadMedida: string | null;
  /** Fracción concatenada (puede ser nulo) */
  fraccionConcatenada: string | null;
  /** Descripción testada (puede ser nulo) */
  descripcionTestado: string | null;
  /** Indicador de testado */
  testado: boolean;
  /** Tipo de operación (puede ser nulo) */
  tipoOperacion: string | null;
  /** Valor en moneda mensual (puede ser nulo) */
  valorMonedaMensual: string | null;
  /** Valor en moneda anual (puede ser nulo) */
  valorMonedaAnual: string | null;
  /** Valor de producción mensual (puede ser nulo) */
  valorProduccionMensual: string | null;
  /** Valor de producción anual (puede ser nulo) */
  valorProduccionAnual: string | null;
  /** Valor de producción anual solicitada (puede ser nulo) */
  valorProduccionAnualSolicitada: string | null;
  /** Clave de la categoría (puede ser nulo) */
  claveCategoria: string | null;
  /** Descripción de la categoría (puede ser nulo) */
  descripcionCategoria: string | null;
  /** Mensaje informativo (puede ser nulo) */
  mensaje: string | null;
  /** Descripción del usuario (puede ser nulo) */
  descripcionUsuario: string | null;
  /** Unidad de medida técnica (puede ser nulo) */
  umt: string | null;
  /** ID de la fracción (puede ser nulo) */
  idFraccion: string | null;
  /** ID del producto (puede ser nulo) */
  idProducto: string | null;
  /** ID del producto padre (puede ser nulo) */
  idProductoPadre: string | null;
  /** Clave del producto de exportación (puede ser nulo) */
  claveProductoExportacion: number | null;
  /** Descripción del servicio (puede ser nulo) */
  descripcionServicio: string | null;
  /** ID de fila (puede ser nulo) */
  rowID: string | null;
  /** Clave de la fracción (puede ser nulo) */
  cveFraccion: string | null;
  /** Capítulo arancelario (puede ser nulo) */
  capitulo: string | null;
  /** Partida arancelaria (puede ser nulo) */
  partida: string | null;
  /** Subpartida arancelaria (puede ser nulo) */
  subPartida: string | null;
  /** Descripción general (puede ser nulo) */
  descripcion: string | null;
  /** Fecha de captura (puede ser nulo) */
  fechaCaptura: string | null;
  /** Fecha de inicio de vigencia (puede ser nulo) */
  fechaInicioVigencia: string | null;
  /** Fecha de fin de vigencia (puede ser nulo) */
  fechaFinVigencia: string | null;
  /** Clave del usuario (puede ser nulo) */
  cveUsuario: string | null;
  /** Clave del capítulo de fracción (puede ser nulo) */
  cveCapituloFraccion: string | null;
  /** Clave de la partida de fracción (puede ser nulo) */
  cvePartidaFraccion: string | null;
  /** Clave de la subpartida de fracción (puede ser nulo) */
  cveSubPartidaFraccion: string | null;
  /** Indicador de estado activo (puede ser nulo) */
  activo: boolean | null;
  /** Indicador de activo en Anexo 28 (puede ser nulo) */
  activoAnexo28: boolean | null;
  /** Decreto IMMEX aplicable (puede ser nulo) */
  decretoImmex: string | null;
  /** Sector económico (puede ser nulo) */
  sector: string | null;
  /** Clave del servicio IMMEX (puede ser nulo) */
  cveServicioImmex: string | null;
  /** Lista de proveedores asociados */
  listaProveedores: unknown[];
  /** Lista de proyectos (puede ser nulo) */
  listaProyecto: unknown[] | null;
  /** Lista de códigos NICO (puede ser nulo) */
  nicoDtos: unknown[] | null;
}

/**
 * Interfaz para bitácora de modificaciones
 * @interface BitacoraModificacion
 * @description Registra el historial de cambios realizados en el sistema
 */
export interface BitacoraModificacion {
  /** Identificador único de la modificación */
  idModificacion: string;
  /** Tipo de modificación realizada */
  tipoModificacion: string;
  /** Fecha en que se realizó la modificación */
  fechaModificacion: string;
  /** Nuevos valores aplicados */
  valoresNuevos: string;
  /** Valores que existían anteriormente */
  valoresAnteriores: string;
}

/**
 * Interfaz para respuesta de plantas
 * @interface PlantasResponse
 * @description Estructura de respuesta para consultas de plantas industriales
 */
export interface PlantasResponse {
  /** Lista de plantas (puede ser indefinido) */
  plantas?: Planta[];
  /** ID de la fracción (puede ser indefinido) */
  idFraccion?: string;
  /** Estado de la respuesta (puede ser indefinido) */
  status?: string;
  /** Tipo de fracción (puede ser indefinido) */
  tipoFraccion?: string;
  /** ID de la solicitud (puede ser indefinido) */
  idSolicitud?: string;
}

/**
 * Interfaz para datos completos de planta industrial
 * @interface Planta
 * @description Define la estructura completa de una planta industrial con todos sus datos
 * operativos, fiscales, de ubicación y características técnicas
 */
export interface Planta {
  /** Identificador único de la planta (puede ser nulo) */
  idPlanta: string | null;
  /** Nombre de la calle (puede ser nulo) */
  calle: string | null;
  /** Número interior (puede ser nulo) */
  numeroInterior: string | null;
  /** Número exterior (puede ser nulo) */
  numeroExterior: string | null;
  /** Código postal (puede ser nulo) */
  codigoPostal: string | null;
  /** Colonia (puede ser nulo) */
  colonia: string | null;
  /** Delegación o municipio (puede ser nulo) */
  delegacionMunicipio: string | null;
  /** Entidad federativa (puede ser nulo) */
  entidadFederativa: string | null;
  /** País (puede ser nulo) */
  pais: string | null;
  /** RFC (puede ser nulo) */
  rfc: string | null;
  /** Domicilio fiscal (puede ser nulo) */
  domicilioFiscal: string | null;
  /** Razón social (puede ser nulo) */
  razonSocial: string | null;
  /** Clave de la entidad federativa (puede ser nulo) */
  claveEntidadFederativa: string | null;
  /** Clave de la planta en la empresa (puede ser nulo) */
  clavePlantaEmpresa: string | null;
  /** Clave del país (puede ser nulo) */
  clavePais: string | null;
  /** Clave de delegación/municipio (puede ser nulo) */
  claveDelegacionMunicipio: string | null;
  /** Estado activo/inactivo */
  estatus: boolean;
  /** Descripción del estatus (puede ser nulo) */
  desEstatus: string | null;
  /** Localidad (puede ser nulo) */
  localidad: string | null;
  /** Teléfono (puede ser nulo) */
  telefono: string | null;
  /** ID de la solicitud (puede ser nulo) */
  idSolicitud: string | null;
  /** Fax (puede ser nulo) */
  fax: string | null;
  /** ID de la dirección (puede ser nulo) */
  idDireccion: string | null;
  /** Testado P (puede ser nulo) */
  testadoP: number | null;
  /** Calle de la empresa (puede ser nulo) */
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
  /** Correo electrónico empresarial (puede ser nulo) */
  empresaCorreoElectronico: string | null;
  /** Tipo de empresa (puede ser nulo) */
  empresaTipo: string | null;
  /** Permanencia de mercancía (puede ser nulo) */
  permaneceMercancia: string | null;
  /** RFC activo (puede ser nulo) */
  rfcActivo: string | null;
  /** Domicilios inscritos (puede ser nulo) */
  domiciliosInscritos: string | null;
  /** Persona moral ISR (puede ser nulo) */
  personaMoralISR: string | null;
  /** Opinión del SAT (puede ser nulo) */
  opinionSAT: string | null;
  /** Fecha 32-D (puede ser nulo) */
  fecha32D: string | null;
  /** Firmantes (puede ser nulo) */
  firmantes: unknown[] | null;
  /** Datos complementarios de planta DTOs (puede ser nulo) */
  datosComplementariosPlantaDTOs: unknown[] | null;
  /** Montos (puede ser nulo) */
  montos: unknown[] | null;
  /** Lista de capacidades (puede ser nulo) */
  listaCapacidad: unknown[] | null;
  /** Datos de empleados (puede ser nulo) */
  datosEmpleados: unknown[] | null;
}


/**
 * Interfaz para payload de guardado de solicitud
 * @interface GuardarSolicitudPayload
 * @description Define la estructura completa del payload para guardar una solicitud completa
 * del trámite 80302 con todos sus componentes
 */
export interface GuardarSolicitudPayload {
  /** Tipo de solicitud (puede ser indefinido) */
  tipoDeSolicitud?: string;
  /** Rol del capturista (puede ser indefinido) */
  rolCapturista?: string;
  /** ID de la solicitud (puede ser indefinido) */
  idSolicitud?: number;
  /** ID del tipo de trámite (puede ser indefinido) */
  idTipoTramite?: number;
  /** RFC del solicitante (puede ser indefinido) */
  rfc?: string;
  /** Clave de unidad administrativa (puede ser indefinido) */
  cveUnidadAdministrativa?: string;
  /** Costo total del trámite (puede ser indefinido) */
  costoTotal?: number;
  /** Valor discriminatorio (puede ser indefinido) */
  discriminatorValue?: string;
  /** Número de serie del certificado (puede ser indefinido) */
  certificadoSerialNumber?: string;
  /** Certificado digital (puede ser indefinido) */
  certificado?: string;
  /** Lista de plantas a guardar (puede ser indefinido) */
  planta?: PlantaGuardar[];
  /** Lista de socios y accionistas (puede ser indefinido) */
  sociosAccionistas?: SociosGuardar[];
  /** Lista de notarios (puede ser indefinido) */
  notarios?: NotariosGuardar[];
  /** Lista de plantas IMMEX (puede ser indefinido) */
  plantasIMMEX?: PlantaImmexGuardar[];
  /** Lista de fracciones de exportación (puede ser indefinido) */
  fraccionesExportacion?: FraccionesExportacionGuardar[];
  /** Lista de fracciones de importación (puede ser indefinido) */
  fraccionesImportacion?: FraccionesImportacionGuardar[];
  /** Unidad administrativa de representación federal (puede ser indefinido) */
  unidadAdministrativaRepresentacionFederal?: {
    /** Clave de la unidad (puede ser indefinido) */
    clave?: string;
  };
  /** Datos del solicitante (puede ser indefinido) */
  solicitante?: {
    /** RFC del solicitante (puede ser indefinido) */
    rfc?: string;
  };
  /** Datos de certificación (puede ser indefinido) */
  datosCertificacion?: string;
  /** Monto de importaciones (puede ser indefinido) */
  montoImportaciones?: number;
  /** Factor de ampliación (puede ser indefinido) */
  factorAmpliacion?: number;
  /** Certificación SAT (puede ser indefinido) */
  certificacion_sat?: string;
  /** Clave de entidad (puede ser indefinido) */
  cveEntidad?: string;
  /** ID del programa autorizado (puede ser indefinido) */
  idProgramaAutorizado?: number | string;
  /** Tipo de programa (puede ser indefinido) */
  tipoPrograma?: string;
  /** Tipo de modalidad (puede ser indefinido) */
  tipoModalidad?: string;
  /** Descripción de la modalidad (puede ser indefinido) */
  descripcionModalidad?: string;
}

/**
 * Interfaz para guardar datos de planta
 * @interface PlantaGuardar
 * @description Estructura simplificada para guardar información básica de plantas
 */
export interface PlantaGuardar{
  /** ID de la planta (puede ser nulo) */
  idPlanta?: string | null;
  /** Calle de la dirección (puede ser nulo) */
  calle?: string | null;
  /** Número interior (puede ser nulo) */
  numeroInterior?: string | null;
  /** Número exterior (puede ser nulo) */
  numeroExterior?: string | null;
  /** Código postal (puede ser nulo) */
  codigoPostal?: string | null;
  /** Colonia (puede ser nulo) */
  colonia?: string | null;
  /** Delegación o municipio (puede ser nulo) */
  delegacionMunicipio?: string | null;
  /** Entidad federativa (puede ser nulo) */
  entidadFederativa?: string | null;
  /** País (puede ser nulo) */
  pais?: string | null;
  /** RFC (puede ser nulo) */
  rfc?: string | null;
  /** Estado activo/inactivo (puede ser nulo) */
  estatus?: boolean | null;
  /** Descripción del estatus (puede ser nulo) */
  desEstatus?: string | null;
  /** Localidad (puede ser nulo) */
  localidad?: string | null;
  /** Teléfono (puede ser nulo) */
  telefono?: string | null;
  /** Fax (puede ser nulo) */
  fax?: string | null;
  /** Fecha 32-D (puede ser nulo) */
  fecha32D?: string | null;
  /** Clave de entidad federativa (puede ser nulo) */
  claveEntidadFederativa?: string | null;
  /** Clave de planta en la empresa (puede ser nulo) */
  clavePlantaEmpresa?: string | null;
  /** Clave de país (puede ser nulo) */
  clavePais?: string | null;
  /** Clave de delegación o municipio (puede ser nulo) */
  claveDelegacionMunicipio?: string | null;
}

/**
 * Interfaz para guardar datos de socios
 * @interface SociosGuardar
 * @description Estructura para guardar información de socios y accionistas
 */
export interface SociosGuardar{
  /** ID de persona en solicitud (puede ser nulo) */
  idPersonaSolicitud?: number | null;
  /** RFC (puede ser nulo) */
  rfc?: string | null;
  /** Razón social (puede ser nulo) */
  razonSocial?: string | null;
  /** Nombre (puede ser nulo) */
  nombre?: string | null;
  /** Apellido materno (puede ser nulo) */
  apellidoMaterno?: string | null;
  /** Apellido paterno (puede ser nulo) */
  apellidoPaterno?: string | null;
  /** Correo electrónico (puede ser nulo) */
  correoElectronico?: string | null;
}

/**
 * Interfaz para guardar datos de notarios
 * @interface NotariosGuardar
 * @description Estructura para guardar información de notarios públicos
 */
export interface NotariosGuardar{
  /** Nombre del notario (puede ser nulo) */
  nombreNotario?: string | null;
  /** Apellido materno (puede ser nulo) */
  apellidoMaterno?: string | null;
  /** Apellido paterno (puede ser nulo) */
  apellidoPaterno?: string | null;
  /** RFC del notario (puede ser nulo) */
  rfc?: string | null;
  /** Número de acta (puede ser nulo) */
  numeroActa?: string | null;
  /** Número de notaría (puede ser nulo) */
  numeroNotaria?: string | null;
  /** Número del notario (puede ser nulo) */
  numeroNotario?: string | null;
  /** Delegación o municipio (puede ser nulo) */
  delegacionMunicipio?: string | null;
  /** Entidad federativa (puede ser nulo) */
  entidadFederativa?: string | null;
  /** Fecha del acta (puede ser nulo) */
  fechaActa?: string | null;
  /** Número de registro (puede ser nulo) */
  numeroRegistro?: string | null;
}

/**
 * Interfaz para guardar plantas IMMEX
 * @interface PlantaImmexGuardar
 * @description Estructura para guardar datos específicos de plantas IMMEX
 */
export interface PlantaImmexGuardar{
  /** ID de la planta (puede ser nulo) */
  idPlanta?: string | null;
  /** Calle (puede ser nulo) */
  calle?: string | null;
  /** Número interior (puede ser nulo) */
  numeroInterior?: string | null;
  /** Número exterior (puede ser nulo) */
  numeroExterior?: string | null;
  /** Código postal (puede ser nulo) */
  codigoPostal?: string | null;
  /** Colonia (puede ser nulo) */
  colonia?: string | null;
  /** Delegación o municipio (puede ser nulo) */
  delegacionMunicipio?: string | null;
  /** Entidad federativa (puede ser nulo) */
  entidadFederativa?: string | null;
  /** País (puede ser nulo) */
  pais?: string | null;
  /** RFC (puede ser nulo) */
  rfc?: string | null;
  /** Estatus activo/inactivo (puede ser nulo) */
  estatus?: boolean | null;
  /** Descripción del estatus (puede ser nulo) */
  desEstatus?: string | null;
  /** Localidad (puede ser nulo) */
  localidad?: string | null;
  /** Teléfono (puede ser nulo) */
  telefono?: string | null;
  /** Fax (puede ser nulo) */
  fax?: string | null;
  /** Fecha 32-D (puede ser nulo) */
  fecha32D?: string | null;
  /** Clave de entidad federativa (puede ser nulo) */
  claveEntidadFederativa?: string | null;
  /** Clave de delegación/municipio (puede ser nulo) */
  claveDelegacionMunicipio?: string | null;
  /** ID de dirección (puede ser nulo) */
  idDireccion?: string | null;
}

/**
 * Interfaz para guardar fracciones de exportación
 * @interface FraccionesExportacionGuardar
 * @description Estructura para guardar datos de fracciones arancelarias de exportación
 */
export interface FraccionesExportacionGuardar{
  /** Tipo de fracción (puede ser nulo) */
  tipoFraccion?: string | null;
  /** Fracción padre (puede ser nulo) */
  fraccionPadre?: string | null;
  /** ID del producto de exportación (puede ser nulo) */
  idProductoExp?: string | null;
  /** Fracción compuesta (puede ser nulo) */
  fraccionCompuesta?: string | null;
  /** ID del sector PROSEC solicitado (puede ser nulo) */
  idSectorProsecSol?: string | null;
  /** Descripción testada (puede ser nulo) */
  descripcionTestado?: string | null;
  /** Información de fracción arancelaria (puede ser nulo) */
  fraccionArancelaria?: {
    /** Fracción padre (puede ser nulo) */
    fraccionPadre?: string | null;
    /** Descripción de fracción padre (puede ser nulo) */
    descripcionFraccionPadre?: string | null;
    /** Tipo de fracción (puede ser nulo) */
    tipoFraccion?: string | null;
    /** Fracción compuesta (puede ser nulo) */
    fraccionCompuesta?: string | null;
    /** Clave de fracción padre (puede ser nulo) */
    claveFraccionPadre?: string | null;
    /** ID de fracción (puede ser nulo) */
    idFraccion?: string | null;
    /** ID del producto (puede ser nulo) */
    idProducto?: string | null;
  };
}

/**
 * Interfaz para guardar fracciones de importación
 * @interface FraccionesImportacionGuardar
 * @description Estructura para guardar datos de fracciones arancelarias de importación
 */
export interface FraccionesImportacionGuardar{
  /** Tipo de fracción (puede ser nulo) */
  tipoFraccion?: string | null;
  /** Fracción padre (puede ser nulo) */
  fraccionPadre?: string | null;
  /** ID del producto de exportación (puede ser nulo) */
  idProductoExp?: string | null;
  /** Fracción compuesta (puede ser nulo) */
  fraccionCompuesta?: string | null;
  /** ID del sector PROSEC solicitado (puede ser nulo) */
  idSectorProsecSol?: string | null;
  /** Descripción testada (puede ser nulo) */
  descripcionTestado?: string | null;
  /** Información de fracción arancelaria (puede ser nulo) */
  fraccionArancelaria?: {
    /** Fracción padre (puede ser nulo) */
    fraccionPadre?: string | null;
    /** Descripción de fracción padre (puede ser nulo) */
    descripcionFraccionPadre?: string | null;
    /** Tipo de fracción (puede ser nulo) */
    tipoFraccion?: string | null;
    /** Fracción compuesta (puede ser nulo) */
    fraccionCompuesta?: string | null;
    /** Clave de fracción padre (puede ser nulo) */
    claveFraccionPadre?: string | null;
    /** ID de fracción (puede ser nulo) */
    idFraccion?: string | null;
    /** ID del producto (puede ser nulo) */
    idProducto?: string | null;
  };
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