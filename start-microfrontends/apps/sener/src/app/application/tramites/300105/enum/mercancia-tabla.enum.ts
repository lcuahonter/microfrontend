/**
 * @interface SerieConfiguracionItem
 * @description Interfaz que representa la configuración de un elemento de serie
 * para equipos de rayos X en el trámite 300105. Define la estructura mínima
 * requerida para elementos que contienen información de número de serie.
 * 
 * Esta interfaz se utiliza en tablas y formularios que muestran o gestionan
 * números de serie de equipos de rayos X de forma individual o en lotes.
 * 
 * @example
 * ```typescript
 * const serie: SerieConfiguracionItem = {
 *   serie: 'RX-2024-001-ABC123'
 * };
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export interface SerieConfiguracionItem {
  /**
   * @property {string} serie - Número de serie del elemento
   * @description Identificador único del equipo de rayos X, típicamente
   * asignado por el fabricante. Es fundamental para el rastreo y
   * autorización individual de cada equipo.
   * 
   * @example
   * ```typescript
   * serie: 'XR-2024-12345'
   * serie: 'SIEMENS-RX-ABC123'
   * serie: 'PHILIPS-CT-789XYZ'
   * ```
   */
  serie: string;
}

/**
 * @interface ConfiguracionItem
 * @description Interfaz que representa la configuración completa de un elemento de mercancía
 * (equipo de rayos X) en el trámite 300105. Define todos los campos técnicos y administrativos
 * necesarios para identificar, clasificar y autorizar equipos de rayos X.
 * 
 * Esta interfaz abarca información técnica del equipo (marca, modelo, especificaciones eléctricas),
 * información administrativa (número de serie, cantidad) e información arancelaria
 * (fracción arancelaria y su descripción).
 * 
 * @example
 * ```typescript
 * const equipo: ConfiguracionItem = {
 *   id: 1,
 *   marca: 'SIEMENS',
 *   modelo: 'AXIOM Aristos VX',
 *   serie: 'SIE-2024-RX-001',
 *   voltaje: '150',
 *   unidadMedidaVoltaje: 'kV',
 *   corriente: '500',
 *   unidadMedidaCorriente: 'mA',
 *   numEquipos: '1',
 *   fraccionArancelaria: '9022.12.01',
 *   fraccionDescripcion: 'Aparatos de rayos X para uso médico'
 * };
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export interface ConfiguracionItem {
  /**
   * @property {number} id - Identificador único del elemento
   * @description Identificador numérico único que se asigna automáticamente
   * a cada equipo en el sistema. Es fundamental para operaciones CRUD
   * y referencia cruzada entre diferentes secciones del trámite.
   * 
   * @example
   * ```typescript
   * id: 12345
   * ```
   */
  id: number;

  /**
   * @property {string} marca - Marca del equipo
   * @description Nombre del fabricante o marca comercial del equipo de rayos X.
   * Es un campo requerido para la identificación del equipo y validación
   * de especificaciones técnicas.
   * 
   * @example
   * ```typescript
   * marca: 'SIEMENS'
   * marca: 'PHILIPS'
   * marca: 'GE Healthcare'
   * ```
   */
  marca: string;

  /**
   * @property {string} modelo - Modelo del equipo
   * @description Designación específica del modelo del equipo asignada por el fabricante.
   * Junto con la marca, permite identificar las especificaciones técnicas exactas del equipo.
   * 
   * @example
   * ```typescript
   * modelo: 'AXIOM Aristos VX'
   * modelo: 'DigitalDiagnost C90'
   * modelo: 'Revolution CT'
   * ```
   */
  modelo: string;

  /**
   * @property {string} serie - Número de serie del equipo
   * @description Identificador único individual del equipo asignado por el fabricante.
   * Es crítico para el rastreo, autorización y control de cada equipo específico.
   * 
   * @example
   * ```typescript
   * serie: 'XR-2024-12345-ABC'
   * serie: 'SIEMENS-789XYZ'
   * ```
   */
  serie: string;

  /**
   * @property {string} voltaje - Voltaje máximo del tubo de rayos X
   * @description Especificación técnica del voltaje máximo que puede aplicar
   * el equipo al tubo de rayos X. Es un parámetro crítico para determinar
   * la capacidad y aplicaciones del equipo.
   * 
   * @example
   * ```typescript
   * voltaje: '150'  // 150 kV
   * voltaje: '120'  // 120 kV
   * ```
   */
  voltaje: string;

  /**
   * @property {string} unidadMedidaVoltaje - Unidad de medida del voltaje
   * @description Unidad de medida para el voltaje especificado, típicamente
   * kilovoltios (kV). Se selecciona de un catálogo predefinido para
   * mantener consistencia en las especificaciones.
   * 
   * @example
   * ```typescript
   * unidadMedidaVoltaje: 'kV'
   * unidadMedidaVoltaje: 'V'
   * ```
   */
  unidadMedidaVoltaje: string;

  /**
   * @property {string} corriente - Corriente máxima del tubo de rayos X
   * @description Especificación técnica de la corriente máxima que puede
   * suministrar el equipo al tubo de rayos X. Determina la intensidad
   * de radiación que puede generar el equipo.
   * 
   * @example
   * ```typescript
   * corriente: '500'  // 500 mA
   * corriente: '1000' // 1000 mA
   * ```
   */
  corriente: string;

  /**
   * @property {string} unidadMedidaCorriente - Unidad de medida de la corriente
   * @description Unidad de medida para la corriente especificada, típicamente
   * miliamperios (mA). Se selecciona de un catálogo predefinido para
   * mantener consistencia en las especificaciones técnicas.
   * 
   * @example
   * ```typescript
   * unidadMedidaCorriente: 'mA'
   * unidadMedidaCorriente: 'A'
   * ```
   */
  unidadMedidaCorriente: string;

  /**
   * @property {string} numEquipos - Número de equipos
   * @description Cantidad de equipos idénticos incluidos en esta entrada
   * de autorización. Permite gestionar múltiples unidades del mismo
   * modelo en una sola solicitud.
   * 
   * @example
   * ```typescript
   * numEquipos: '1'   // Un equipo
   * numEquipos: '5'   // Cinco equipos idénticos
   * ```
   */
  numEquipos: string;

  /**
   * @property {string} fraccionArancelaria - Fracción arancelaria asociada al equipo
   * @description Código de clasificación arancelaria que corresponde al tipo
   * de equipo de rayos X según el sistema arancelario mexicano. Es fundamental
   * para el procesamiento aduanero y cálculo de impuestos.
   * 
   * @example
   * ```typescript
   * fraccionArancelaria: '9022.12.01'  // Aparatos de rayos X para uso médico
   * fraccionArancelaria: '9022.19.99'  // Otros aparatos de rayos X
   * ```
   */
  fraccionArancelaria: string;

  /**
   * @property {string} fraccionDescripcion - Descripción de la fracción arancelaria
   * @description Descripción textual detallada de la fracción arancelaria
   * seleccionada, que explica el tipo de mercancía que cubre dicha fracción.
   * Se obtiene automáticamente del catálogo al seleccionar la fracción.
   * 
   * @example
   * ```typescript
   * fraccionDescripcion: 'Aparatos de rayos X para uso médico, quirúrgico, odontológico o veterinario'
   * fraccionDescripcion: 'Los demás aparatos de rayos X'
   * ```
   */
  fraccionDescripcion: string;
}

/**
 * @constant SERIE_TABLA_CONFIGURACION
 * @description Configuración predefinida de la tabla para mostrar elementos de serie
 * de equipos de rayos X en el trámite 300105. Define la estructura de una columna
 * simple que muestra el número de serie de los equipos.
 * 
 * Esta configuración se utiliza en interfaces donde se necesita mostrar únicamente
 * los números de serie de los equipos, típicamente en procesos de selección
 * o verificación de series específicas.
 * 
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 * 
 * @example
 * ```typescript
 * // Uso en un componente de tabla de series
 * export class SerieTablaComponent {
 *   configuracion = SERIE_TABLA_CONFIGURACION;
 *   series: SerieConfiguracionItem[] = [
 *     { serie: 'XR-2024-001' },
 *     { serie: 'XR-2024-002' }
 *   ];
 * }
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @readonly
 */
export const SERIE_TABLA_CONFIGURACION = [
  {
    /**
     * @property {string} encabezado - Título de la columna en la tabla
     * @description Texto que se muestra como encabezado de la columna
     * que contiene los números de serie de los equipos.
     */
    encabezado: 'Serie',

    /**
     * @property {Function} clave - Función que devuelve el valor de la clave para un elemento de serie
     * @description Función extractora que toma un objeto SerieConfiguracionItem
     * y retorna el número de serie que se debe mostrar en la tabla.
     * 
     * @param {SerieConfiguracionItem} item - Elemento de serie del cual extraer el valor
     * @returns {string} El número de serie del elemento
     */
    clave: (item: SerieConfiguracionItem): string => item.serie,

    /**
     * @property {number} orden - Orden de la columna en la tabla
     * @description Número que define la posición de esta columna en la tabla.
     * Como es la única columna, tiene orden 1.
     */
    orden: 1,
  },
];

/**
 * @constant TABLA_CONFIGURACION
 * @description Configuración completa de la tabla para mostrar elementos de mercancía (equipos de rayos X)
 * en el trámite 300105. Define todas las columnas necesarias para mostrar la información técnica
 * y administrativa completa de los equipos de rayos X que requieren autorización.
 * 
 * Esta configuración establece 10 columnas que cubren:
 * - Información básica: marca, modelo, número de serie
 * - Especificaciones técnicas: voltaje, corriente y sus unidades de medida
 * - Información cuantitativa: número de equipos
 * - Información arancelaria: fracción arancelaria y su descripción
 * 
 * Cada columna tiene su función extractora que obtiene el valor específico
 * del objeto ConfiguracionItem correspondiente.
 * 
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 * 
 * @example
 * ```typescript
 * // Uso en un componente de tabla completa
 * export class MercanciaTablaComponent {
 *   configuracion = TABLA_CONFIGURACION;
 *   equipos: ConfiguracionItem[] = [
 *     {
 *       id: 1,
 *       marca: 'SIEMENS',
 *       modelo: 'AXIOM',
 *       serie: 'XR-001',
 *       voltaje: '150',
 *       unidadMedidaVoltaje: 'kV',
 *       corriente: '500',
 *       unidadMedidaCorriente: 'mA',
 *       numEquipos: '1',
 *       fraccionArancelaria: '9022.12.01',
 *       fraccionDescripcion: 'Aparatos de rayos X para uso médico'
 *     }
 *   ];
 * }
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @readonly
 */
export const TABLA_CONFIGURACION = [
  {
    /**
     * @description Configuración de la columna para mostrar la marca del equipo.
     * Primera columna que identifica el fabricante del equipo de rayos X.
     */
    encabezado: 'Marca',
    clave: (item: ConfiguracionItem): string => item.marca,
    orden: 1,
  },
  {
    /**
     * @description Configuración de la columna para mostrar el modelo del equipo.
     * Segunda columna que especifica el modelo exacto del equipo.
     */
    encabezado: 'Modelo',
    clave: (item: ConfiguracionItem): string => item.modelo,
    orden: 2,
  },
  {
    /**
     * @description Configuración de la columna para mostrar el número de serie.
     * Tercera columna que muestra el identificador único del equipo.
     */
    encabezado: 'Número de serie',
    clave: (item: ConfiguracionItem): string => item.serie,
    orden: 3,
  },
  {
    /**
     * @description Configuración de la columna para mostrar el voltaje máximo del tubo de rayos X.
     * Cuarta columna que especifica la capacidad de voltaje del equipo.
     */
    encabezado: 'Voltaje máximo del tubo de R-X',
    clave: (item: ConfiguracionItem): string => item.voltaje,
    orden: 4,
  },
  {
    /**
     * @description Configuración de la columna para mostrar la unidad de medida del voltaje.
     * Quinta columna que especifica las unidades del voltaje (típicamente kV).
     */
    encabezado: 'Unidad de voltaje',
    clave: (item: ConfiguracionItem): string => item.unidadMedidaVoltaje,
    orden: 5,
  },
  {
    /**
     * @description Configuración de la columna para mostrar la corriente máxima del tubo de rayos X.
     * Sexta columna que especifica la capacidad de corriente del equipo.
     */
    encabezado: 'Corriente máxima del tubo de R-X',
    clave: (item: ConfiguracionItem): string => item.corriente,
    orden: 6,
  },
  {
    /**
     * @description Configuración de la columna para mostrar la unidad de medida de la corriente.
     * Séptima columna que especifica las unidades de la corriente (típicamente mA).
     */
    encabezado: 'Unidad de corriente',
    clave: (item: ConfiguracionItem): string => item.unidadMedidaCorriente,
    orden: 7,
  },
  {
    /**
     * @description Configuración de la columna para mostrar el número de equipos.
     * Octava columna que indica la cantidad de equipos idénticos en la solicitud.
     */
    encabezado: 'Número de equipos',
    clave: (item: ConfiguracionItem): string => item.numEquipos,
    orden: 8,
  },
  {
    /**
     * @description Configuración de la columna para mostrar la fracción arancelaria.
     * Novena columna que muestra el código de clasificación arancelaria del equipo.
     */
    encabezado: 'Fracción arancelaria',
    clave: (item: ConfiguracionItem): string => item.fraccionArancelaria,
    orden: 9,
  },
  {
    /**
     * @description Configuración de la columna para mostrar la descripción de la fracción arancelaria.
     * Décima columna que explica la clasificación arancelaria del equipo.
     */
    encabezado: 'Descripción de la fracción arancelaria',
    clave: (item: ConfiguracionItem): string => item.fraccionDescripcion,
    orden: 10,
  },
];