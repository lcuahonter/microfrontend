/**
 * Modelo de datos para los pasos del asistente de IMMEX
 * @export
 * @interface ListaPasosWizard
 * @property {number} indice - Posición del paso en el asistente
 * @property {string} titulo - Título del paso
 * @property {boolean} activo - Indica si el paso está activo actualmente
 * @property {boolean} completado - Indica si el paso está completado
 */
export interface ListaPasosWizard {
  indice: number;
  titulo: string;
  activo: boolean;
  completado: boolean;
}

/**
 * Modelo de datos del formulario para ampliación de sensibles IMMEX
 * @export
 * @interface ImmexAmplicationSensibleDatosDelFormulario
 * @property {Array} solicitante - Arreglo que contiene los datos de la solicitud
 * @property {Array} anexouno - Arreglo que contiene los datos de los anexos
 */
/**
 * Interfaz que representa los datos del formulario para la ampliación IMMEX de productos sensibles.
 *
 * @property fraccionArancelariaSensibles - Fracción arancelaria correspondiente a productos sensibles.
 * @property fraccionArancelaria - Fracción arancelaria general.
 * @property descripciondelproducto - Descripción del producto.
 * @property tablaFraccionArancelaria - Lista de fracciones arancelarias asociadas.
 * @property tablaFraccionDeImportacion - Lista de fracciones de importación asociadas.
 */
export interface ImmexAmplicationSensibleDatosDelFormulario {
  fraccionArancelariaSensibles: string;
    fraccionArancelaria: string;
    descripciondelproducto: string;
    tablaFraccionArancelaria: [];
    tablaFraccionDeImportacion: [];
}

/**
 * Representa un anexo con un identificador único y una descripción.
 *
 * @interface Anexo
 * @property {number} id - Identificador único del anexo.
 * @property {string} description - Descripción detallada del anexo.
 */
export interface Anexo {
  id: number;
  description: string;
}

/**
 * Interfaz que representa una tabla de fracciones arancelarias.
 * 
 * @property {string} no - Número identificador de la fracción arancelaria.
 * @property {string} fraccionArancelaria - Código de la fracción arancelaria.
 * @property {string} descripcion - Descripción de la fracción arancelaria.
 * @property {string} CantidadAnual - Cantidad anual asociada a la fracción arancelaria.
 * @property {string} CapacidadInstaladaPorPeriodo - Capacidad instalada por periodo para la fracción.
 * @property {string} umt - Unidad de medida de trabajo (UMT) asociada.
 * @property {string} encabezado - Encabezado relacionado con la fracción arancelaria.
 */
export interface TablaFraccionArancelaria {
  no: string;
  fraccionArancelaria: string;
  descripcion: string;
  CantidadAnual: string;
  CapacidadInstaladaPorPeriodo: string;
  umt: string;
  encabezado: string;
}
/**
 * Representa una tabla que contiene información sobre fracciones de importación.
 * 
 * @property no - Número identificador de la fracción.
 * @property fracciondeImportacion - Código de la fracción de importación.
 * @property fracciondeExportacion - Código de la fracción de exportación asociada.
 * @property umt - Unidad de medida utilizada para la fracción.
 * @property descripcionComercial - Descripción comercial de la fracción.
 * @property descripcion - Descripción detallada de la fracción.
 */
export interface TablaFraccionDeImportacion {
  no: string;
  fracciondeImportacion: string;
  fracciondeExportacion: string;
  umt: string;
  descripcionComercial: string;
  descripcion: string;
}

/**
 * @interface nicoInfo
 * @description Interfaz que define la estructura de la información de NICO (Nomenclatura de Identificación de Commodities).
 * Representa los datos de clasificación de materias primas y productos básicos utilizados en el comercio internacional,
 * proporcionando una base estandarizada para la identificación de commodities en operaciones IMMEX.
 *
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Interfaces.NICO
 */
export interface NicoInfo {
  id?:number;
  /**
   * @description Código NICO único que identifica el tipo de commodity o materia prima.
   * Código alfanumérico estandarizado que clasifica de manera única cada tipo de commodity utilizado en comercio internacional.
   * @type {string}
   * @example "520100"
   * @required
   */
  NICO_Columna_1: string;

  /**
   * @description Descripción detallada del commodity asociado al código NICO.
   * Texto descriptivo completo que especifica las características y naturaleza del commodity o materia prima.
   * @type {string}
   * @example "Algodón sin cardar ni peinar"
   * @required
   */
  NICO_Columna_2: string;

  /**
   * @description Indicador del estado activo (true) o inactivo (false) del código NICO.
   * Bandera booleana que determina si el código NICO está vigente y disponible para su uso en operaciones comerciales.
   * @type {boolean}
   * @default true
   * @example true
   * @required
   */
  estatus: boolean;
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */

/**
 * @interface immexRegistroform
 * @description Interfaz que define la estructura del formulario de registro IMMEX (Industria Manufacturera, Maquiladora y de Servicios de Exportación).
 * Esta interfaz contiene todos los campos necesarios para el registro de solicitudes IMMEX, incluyendo información sobre
 * productos, fracciones arancelarias, capacidades de producción y datos comerciales.
 *
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX
 */
export interface ImmexRegistroform {

  
  Nicos:string;
  
  
  productoDescExportacions:string;
  /**
   * @description Cantidad de productos que se pueden producir o procesar en un periodo específico.
   * Este campo especifica la capacidad productiva expresada como cantidad por periodo determinado.
   * @type {string}
   * @example "1000"
   * @required
   */
  candidadPorPeriodo: string;

  productoImportacion: string;

  /**
   * @description Capacidad máxima de producción disponible durante un periodo determinado.
   * Representa el límite superior de producción que puede alcanzar la empresa en el periodo especificado.
   * @type {string}
   * @example "Mensual"
   * @required
   */
  capacidadPeriodo: string;

  /**
   * @description Cantidad total anual de productos que se planea producir o procesar.
   * Volumen de producción proyectado para el año fiscal completo bajo el programa IMMEX.
   * @type {string}
   * @example "12000"
   * @required
   */
  candiadAnual: string;

  /**
   * @description Descripción detallada del NICO (Nomenclatura de Identificación de Commodities) para productos de importación.
   * Texto descriptivo que explica el tipo de commodity o materia prima que será importada.
   * @type {string}
   * @example "Algodón sin cardar ni peinar"
   * @required
   */
  commodityNicoDescImportacion: string;

  /**
   * @description Información y datos específicos del código NICO asociado al producto.
   * Contiene los datos detallados del código de nomenclatura para identificación de commodities.
   * @type {string}
   * @example "520100"
   * @required
   */
  nicoDatos: string;

  /**
   * @description Descripción comercial detallada de los productos destinados a exportación.
   * Especificación comercial completa de los bienes que serán exportados tras su procesamiento.
   * @type {string}
   * @example "Prendas de vestir confeccionadas"
   * @required
   */
  exportacionDescExportacion: string;

  /**
   * @description Descripción de la fracción arancelaria aplicable a los productos de exportación.
   * Texto descriptivo de la clasificación arancelaria que corresponde a los productos de exportación.
   * @type {string}
   * @example "Camisas de algodón para hombre"
   * @required
   */
  FraccionDescExportacion: string;

  /**
   * @description Descripción completa de la fracción arancelaria según la Tarifa de la Ley de los Impuestos Generales de Importación y Exportación.
   * Descripción oficial y detallada conforme a la TIGIE vigente para la clasificación arancelaria.
   * @type {string}
   * @example "Camisas de fibras sintéticas o artificiales, para hombres o niños"
   * @required
   */
  fraccionArancelariaDesc: string;

  /**
   * @description Número identificador único del permiso IMMEX otorgado por la autoridad competente.
   * Identificador numérico del permiso IMMEX asignado por la Secretaría de Economía.
   * @type {number}
   * @example 12345
   * @required
   */
  permisoImmexDatos: number;

  /**
   * @description Código de fracción arancelaria específico para productos de exportación.
   * Código numérico de clasificación arancelaria aplicable a los productos que serán exportados.
   * @type {string}
   * @example "6205.20.01"
   * @required
   */
  fraccionArancelariaExportacion: string;

  /**
   * @description Descripción comercial detallada del producto final destinado a exportación.
   * Especificación comercial del producto terminado que será exportado al mercado internacional.
   * @type {string}
   * @example "Camisas de vestir para caballero"
   * @required
   */
  productoDescExportacion: string;

  /**
   * @description Código numérico de la fracción arancelaria del producto de exportación.
   * Número de clasificación arancelaria en formato numérico para el producto de exportación.
   * @type {number}
   * @example 620520
   * @required
   */
  productoArancelariaExportacion: number;

  /**
   * @description Código NICO (Nomenclatura de Identificación de Commodities) asociado al producto.
   * Código alfanumérico que identifica el tipo de commodity o materia prima utilizada.
   * @type {string}
   * @example "520100"
   * @required
   */
  Nico: string;

  /**
   * @description Identificador numérico de los datos de la fracción arancelaria.
   * Número identificador único para los datos específicos de la fracción arancelaria registrada.
   * @type {number}
   * @example 1001
   * @required
   */
  fraccionDatos: number;

  /**
   * @description Cantidad anual expresada en números del commodity o materia prima.
   * Volumen numérico anual del commodity que será importado para el proceso productivo.
   * @type {number}
   * @example 50000
   * @required
   */
  commodityCandiadAnual: number;

  /**
   * @description Descripción de la capacidad instalada para el procesamiento del commodity.
   * Especificación de la infraestructura y capacidad técnica disponible para procesar el commodity.
   * @type {string}
   * @example "Planta textil con capacidad de 1000 toneladas mensuales"
   * @required
   */
  commodityCapacidadInstalda: string;

  /**
   * @description Cantidad específica por unidad de tiempo del commodity.
   * Volumen del commodity expresado por periodo específico de tiempo.
   * @type {string}
   * @example "4166.67 kg/mes"
   * @required
   */
  commodityCandidadPor: string;

  /**
   * @description Código numérico de la fracción arancelaria para la importación del commodity.
   * Número de clasificación arancelaria aplicable al commodity que será importado.
   * @type {number}
   * @example 520100
   * @required
   */
  commodityFraccionImportacion: number;

  /**
   * @description Valor numérico identificador de la importación del commodity.
   * Identificador único asignado a la operación de importación del commodity específico.
   * @type {number}
   * @example 2001
   * @required
   */
  commodityImportacion: number;

  /**
   * @description Descripción comercial del commodity destinado a importación.
   * Especificación comercial detallada de la materia prima o commodity que será importado.
   * @type {string}
   * @example "Algodón en rama sin procesar"
   * @required
   */
  commodityDescImportacion: string;

  /**
   * @description Descripción del código NICO específico para productos de importación.
   * Texto descriptivo que explica el código NICO aplicable a los productos de importación.
   * @type {string}
   * @example "Algodón sin cardar ni peinar - Código 520100"
   * @required
   */
  nicoDescImportacion: string;

  numero: number;

  /** Fracción arancelaria (Tariff classification) */
  fraccionArancelaria: string;

  /** Unidad de Medida de la Tarifa (UMT) */
  umt: string;

  /** Descripción de la TIGIE */
  descripcionTigie: string;

  /** Cantidad anual */
  cantidadAnual: number;

  /** Capacidad instalada por periodo # */
  capacidadInstalada: number;

  /** Cantidad por periodo # */
  cantidadPorPeriodo: number;
  descripcion:string;
  
}
export interface immexInfo {
  /** Número secuencial */
  numero: number;

  /** Fracción arancelaria (Tariff classification) */
  fraccionArancelaria: string;

  /** Unidad de Medida de la Tarifa (UMT) */
  umt: string;

  /** Descripción de la TIGIE */
  descripcionTigie: string;

  /** Cantidad anual */
  cantidadAnual: number;

  /** Capacidad instalada por periodo # */
  capacidadInstalada: number;

  /** Cantidad por periodo # */
  cantidadPorPeriodo: number;
  /** Nicos por periodo # */
  nicos?:number | string;
    /** productoDescExportacions por periodo # */
  productoDescExportacions?:string;
  /** id por periodo # */
  id?:number|null ;

  idFraccion?:number|null;

  nicosTable?:NicoInfo[];
}

/**
 * @constant IMMEX_SERVICIO
 * @description Configuración de las columnas de la tabla para el servicio IMMEX.
 * Define la estructura y orden de visualización de la información relacionada con permisos IMMEX,
 * incluyendo números de permiso, fracciones arancelarias, descripciones TIGIE y períodos de vigencia.
 * Cada elemento contiene el encabezado de la columna, la función para extraer el valor y el orden de presentación.
 *
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 * @readonly
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Tablas
 */
export const IMMEX_SERVICIO = [
  {
    /**
     * @description Encabezado para la columna de numeración secuencial
     * @type {string}
     */
    encabezado: 'No.',
    /**
     * @description Función extractora para obtener el número secuencial del elemento
     * @param {immexInfo} ele - Objeto con información del permiso IMMEX
     * @returns {string} Número secuencial del registro
     */
    clave: (ele: immexInfo) => ele.numero,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 1,
  },
  {
    /**
     * @description Encabezado para la columna del número de permiso IMMEX
     * @type {string}
     */
    encabezado: 'Fracción arancelaria',
    /**
     * @description Función extractora para obtener el número oficial del permiso IMMEX
     * @param {immexInfo} ele - Objeto con información del permiso IMMEX
     * @returns {string} Número oficial del permiso otorgado por la Secretaría de Economía
     */
    clave: (ele: immexInfo) => ele.fraccionArancelaria,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 2,
  },
  {
    /**
     * @description Encabezado para la columna de fracción arancelaria
     * @type {string}
     */
    encabezado: 'UMT',
    /**
     * @description Función extractora para obtener el código de fracción arancelaria
     * @param {immexInfo} ele - Objeto con información del permiso IMMEX
     * @returns {string} Código de fracción arancelaria según la TIGIE
     */
    clave: (ele: immexInfo) => ele.umt,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 3,
  },
  {
    /**
     * @description Encabezado para la columna de descripción TIGIE
     * @type {string}
     */
    encabezado: 'Descripción de la TIGIE',
    /**
     * @description Función extractora para obtener la descripción oficial de la TIGIE
     * @param {immexInfo} ele - Objeto con información del permiso IMMEX
     * @returns {string} Descripción oficial según la Tarifa de Importación y Exportación
     */
    clave: (ele: immexInfo) => ele.descripcionTigie,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 4,
  },
  {
    /**
     * @description Encabezado para la columna de Unidad de Medida Técnica
     * @type {string}
     */
    encabezado: 'Cantidad anual',
    /**
     * @description Función extractora para obtener la Unidad de Medida Técnica
     * @param {immexInfo} ele - Objeto con información del permiso IMMEX
     * @returns {string} Unidad de Medida Técnica aplicable al producto
     */
    clave: (ele: immexInfo) => ele.cantidadAnual,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 5,
  },
  {
    /**
     * @description Encabezado para la columna de cantidad por periodo
     * @type {string}
     */
    encabezado: 'Capacidad instalada por periodo # ',
    /**
     * @description Función extractora para obtener la cantidad autorizada por periodo
     * @param {immexInfo} ele - Objeto con información del permiso IMMEX
     * @returns {string} Cantidad autorizada para el periodo especificado
     */
    clave: (ele: immexInfo) => ele.capacidadInstalada,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 6,
  },
  {
    /**
     * @description Encabezado para la columna de fecha de inicio de vigencia
     * @type {string}
     */
    encabezado: 'Cantidad por periodo #',
    /**
     * @description Función extractora para obtener la fecha de inicio de vigencia del permiso
     * @param {immexInfo} ele - Objeto con información del permiso IMMEX
     * @returns {string} Fecha de inicio de vigencia en formato establecido
     */
    clave: (ele: immexInfo) => ele.cantidadPorPeriodo,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 7,
  }
];

/**
 * @interface fraccionInfo
 * @description Interfaz que define la estructura de la información de la fracción de exportación.
 * Contiene los datos específicos de una fracción arancelaria para productos de exportación bajo el régimen IMMEX,
 * incluyendo clasificaciones, descripciones comerciales y unidades de medida técnica.
 *
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Interfaces.Fraccion
 */
export interface fraccionInfo {
  id?:number;
  fraccionImportacion?: string; 
  umt?: string;                 
  descripcionTigie?: string;   
  fraccionExportacion?: string;      
  descripcionComercialExport?: string;
  nicos?:string | number;
   nicosTable?:NicoInfo[];
  numero:number|string ;

}
/**
 * @constant FRACCION_EXPORTACION
 * @description Configuración de las columnas de la tabla para la fracción de exportación.
 * Define la estructura de visualización de información relacionada con fracciones arancelarias de exportación,
 * incluyendo códigos de fracción, mercancías de importación relacionadas, unidades de medida y descripciones comerciales.
 * Facilita la presentación ordenada de datos para procesos de exportación bajo el régimen IMMEX.
 *
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 * @readonly
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Tablas.Exportacion
 */
/**
 * @constant FRACCION_EXPORTACION
 * @description Configuración de las columnas de la tabla para la fracción de exportación.
 * Define la estructura de visualización de información relacionada con fracciones arancelarias de exportación,
 * incluyendo códigos de fracción, mercancías de importación relacionadas, unidades de medida y descripciones comerciales.
 * Facilita la presentación ordenada de datos para procesos de exportación bajo el régimen IMMEX.
 *
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 * @readonly
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Tablas.Exportacion
 */
export const FRACCION_EXPORTACION: {
  encabezado: string;
  clave: (ele: fraccionInfo, index?: number) => string | undefined;
  orden: number;
}[] = [
 {
    encabezado: 'No.',
    clave: (ele: fraccionInfo) => ele?.numero.toString(),
    orden: 1,
  },
  {
    encabezado: 'Fracción de importación',
    clave: (ele: fraccionInfo) => ele.fraccionImportacion,
    orden: 2,
  },
  {
    encabezado: 'Fracción de exportación',
    clave: (ele: fraccionInfo) => ele.fraccionExportacion,
    orden: 3,
  },
  {
    encabezado: 'UMT',
    clave: (ele: fraccionInfo) => ele.umt,
    orden: 4,
  },
  {
    encabezado: 'Descripción comercial del producto de exportación',
    clave: (ele: fraccionInfo) => ele.descripcionComercialExport,
    orden: 5,
  },
  {
    encabezado: 'Descripción de la TIGIE',
    clave: (ele: fraccionInfo) => ele.descripcionTigie,
    orden: 6,
  },
];

/**
 * @constant NICO_TABLA
 * @description Configuración de las columnas de la tabla para NICO (Nomenclatura de Identificación de Commodities).
 * Define la estructura de visualización para códigos NICO y sus descripciones correspondientes,
 * facilitando la identificación y clasificación de materias primas y productos básicos en el comercio internacional.
 * Esta configuración es esencial para la correcta presentación de datos de commodities en el sistema VUCEM.
 *
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 * @readonly
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Tablas.NICO
 */
export const NICO_TABLA = [
  {
    /**
     * @description Encabezado para la columna del código NICO
     * @type {string}
     */
    encabezado: 'Nico',
    /**
     * @description Función extractora para obtener el código NICO del commodity
     * @param {nicoInfo} ele - Objeto con información del código NICO
     * @returns {string} Código NICO único que identifica el commodity
     */
    clave: (ele: nicoInfo) => ele.NICO_Columna_1,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 1,
  },
  {
    /**
     * @description Encabezado para la columna de descripción del commodity
     * @type {string}
     */
    encabezado: 'Descripción',
    /**
     * @description Función extractora para obtener la descripción detallada del commodity
     * @param {nicoInfo} ele - Objeto con información del código NICO
     * @returns {string} Descripción completa del commodity asociado al código NICO
     */
    clave: (ele: nicoInfo) => ele.NICO_Columna_2,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 2,
  },
];

/**
 * @interface nicoInfo
 * @description Interfaz que define la estructura de la información de NICO (Nomenclatura de Identificación de Commodities).
 * Representa los datos de clasificación de materias primas y productos básicos utilizados en el comercio internacional,
 * proporcionando una base estandarizada para la identificación de commodities en operaciones IMMEX.
 */

export interface nicoInfo {
  /**
   * @description Código NICO único que identifica el tipo de commodity o materia prima.
   * Código alfanumérico estandarizado que clasifica de manera única cada tipo de commodity utilizado en comercio internacional.
   * @type {string}
   * @example "520100"
   * @required
   */
  NICO_Columna_1: string;

  /**
   * @description Descripción detallada del commodity asociado al código NICO.
   * Texto descriptivo completo que especifica las características y naturaleza del commodity o materia prima.
   * @type {string}
   * @example "Algodón sin cardar ni peinar"
   * @required
   */
  NICO_Columna_2: string;

  /**
   * @description Indicador del estado activo (true) o inactivo (false) del código NICO.
   * Bandera booleana que determina si el código NICO está vigente y disponible para su uso en operaciones comerciales.
   * @type {boolean}
   * @default true
   * @example true
   * @required
   */
  estatus: boolean;
}

export interface BuscarPayload {
  fraccion: string;
  tipoSolicitud: string;
  folioPrograma: string;
  idSolicitud: string;
}

export interface FraccionPayload {
  /** Código de la fracción arancelaria */
  fraccion: string;
  /** Descripción de la fracción */
  descFraccion: string;
  /** Identificador del producto padre */
  idProductoPadre: string;
  /** Código de la fracción padre */
  fraccionPadre: string;
}


export interface GuardarFraccionResponse {
  codigo: string;
  datos: FraccionDatos;
}

export interface FraccionDatos {
  id?:number|null;
  fraccionPadre: string | null;
  descripcionFraccionPadre: string | null;
  tipoFraccion: string | null;
  exenta: string | null;
  fraccionCompuesta: string | null;
  claveFraccionPadre: string | null;
  unidadMedida: string | null;
  fraccionConcatenada: string | null;
  descripcionTestado: string | null;
  testado: boolean;
  tipoOperacion: string | null;
  valorMonedaMensual: number | null;
  valorMonedaAnual: number | null;
  valorProduccionMensual: number | null;
  valorProduccionAnual: number | null;
  valorProduccionAnualSolicitada: number | null;
  claveCategoria: string | null;
  descripcionCategoria: string | null;
  mensaje: string | null;
  descripcionUsuario: string | null;
  umt: string | null;
  idFraccion: number | null;
  idProducto: number | null;
  idProductoPadre: number | null;
  claveProductoExportacion: string | null;
  descripcionServicio: string | null;
  rowID: number | null;
  cveFraccion: string | null;
  capitulo: string | null;
  partida: string | null;
  subPartida: string | null;
  descripcion: string | null;
  fechaCaptura: string | null;
  fechaInicioVigencia: string | null;
  fechaFinVigencia: string | null;
  cveUsuario: string | null;
  cveCapituloFraccion: string | null;
  cvePartidaFraccion: string | null;
  cveSubPartidaFraccion: string | null;
  activo: boolean | null;
  activoAnexo28: boolean | null;
  decretoImmex: string | null;
  sector: string | null;
  cveServicioImmex: string | null;
  listaProveedores: ReadonlyArray<unknown> | null;
  listaProyecto: ReadonlyArray<unknown> | null;
  nicoDtos: ReadonlyArray<unknown> | null;
}

export interface FraccionResponse {
  codigo: string;
  error: string | null;
  causa: string | null;
  mensaje: string;
  datos: FraccionDatoss;
}

export interface FraccionDatoss {
  fraccionPadre: string | null;
  descripcionFraccionPadre: string | null;
  tipoFraccion: string | null;
  exenta: boolean | null;
  fraccionCompuesta: string | null;
  claveFraccionPadre: string | null;
  unidadMedida: string | null;
  fraccionConcatenada: string | null;
  descripcionTestado: string | null;
  testado: boolean;
  tipoOperacion: string | null;
  valorMonedaMensual: number | null;
  valorMonedaAnual: number | null;
  valorProduccionMensual: number | null;
  valorProduccionAnual: number | null;
  valorProduccionAnualSolicitada: number | null;
  claveCategoria: string | null;
  descripcionCategoria: string | null;
  mensaje: string | null;
  descripcionUsuario: string | null;
  umt: string | null;
  idFraccion: string | null;
  idProducto: string | null;
  idProductoPadre: string | null;
  claveProductoExportacion: string | null;
  descripcionServicio: string | null;
  rowID: string | null;
  cveFraccion: string | null;
  capitulo: string | null;
  partida: string | null;
  subPartida: string | null;
  descripcion: string | null;
  fechaCaptura: string | null;
  fechaInicioVigencia: string | null;
  fechaFinVigencia: string | null;
  cveUsuario: string | null;
  cveCapituloFraccion: string | null;
  cvePartidaFraccion: string | null;
  cveSubPartidaFraccion: string | null;
  activo: boolean | null;
  activoAnexo28: boolean | null;
  decretoImmex: string | null;
  sector: string | null;
  cveServicioImmex: string | null;
  listaProveedores: unknown| null;
  listaProyecto: unknown | null;
  nicoDtos: unknown | null;
  id?:number | null;
}
