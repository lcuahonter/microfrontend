import { EscisionHeaderItem } from "../enums/fusion-oescision.enum";
import { FraccionGridItem } from "../constantes/importador-exportador.enum";
import { ModificacionSociosItem } from "../enums/modificacion-socios.enum";
import { MostrarGridNuevoHeader } from "../enums/modificacion-goceInmueble.enum";

/**
 * Representa el grupo principal de datos para el formulario de trámite.
 *
 * Incluye información relevante como fechas seleccionadas, tipo de devolución y aviso,
 * datos del proveedor extranjero, modificaciones de socios y goce de inmueble,
 * información de personas involucradas en fusiones o escisiones, datos de la empresa,
 * tipo de carga del trámite, datos de quien recibe el trámite, domicilio relacionado,
 * y detalles de mercancía y submanufactura.
 */
export interface FormularioGrupo {
  /** Fechas seleccionadas para el formulario */
  fechasSeleccionadas: FechasSeleccionadas;
  /** Tipo de devolución y aviso */
  tipoDevAviso: TipoDevAviso,
  /** Información del proveedor extranjero */
  proveedorExtranjero: ProveedorExtranjero,
  /** Modificación de socios en el trámite */
  modificacionSocios: ModificacionSocios,
  /** Modificación de goce de inmueble */
  modificacionGoceInmueble: ModificacionGoceInmueble,
  /** Información de la persona involucrada en la fusión o escisión */
  personaFusionEscisionDTO: PersonaFusionEscisionDTO,
  /** Datos de la empresa */
  datosEmpresa: DatosEmpresa,
  /** Tipo de carga del trámite */
  cargaTipo: CargaTipo,
  /** Datos de quien recibe el trámite */
  datosQuienRecibe: DatosQuienRecibe,
  /** Datos del domicilio del lugar relacionado con el trámite */
  datosDomicilioLugar: DatosDomicilioLugar,
  /** Datos de la mercancía y submanufactura */
  datosMercanciaSubmanufactura: DatosMercanciaSubmanufactura,
  /**
   * Representa las columnas de la tabla de fracciones arancelarias.
   * Incluye información como el RFC, nombre comercial, entidad federativa,
   * municipio, colonia, calle, número exterior, número interior y código postal.
   */
    gridFraccionesHeader: FraccionGridItem[],
  /** Encabezados de la tabla de fusión o escisión */
  fusionEscisionHeader: EscisionHeaderItem[],
  
  fusion: EscisionHeaderItem[],
  /** Encabezados de la tabla de modificación de socios */
  modificacionSociosHeader: ModificacionSociosItem[],
/** Encabezados de la tabla de modificación de goce de inmueble */
  mostrarGridNuevoHeaderData: MostrarGridNuevoHeader[],
  /** Indica si el componente de modificación de socios está activo */
  formulario: { [key: string]: object }
  /** Indica si el componente de modificación de goce de inmueble está activo */
  modificacionGoceForm: { [key: string]: object },
  tipoTramiteDeclaraciones : [],
  proveedoresExtranjeros: [],
  proveedoresNacionales: [],
  capacidadAlmacenamiento: number,
  numeroTotalCarros: number,
  cantidadBienes: number,
  fechaInspeccion: string,
  descripcionClobGenerica2: string,
  idSolicitud: any,
}

/**
 * Representa los detalles de un aviso de modificación para procesos de certificación.
 *
 * @property modalidadCertificacion - Modalidad de certificación.
 * @property foreignClientsSuppliers - Indica si la entidad es cliente o proveedor extranjero.
 * @property nationalSuppliers - Indica si la entidad es proveedor nacional.
 * @property modificationsMembers - Indica si existen modificaciones de socios.
 * @property changesToLegalDocuments - Indica si existen cambios en documentos legales.
 * @property mergerOrSplitNotice - Indica si el aviso es por fusión o escisión.
 * @property additionFractions - Indica si existen fracciones adicionales.
 * @property acepto253 - Aceptación de la sección 253.
 */
export interface TipoDevAviso {
  /** Modalidad de certificación */
  modalidadCertificacion: string;
  /** Indica si es un cliente o proveedor extranjero */
  foreignClientsSuppliers: boolean,
  /** Indica si es un proveedor nacional */
  nationalSuppliers: boolean,
  /** Indica si hay modificaciones de socios */
  modificationsMembers: boolean,
  /** Indica si hay cambios en los documentos legales */
  changesToLegalDocuments: boolean,
  /** Indica si es un aviso de fusión o escisión */
  mergerOrSplitNotice: boolean,
  /** Indica si hay fracciones adicionales */
  additionFractions: boolean,
  /** Aceptación de la sección 253 */
  acepto253: boolean,
}

/**
 * Representa la información de un proveedor extranjero.
 *
 * @property archivoExtranjero - Archivo relacionado con el proveedor extranjero (puede ser nulo).
 * @property registrosProveedoresExtranjeros - Registros de proveedores extranjeros.
 * @property isActive - Indica si el componente de modificación de socios está activo (opcional).
 */
export interface ProveedorExtranjero {
  /** Archivo relacionado con el proveedor extranjero (puede ser nulo) */
  archivoExtranjero: object | null,
  /** Registros de proveedores extranjeros */
  registrosProveedoresExtranjeros: string,
  /** Indica si el componente de modificación de socios está activo */
  isActive?: boolean,
}

/**
 * Representa la información relacionada con la modificación de un socio.
 *
 * @property ensucarácterde - Número que identifica la modificación del socio.
 * @property obligadoaTributarenMéxico - Indica si el socio está obligado a tributar en México.
 * @property nacionalidad - Nacionalidad del socio.
 * @property registroFederaldeContribuyentes - Registro federal de contribuyentes del socio (puede ser nulo).
 * @property rfc - RFC del socio.
 * @property nombreCompleto - Nombre completo del socio.
 * @property isActive - Indica si el componente de modificación de socios está activo (opcional).
 */
export interface ModificacionSocios {
  /** Número que identifica la modificación del socio */
  ensucarácterde: number,
  /** Indica si está obligado a tributar en México */
  obligadoaTributarenMéxico: boolean,
  /** Nacionalidad del socio */
  nacionalidad: number,
  /** Registro federal de contribuyentes del socio (puede ser nulo) */
  registroFederaldeContribuyentes: object | null,
  /** RFC del socio */
  rfc: string,
  /** Nombre completo del socio */
  nombreCompleto: string,
  /** Indica si el componente de modificación de socios está activo */
  isActive?: boolean,
}

/**
 * Representa la modificación del goce de un inmueble, incluyendo información sobre la ubicación,
 * fechas de goce anterior y actual, datos de las partes contratantes y observaciones relevantes.
 *
 * @property idAviInmueble - Identificador del inmueble.
 * @property direccion - Dirección del inmueble.
 * @property codigoPostal - Código postal del inmueble.
 * @property cveEntidad - Clave de la entidad federativa.
 * @property cveMunicipio - Clave del municipio.
 * @property cveTipoDoc - Clave del tipo de documento.
 * @property fechaInicioAnterior - Fecha de inicio del goce anterior.
 * @property fechaFinAnterior - Fecha de fin del goce anterior.
 * @property fechaInicioActual - Fecha de inicio del goce actual.
 * @property fechaFinActual - Fecha de fin del goce actual.
 * @property rfcPartesC - RFC de las partes contratantes.
 * @property rfcPartesCons - RFC de las partes contratantes (consorcio).
 * @property nombrePartesCons - Nombre de las partes contratantes (consorcio).
 * @property caracterDeCons - Carácter de las partes contratantes.
 * @property observaciones - Observaciones sobre el inmueble.
 * @property isActive - Indica si el componente de modificación de socios está activo.
 */
export interface ModificacionGoceInmueble {
  /** Identificador del inmueble */
  idAviInmueble: string,
  /** Dirección del inmueble */
  direccion: string,
  /** Código postal del inmueble */
  codigoPostal: string,
  /** Clave de la entidad federativa */
  cveEntidad: string,
  /** Clave del municipio */
  cveMunicipio: string,
  /** Clave del tipo de documento */
  cveTipoDoc: string,
  /** Fecha de inicio del goce anterior */
  fechaInicioAnterior: string,
  /** Fecha de fin del goce anterior */
  fechaFinAnterior: string,
  /** Fecha de inicio del goce actual */
  fechaInicioActual: string,
  /** Fecha de fin del goce actual */
  fechaFinActual: string,
  /** RFC de las partes contratantes */
  rfcPartesC: string,
  /** RFC de las partes contratantes (consorcio) */
  rfcPartesCons: string,
  /** Nombre de las partes contratantes (consorcio) */
  nombrePartesCons: string,
  /** Caracter de las partes contratantes */
  caracterDeCons: string,
  /** Observaciones sobre el inmueble */
  observaciones: string,
  /** Indica si el componente de modificación de socios está activo */
  isActive?: boolean,
  /** Se asume que puede haber un ID para identificar el registro */
  id?: number,
}


/**
 * Representa el DTO de una persona o entidad involucrada en un proceso de fusión o escisión.
 *
 * @property rfc - RFC (Registro Federal de Contribuyentes) de la persona o entidad.
 * @property razonSocial - Razón social o nombre legal de la persona o entidad.
 * @property numFolioTramite - Número de folio del trámite.
 * @property fechaInicioVigencia - Fecha de inicio de la vigencia.
 * @property fechaFinVigencia - Fecha de fin de la vigencia.
 * @property isActive - Indica si el componente de modificación de socios está activo.
 */
export interface PersonaFusionEscisionDTO {
  /**
   * Registro Federal de Contribuyentes (RFC) de la empresa.
   */
  registroFederalDeContribuyentes: string;

  /**
   * Denominación o Razón Social de la empresa.
   */
  denominacionORazonSocial: string;

  /**
   * Folio VUCEM de la última certificación o renovación.
   */
  folioVucemUltimaCertificacion: string;

  /**
   * Fecha de inicio de vigencia de la última certificación o renovación.
   */
  fechaInicioVigenciaUltimaCertificacion: string;

  /**
   * Fecha de fin de vigencia de la última certificación o renovación.
   */
  fechaFinVigenciaUltimaCertificacion: string;
  /** Indica si el componente de modificación de socios está activo */
  isActive?: boolean,
}

/**
 * Representa los datos de la empresa relacionados con el aviso de modificación.
 *
 * @property numeroPrograma - Número de programa asociado.
 * @property anoPrograma - Año del programa.
 * @property mesCorrespondeAviso - Mes al que corresponde el aviso.
 * @property anoCorrespondeAviso - Año al que corresponde el aviso.
 * @property isActive - Indica si el componente de modificación de socios está activo (opcional).
 */
export interface DatosEmpresa {
  /** Número de programa asociado */
  numeroPrograma: string,
  /** Año del programa */
  anoPrograma: string,
  /** Mes al que corresponde el aviso */
  mesCorrespondeAviso: string,
  /** Año al que corresponde el aviso */
  anoCorrespondeAviso: string,
  /** Indica si el componente de modificación de socios está activo */
  isActive?: boolean,
}

/**
 * Representa el tipo de carga para el formulario.
 *
 * @property cargaTipo - Tipo de carga del formulario.
 */
export interface CargaTipo {
  /** Tipo de carga del formulario */
  cargaTipo: string,
}

/**
 * Representa un conjunto de fechas seleccionadas.
 *
 * @property fechasSeleccionadas - Un arreglo de cadenas, cada una representa una fecha seleccionada.
 */
export interface FechasSeleccionadas {
  /** Array de fechas seleccionadas */
  fechasSeleccionadas: string[] // Se asume que es un array de cadenas, ajustar si es necesario
}

/**
 * Representa los datos de la persona o entidad que recibe el trámite.
 *
 * @property rfc - RFC (Registro Federal de Contribuyentes) de quien recibe.
 * @property numberProgramaQr - Número de programa asociado al receptor.
 * @property anoProgramaQr - Año del programa asociado al receptor.
 */
export interface DatosQuienRecibe {
  /** RFC de quien recibe */
  rfc: string,
  /** Número de programa del receptor */
  numberProgramaQr: string,
  /** Año del programa del receptor */
  anoProgramaQr: string,
}

/**
 * Representa los datos de domicilio de un lugar, incluyendo información comercial y de ubicación.
 *
 * @property nombreComercial - Nombre comercial del lugar.
 * @property entidadFederativa - Entidad federativa donde se encuentra el lugar.
 * @property alcaldiaMunicipio - Alcaldía o municipio del lugar.
 * @property colonias - Colonias asociadas al lugar.
 * @property calle - Calle del lugar.
 * @property numeroExterior - Número exterior del lugar.
 * @property numeroInterior - Número interior del lugar.
 * @property codigoPostal - Código postal del lugar.
 */
export interface DatosDomicilioLugar {
  /** Nombre comercial del lugar */
  nombreComercial: string,
  /** Entidad federativa del lugar */
  entidadFederativa: string,
  /** Alcaldía o municipio del lugar */
  alcaldiaMunicipio: string,
  /** Colonias asociadas al lugar */
  colonias: string,
  /** Calle del lugar */
  calle: string,
  /** Número exterior del lugar */
  numeroExterior: string,
  /** Número interior del lugar */
  numeroInterior: string,
  /** Código postal del lugar */
  codigoPostal: string,
}

/**
 * Representa los datos de una mercancía en el contexto de submanufactura.
 *
 * @property fracArancelaria - Fracción arancelaria de la mercancía.
 * @property nico - Número de Identificación de la Mercancía (NICO).
 * @property unidadMedida - Unidad de medida de la mercancía.
 * @property cantidad - Cantidad de mercancía.
 * @property valorUsd - Valor en dólares estadounidenses de la mercancía.
 * @property descripcionMercancia - Descripción de la mercancía.
 */
export interface DatosMercanciaSubmanufactura {
  /** Fracción arancelaria de la mercancía */
  fracArancelaria: string,
  /** NICO (Número de Identificación de la Mercancía) */
  nico: string,
  /** Unidad de medida de la mercancía */
  unidadMedida: string,
  /** Cantidad de mercancía */
  cantidad: string,
  /** Valor en dólares estadounidenses de la mercancía */
  valorUsd: string,
  /** Descripción de la mercancía */
  descripcionMercancia: string,
}

/**
 * Representa las columnas de una tabla con información de una entidad.
 *
 * @property rfc - RFC de la entidad.
 * @property nombreComercial - Nombre comercial de la entidad.
 * @property entidadFederativa - Entidad federativa de la entidad.
 * @property alcaldioOMuncipio - Alcaldía o municipio de la entidad.
 * @property colonia - Colonia de la entidad.
 */
export interface ColumnasTabla {
  /** RFC de la entidad */
  rfc: string,
  /** Nombre comercial de la entidad */
  nombreComercial: string,
  /** Entidad federativa de la entidad */
  entidadFederativa: string,
  /** Alcaldía o municipio de la entidad */
  alcaldioOMuncipio: string,
  /** Colonia de la entidad */
  colonia: string,
}

/**
 * Representa la estructura de datos para un componente de tabla en Angular.
 *
 * @property tableHeader - Un arreglo de cadenas que representa los encabezados de la tabla.
 * @property tableBody - Un arreglo de objetos `TBodyData` que representa las filas de la tabla.
 */
export interface TableDataNgTable {
  /** Encabezados de la tabla */
  tableHeader: string[],
  /** Cuerpo de la tabla */
  tableBody: TBodyData[],
}

/**
 * Representa la estructura de datos para las filas del cuerpo de una tabla.
 *
 * @property tbodyData - Un arreglo de cadenas que contiene los datos de cada fila en el cuerpo de la tabla.
 */
export interface TBodyData {
  /** Datos de las filas del cuerpo de la tabla */
  tbodyData: string[]
}

export interface MiembroEmpresaResponse {
  codigo: string;
  mensaje: string;
  datos: MiembroEmpresa[];
}

export interface MiembroEmpresa {
  id_miembro_empresa: number;
  id_solicitud: number;
  nombre: string;
  rfc: string;
  tipo_caracter: string;
  obligado_tributar: boolean;
  apellido_paterno: string;
  apellido_materno: string;
  pais_clave: string;
  tipo_persona: string;
  nombre_empresa: string | null;
  tipo_movimiento: string | null;
  original: string | null;
  persona_moral: boolean;
  fecha_movimiento: string | null;
}

export interface ApiResponseMiembroEmpresa {
  codigo: string;
  mensaje: string;
  datos: MiembroEmpresaApi[];
}

export interface MiembroEmpresaApi {
  id_miembro_empresa: number ;
  id_solicitud: number;
  nombre: string;
  rfc: string;
  tipo_caracter: string;
  obligado_tributar: boolean;
  apellido_paterno: string;
  apellido_materno: string;
  pais_clave: string;
  tipo_persona: string;
  nombre_empresa: string | null;
  tipo_movimiento: string | null;
  original: string | null;
  persona_moral: boolean | null;
  fecha_movimiento: string | null;
}

export interface ApiResponseInmueble {
  codigo: string;
  mensaje: string;
  datos: InmuebleAviso[];
}

export interface InmuebleAviso {
  id_avi_inmueble: number;
  id_solicitud: number;
  direccion: string;
  cve_entidad: string;
  codigo_postal: string;
  cve_municipio: string;
  cve_tipo_doc: string;
  fecha_inicio_anterior: string | null;
  fecha_inicio_actual: string | null;
  fecha_fin_anterior: string | null;
  fecha_fin_actual: string | null;
  es_modificacion: boolean;
  observaciones: string | null;
  fecha_aviso: string;
  numero_aviso: number;
  tipo_modificacion: string | null;
  bln_partes: boolean;
  bln_vigencia: boolean;
  generico_1: string | null;
  partes: string | null;
}

// Top-level response
export interface ApiResponseguardar {
  codigo: string;
  error: string;
  causa: string;
  errores: string[];
  errores_modelo: ErroresModeloItem[];
  mensaje: string;
  datos: DatosRaw;
}

// Nested model error item
export interface ErroresModeloItem {
  campo: string;
  errores: string[];
}

// Raw datos as returned by the API (fecha_creacion is a string)
export interface DatosRaw {
  id_solicitud: string;
  fecha_creacion: string; // e.g. "2023-06-15 10:30:00"
}

/*
  If you prefer working with a Date object for fecha_creacion,
  use this parsed shape:
*/
export interface DatosParsed {
  id_solicitud: number;
  fecha_creacion: Date;
}

