/**
 * Modelos de datos para el trámite 120602
 * ---------------------------------------
 * Este archivo contiene las interfaces TypeScript que representan la estructura de los datos
 * utilizados en los formularios, tablas y entidades relacionadas con la empresa, socios,
 * domicilio fiscal y representación federal para el trámite 120602.
 *
 * Uso:
 * Importar las interfaces necesarias en los componentes, servicios o stores que requieran
 * manipular o validar la información estructurada de la empresa y sus entidades asociadas.
 *
 * Funcionalidad:
 * - Define la estructura de los datos de socios, domicilio, solicitud y representación federal.
 * - Facilita la validación y el tipado estricto en formularios y servicios.
 * - Centraliza los modelos para mantener la coherencia en toda la aplicación.
 *
 * Autor: [Agregar nombre del autor si se desea]
 * Fecha: 
 */
/**
 * Representa una fila de la tabla de socios.
 */
export interface DatosSociosTable {
    /** RFC del socio */
    rfc: string;
    /** Razón social del socio */
    razonsocial: string;
    /** Nombre del socio */
    nombre: string;
    /** Apellido paterno del socio */
    apellidoPaterno: string;
    /** Apellido materno del socio */
    apellidoM: string;
    /** Correo electrónico del socio */
    correo: string;
}

/**
 * Representa una fila de la tabla de socios.
 */
export interface DatosSociosTableExtranjeros {
    /** TAX ID del socio extranjero */
    taxID: string;
    /** Razón social del socio extranjero */
    razonSocial: string;
    /** Nombre del socio extranjero */
    nombre: string;
    /** Apellido paterno del socio extranjero */
    apellidoPaterno: string;
    /** País del socio extranjero */
    pais: string;
    /** Estado del socio extranjero */
    estado: string;
    /** Correo electrónico del socio extranjero */
    correo: string;
    /** Código postal del socio extranjero */
    codigoPostal: string;
}

/**
 * Representa un estado de la república.
 */
export interface Estado {
    /** Identificador del estado */
    id: number;
    /** Descripción o nombre del estado */
    descripcion: string;
}

/**
 * Representa los datos de una representación federal.
 */
export interface RepresentacionFederal {
    /** Calle de la representación */
    calle: string;
    /** Número exterior */
    numeroExterior: string;
    /** Número interior */
    numeroInterior: string;
    /** Código postal */
    codigoPostal: string;
    /** Colonia */
    colonia: string;
    /** Municipio */
    municipio: string;
    /** Estado */
    estado: string;
    /** País */
    pais: string;
    /** Localidad */
    localidad: string;
    /** Teléfono */
    telefono: string;
    /** lada */
    lada?: string;
}

/**
 * Representa un tipo de empresa.
 */
export interface TipoDeEmpresa {
  /** Identificador del tipo de empresa */
  id: number;
  /** Etiqueta del tipo de empresa */
  label: string;
  /** Valor del tipo de empresa */
  value: string;
}

/**
 * Representa el formulario de solicitud principal.
 */
export interface SolicitudForm {
  /** Tipo de empresa seleccionada */
  tipoDeEmpresa: TipoDeEmpresa;
  /** Denominación o exposición de la empresa */
  denominacionExposicion: string;
  /** Clave de la actividad económica */
  actividadEconomicaClave: string;
  /** Descripción de la actividad económica */
  actividadEconomicaDescripcion: string;
}

/**
 * Representa los datos del importador o exportador.
 */
export interface DatosImportadorExportador {
  /** Nacionalidad del importador/exportador */
  nacionalidad: string;
  /** Tipo de persona (física/moral) */
  persona: string;
  /** Cadena de dependencia o RFC */
  cadenaDependencia: string;
}

/**
 * Representa el formulario de datos del importador/exportador.
 */
export interface FormSolicitud {
  /** Datos del importador/exportador */
  datosImportadorExportador: DatosImportadorExportador;
  /** Datos generales del socio */
  datosGeneralesSocios: DatosSociosTable;
  /** Datos generales del socio extranjero */
  datosGeneralesSociosExtranjeros: DatosSociosTableExtranjeros;
}

/**
 * Representa el formulario para el conteo total de filas.
 */
export interface FormularioParaConteoTotal {
  /** Número total de filas */
  recuentoTotalDeFilas: number;
}

/**
 * Representa el domicilio fiscal de la empresa.
 */
export interface DomicilioFiscal {
  /** Calle del domicilio fiscal */
  calle: string;
  /** Número exterior */
  numeroExterior: string;
  /** Número interior */
  numeroInterior: string;
  /** Colonia */
  colonia: string;
  /** Código postal */
  codigoPostal: string;
  /** Municipio */
  municipio: string;
  /** Estado */
  estado: string;
  /** País */
  pais: string;
}

/**
 * Representa el estado dentro de la representación federal.
 */
export interface RepresentacionFederalEstado {
  /** Identificador del estado */
  id: number;
  /** Etiqueta del estado */
  label: string;
  /** Valor del estado */
  value: string;
}

/**
 * Representa la representación dentro de la representación federal.
 */
export interface RepresentacionFederalRepresentacion {
  /** Identificador de la representación */
  id: number;
  /** Descripción de la representación */
  descripcion: string;
}

/**
 * Representa los datos de la representación federal.
 */
export interface RepresentacionFederalData {
  /** Estado seleccionado */
  estado: RepresentacionFederalEstado;
  /** Representación seleccionada */
  representacion: RepresentacionFederalRepresentacion;
}

/**
 * Representa un socio de la empresa.
 */
export interface Socio {
  /** Nombre del socio */
  nombre: string;
  /** Primer apellido del socio */
  primerApellido: string;
  /** Segundo apellido del socio */
  segundoApellido: string;
  /** Nacionalidad del socio */
  nacionalidad: string;
  /** Tipo de persona del socio */
  persona: string;
  /** Cadena de dependencia o RFC del socio */
  cadenaDependencia: string;
  /** Porcentaje de participación del socio */
  porcentajeParticipacion: number;
}

/**
 * Representa una fila de la tabla de representación federal.
 */
export interface RepresentacionFederalTabla {
  /** Nombre de la sucursal */
  sucursal: string;
  /** Dirección de la sucursal */
  direccion: string;
  /** Teléfono de la sucursal */
  telefono: string;
}

/**
 * Representa todos los datos de la empresa para el trámite.
 */
export interface DatosEmpresa {
  /** Formulario de solicitud principal */
  solicitudForm: SolicitudForm;
  /** Formulario de datos del importador/exportador */
  FormSolicitud: FormSolicitud;
  /** Formulario para el conteo total de filas */
  formularioParaConteoTotal: FormularioParaConteoTotal;
  /** Domicilio fiscal de la empresa */
  domicilioFiscal: DomicilioFiscal;
  /** Datos de la representación federal */
  representacionFederal: RepresentacionFederalData;
  /** Lista de socios nacionales */
  socios: Socio[];
  /** Lista de socios extranjeros */
  sociosExtranjeros: Socio[];
  /** Tabla de representación federal */
  representacionFederalTabla: RepresentacionFederalTabla[];
}