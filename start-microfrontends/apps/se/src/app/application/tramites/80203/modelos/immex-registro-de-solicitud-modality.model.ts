
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
  permisoImmexDatos: string;

  /**
   * @description Código de fracción arancelaria específico para productos de importación.
   * Código numérico de clasificación arancelaria aplicable a los productos que serán importados.
   * @type {string}
   * @example "6205.20.01"
   * @required
   */
  fraccionArancelaria: string;

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
  nico: string;

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
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Número secuencial del registro
     */
    clave: (ele: PermisoImmexGridDatos): number => ele.consecutivo,
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
    encabezado: 'Número Permiso',
    /**
     * @description Función extractora para obtener el número oficial del permiso IMMEX
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Número oficial del permiso otorgado por la Secretaría de Economía
     */
    clave: (ele: PermisoImmexGridDatos): string => ele.numeroPrograma,
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
    encabezado: 'Fracción arancelaria',
    /**
     * @description Función extractora para obtener el código de fracción arancelaria
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Código de fracción arancelaria según la TIGIE
     */
    clave: (ele: PermisoImmexGridDatos): string => ele.fraccion,
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
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Descripción oficial según la Tarifa de Importación y Exportación
     */
    clave: (ele: PermisoImmexGridDatos): string => ele.descripcion,
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
    encabezado: 'UMT',
    /**
     * @description Función extractora para obtener la Unidad de Medida Técnica
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Unidad de Medida Técnica aplicable al producto
     */
    clave: (ele: PermisoImmexGridDatos): string => ele.umt,
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
    encabezado: 'Cantidad por periodo #',
    /**
     * @description Función extractora para obtener la cantidad autorizada por periodo
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Cantidad autorizada para el periodo especificado
     */
    clave: (ele: PermisoImmexGridDatos): string => ele.cantidadAutorizada,
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
    encabezado: 'Fecha inicio vigencia',
    /**
     * @description Función extractora para obtener la fecha de inicio de vigencia del permiso
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Fecha de inicio de vigencia en formato establecido
     */
    clave: (ele: PermisoImmexGridDatos): string => ele.fechaInicio,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 7,
  },
  {
    /**
     * @description Encabezado para la columna de fecha fin de vigencia
     * @type {string}
     */
    encabezado: 'Fecha fin vigencia',
    /**
     * @description Función extractora para obtener la fecha de fin de vigencia del permiso
     * @param {PermisoImmexGridDatos} ele - Objeto con información del permiso IMMEX
     * @returns {string} Fecha de fin de vigencia en formato establecido
     */
    clave: (ele: PermisoImmexGridDatos): string => ele.fechaFin,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 8,
  },
];

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
export const FRACCION_EXPORTACION = [
  {
    /**
     * @description Encabezado para la columna de numeración secuencial de fracciones
     * @type {string}
     */
    encabezado: 'No.',
    /**
     * @description Función extractora para obtener el número secuencial de la fracción
     * @param {fraccionInfo} ele - Objeto con información de la fracción arancelaria
     * @returns {number} Número secuencial del registro de fracción
     */
    clave: (ele: FraccionInfo): number => ele.fraccionArancelaria.consecutivo,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 1,
  },
  {
    /**
     * @description Encabezado para la columna del código de fracción arancelaria
     * @type {string}
     */
    encabezado: 'Fracción arancelaria',
    /**
     * @description Función extractora para obtener el código oficial de fracción arancelaria
     * @param {fraccionInfo} ele - Objeto con información de la fracción arancelaria
     * @returns {string} Código de fracción arancelaria según nomenclatura internacional
     */
    clave: (ele: FraccionInfo): string => ele.fraccionArancelaria.cveFraccion,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 2,
  },
  {
    /**
     * @description Encabezado para la columna de mercancía de importación relacionada
     * @type {string}
     */
    encabezado: 'Mercancía de importación',
    /**
     * @description Función extractora para obtener la descripción de mercancía de importación
     * @param {fraccionInfo} ele - Objeto con información de la fracción arancelaria
     * @returns {string} Descripción de la mercancía importada relacionada con esta fracción
     */
    clave: (ele: FraccionInfo): string => ele.fraccionArancelaria.fraccionPadre,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 3,
  },
  {
    /**
     * @description Encabezado para la columna de Unidad de Medida Técnica
     * @type {string}
     */
    encabezado: 'UMT',
    /**
     * @description Función extractora para obtener la Unidad de Medida Técnica de la fracción
     * @param {fraccionInfo} ele - Objeto con información de la fracción arancelaria
     * @returns {string} Unidad de Medida Técnica aplicable a esta fracción
     */
    clave: (ele: FraccionInfo): string => ele.fraccionArancelaria.umt,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 4,
  },
  {
    /**
     * @description Encabezado para la columna de descripción TIGIE
     * @type {string}
     */
    encabezado: 'Descripción de la TIGIE',
    /**
     * @description Función extractora para obtener la descripción oficial TIGIE
     * @param {fraccionInfo} ele - Objeto con información de la fracción arancelaria
     * @returns {string} Descripción oficial según la Tarifa de Importación y Exportación
     */
    clave: (ele: FraccionInfo): string => ele.fraccionArancelaria.descripcion,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 5,
  },
  {
    /**
     * @description Encabezado para la columna de descripción comercial de exportación
     * @type {string}
     */
    encabezado: 'Descripción comercial del producto de exportación',
    /**
     * @description Función extractora para obtener la descripción comercial del producto de exportación
     * @param {fraccionInfo} ele - Objeto con información de la fracción arancelaria
     * @returns {string} Descripción comercial específica del producto destinado a exportación
     */
    clave: (ele: FraccionInfo): string => ele.fraccionArancelaria.descripcionUsuario,
    /**
     * @description Orden de presentación de la columna en la tabla
     * @type {number}
     */
    orden: 6,
  },
  {
    /**
     * @description Encabezado para la columna de solicitud de baja de fracción
     * @type {string}
     */
    encabezado: 'Solicita baja',
    /**
     * @description Función extractora para obtener información de solicitud de baja
     * @param {fraccionInfo} ele - Objeto con información de la fracción arancelaria
     * @returns {string} Información de solicitud de baja asociada a la fracción
     */
    clave: (ele: FraccionInfo): string => ele.fraccionArancelaria.solicitaBaja,
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
export interface FraccionInfo {
  fraccionArancelaria: FraccionArancelaria;
}

export interface FraccionArancelaria {
  consecutivo: number;
  unidadMedida: string;
  testado: string;
  subPartida: string;
  partida: string;
  idProductoPadre: string;
  fechaInicioVigencia: string;
  fechaCaptura: string;
  cveUsuario: string;
  capitulo: string;
  activo: boolean;
  cveFraccion: string;
  nicoDtos: NicoInfo[];
  /**
   * @description Número secuencial o identificador único del registro de fracción en la tabla.
   * Proporciona un identificador numérico para ordenar y referenciar los registros de fracciones arancelarias.
   * @type {string}
   * @example "1"
   * @required
   */
  idFraccion: string;

  /**
   * @description Código oficial de la fracción arancelaria según la nomenclatura internacional.
   * Clasificación numérica que identifica de manera única el tipo de mercancía para efectos arancelarios.
   * @type {string}
   * @example "6205.20.01"
   * @required
   */
  clave: string;

  /**
   * @description Descripción de la mercancía de importación relacionada con esta fracción de exportación.
   * Especifica las características de la materia prima o insumo importado que se transforma en el producto de exportación.
   * @type {string}
   * @example "Telas de algodón sin confeccionar"
   * @required
   */
  fraccionPadre: string;

  /**
   * @description Unidad de Medida Técnica (UMT) aplicable a la mercancía de esta fracción.
   * Especifica la unidad oficial utilizada para cuantificar la mercancía en operaciones de comercio exterior.
   * @type {string}
   * @example "Metro cuadrado"
   * @required
   */
  umt: string;

  /**
   * @description Descripción oficial según la Tarifa de la Ley de los Impuestos Generales de Importación y Exportación (TIGIE).
   * Texto descriptivo oficial que define las características técnicas de la mercancía conforme a la clasificación arancelaria.
   * @type {string}
   * @example "Camisas de fibras sintéticas o artificiales, para hombres o niños"
   * @required
   */
  descripcion: string;

  /**
   * @description Descripción comercial específica del producto destinado a exportación.
   * Especificación comercial detallada que describe el producto final que será exportado tras su procesamiento o manufactura.
   * @type {string}
   * @example "Camisas de vestir para caballero marca Premium"
   * @required
   */
  descripcionUsuario: string;

  /**
   * @description Campo adicional para información específica de la fracción arancelaria.
   * Puede utilizarse para almacenar datos complementarios, observaciones o referencias asociadas a la fracción.
   * @type {string}
   * @example "Observaciones adicionales"
   * @optional
   */
  solicitaBaja: string;

  /**
   * @description Indicador del estado activo (true) o inactivo (false) del registro de fracción.
   * Bandera booleana que determina si la fracción está habilitada para operaciones o ha sido desactivada.
   * @type {boolean}
   * @default true
   * @example true
   * @required
   */
  estatus: boolean;
}

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
    clave: (ele: NicoInfo): string => ele.claveNico,
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
    clave: (ele: NicoInfo): string => ele.descripcion,
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
 *
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Interfaces.NICO
 */
export interface NicoInfo {
  /**
   * @description Código NICO único que identifica el tipo de commodity o materia prima.
   * Código alfanumérico estandarizado que clasifica de manera única cada tipo de commodity utilizado en comercio internacional.
   * @type {string}
   * @example "520100"
   * @required
   */
  claveNico: string;

  /**
   * @description Descripción detallada del commodity asociado al código NICO.
   * Texto descriptivo completo que especifica las características y naturaleza del commodity o materia prima.
   * @type {string}
   * @example "Algodón sin cardar ni peinar"
   * @required
   */
  descripcion: string;
}

/**
 * @interface PermisoImmexGridDatos
 * @description Interfaz que define la estructura de datos para un permiso IMMEX específico.
 * Contiene toda la información detallada de un permiso individual del programa IMMEX,
 * incluyendo identificadores, fracciones arancelarias, descripciones y períodos de vigencia.
 * Esta interfaz es fundamental para el manejo de datos de permisos en el sistema VUCEM.
 *
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Interfaces.Permiso
 */
export interface PermisoImmexGridDatos {
  /**
   * @description Número secuencial o identificador único del permiso en el sistema.
   * Proporciona un identificador numérico secuencial para facilitar la organización y referencia de permisos.
   * @type {string}
   * @example "001"
   * @required
   */
  consecutivo: number;

  idProducto: string;

  idMercanciaSub: number;

  testado: string;

  claveUsuario: string;

  /**
   * @description Número oficial del permiso IMMEX asignado por la autoridad competente.
   * Identificador único y oficial del permiso otorgado por la Secretaría de Economía bajo el programa IMMEX.
   * @type {string}
   * @example "IMX-2023-001234"
   * @required
   */
  numeroPrograma: string;

  /**
   * @description Código de fracción arancelaria aplicable al permiso.
   * Clasificación numérica oficial que identifica el tipo de mercancía autorizada bajo este permiso específico.
   * @type {string}
   * @example "6205.20.01"
   * @required
   */
  fraccion: string;

  /**
   * @description Descripción oficial de la mercancía según la TIGIE (Tarifa de Importación y Exportación).
   * Texto descriptivo oficial que especifica las características de la mercancía conforme a la clasificación arancelaria vigente.
   * @type {string}
   * @example "Camisas de fibras sintéticas o artificiales, para hombres o niños"
   * @required
   */
  descripcion: string;

  /**
   * @description Unidad de Medida Técnica (UMT) correspondiente al producto.
   * Especifica la unidad oficial utilizada para cuantificar la mercancía en las operaciones autorizadas por el permiso.
   * @type {string}
   * @example "Pieza"
   * @required
   */
  umt: string;

  /**
   * @description Cantidad autorizada para el periodo especificado en el permiso.
   * Volumen o cantidad máxima permitida bajo este permiso IMMEX durante el periodo de vigencia establecido.
   * @type {string}
   * @example "10000"
   * @required
   */
  cantidadAutorizada: string;

  /**
   * @description Fecha de inicio de vigencia del permiso IMMEX.
   * Fecha a partir de la cual el permiso es válido y puede ser utilizado para operaciones de comercio exterior.
   * @type {string}
   * @format date
   * @example "2023-01-15"
   * @required
   */
  fechaInicio: string;

  /**
   * @description Estado de activación del permiso (true: activo, false: inactivo).
   * Bandera booleana que indica si el permiso está vigente y disponible para operaciones comerciales.
   * @type {boolean}
   * @default true
   * @example true
   * @required
   */
  estatus: boolean;

  fechaFin: string;
}

/**
 * @interface NicoDato
 * @description Interfaz que define la estructura de datos para códigos NICO (Nomenclatura de Identificación de Commodities).
 * Representa la información básica de clasificación de materias primas y productos básicos
 * utilizados en operaciones de comercio exterior bajo el régimen IMMEX.
 * Esta interfaz proporciona la estructura fundamental para el manejo de datos de commodities.
 *
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Interfaces.NicoDato
 */
export interface NicoDato {
  /**
   * @description Código NICO único que identifica el tipo específico de commodity o materia prima.
   * Código alfanumérico estandarizado internacionalmente que clasifica de manera única cada tipo de commodity.
   * @type {string}
   * @example "520100"
   * @required
   */
  NICO_Columna_1: string;

  /**
   * @description Descripción detallada y oficial del commodity asociado al código NICO.
   * Texto descriptivo completo que especifica las características, naturaleza y propiedades del commodity o materia prima.
   * @type {string}
   * @example "Algodón sin cardar ni peinar"
   * @required
   */
  NICO_Columna_2: string;
}

/**
 * @interface ImmexTablaJson
 * @description Interfaz que define la estructura JSON completa para datos de tablas IMMEX.
 * Agrupa todas las categorías de información relacionadas con el programa IMMEX,
 * incluyendo permisos, fracciones arancelarias y códigos NICO en una estructura unificada.
 * Esta interfaz facilita el manejo conjunto de datos para procesos de importación y exportación,
 * proporcionando una estructura integral para el intercambio de información IMMEX.
 *
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * @module Tramites.IMMEX.Interfaces.TablaJson
 */
export interface ImmexTablaJson {
  /**
   * @description Identificador único del permiso IMMEX.
   * Código alfanumérico que clasifica de manera única cada permiso IMMEX.
   * @type {string}
   * @example "IMX-2023-001234"
   * @required
   */
  permisoImmex: string;
  /**
   * @description Array de datos de permisos IMMEX con toda la información de autorizaciones.
   * Contiene la colección completa de permisos IMMEX registrados, incluyendo números de permiso,
   * fracciones arancelarias, descripciones TIGIE, cantidades autorizadas y fechas de vigencia.
   * @type {PermisoImmexDato[]}
   * @example [{ IMMEX_Columna_1: "001", IMMEX_Columna_2: "IMX-2023-001234", ... }]
   * @required
   */
  permisoImmexGridDatos: PermisoImmexGridDatos[];

  /**
   * @description Array de datos de fracciones arancelarias para clasificación de mercancías.
   * Colección de fracciones arancelarias utilizadas en procesos de exportación, incluyendo códigos,
   * descripciones de mercancías de importación, unidades de medida y descripciones comerciales.
   * @type {FraccionDato[]}
   * @example [{ FRACCION_Columna_1: "001", FRACCION_Columna_2: "6205.20.01", ... }]
   * @required
   */
  fraccionGridDatos: FraccionInfo[];
}

/**
 * @description Payload utilizado para buscar solicitudes en el sistema.
 * Contiene información relevante como el tipo de solicitud, el identificador del proyecto y el RFC del solicitante.
 *
 * @interface
 * @property {string} tipoSolicitud - Tipo de la solicitud que se está buscando.
 * @property {string} idProyecto - Identificador único del proyecto relacionado con la solicitud.
 * @property {string} rfcSolicitante - RFC del solicitante que realiza la búsqueda.
 *
 * @author
 * @since
 */
export interface BuscarPayload {
    tipoSolicitud: string;
    idProyecto: string;
    rfcSolicitante: string;
}

/**
 * @interface FraccionArancelariaPayload
 */
export interface FraccionArancelariaPayload {
  fraccion: string;
  descFraccion: string;
  idProductoPadre: string;
  fraccionPadre: string;
}