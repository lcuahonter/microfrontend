/**
 * @fileoverview Definiciones de tipos e interfaces para el manejo de información SCIAN y mercancías
 * @author Sistema de Gestión Comercial
 * @version 1.0.0
 */

/**
 * Interfaz que define la estructura de información del Sistema de Clasificación Industrial de América del Norte (SCIAN)
 * @interface NicoInfo
 */
export interface NicoInfo {
  /** 
   * Código de clasificación SCIAN único que identifica la actividad económica
   * @type {string}
   * @example "111110"
   */
  clave_Scian: string;
  
  /** 
   * Descripción detallada de la actividad económica correspondiente al código SCIAN
   * @type {string}
   * @example "Cultivo de trigo"
   */
  descripcion_Scian: string;
}

/**
 * Interfaz que define la estructura de respuesta para consultas de tabla SCIAN
 * @interface RespuestaTabla
 */
export interface RespuestaTabla {
  /** 
   * Código de estado HTTP de la respuesta
   * @type {number}
   * @example 200
   */
  code: number;
  
  /** 
   * Array de objetos NicoInfo conteniendo los datos de clasificación SCIAN
   * @type {NicoInfo[]}
   */
  data: NicoInfo[];
  
  /** 
   * Mensaje descriptivo del resultado de la operación
   * @type {string}
   * @example "Consulta exitosa"
   */
  message: string;
}

/**
 * Configuración de columnas para la tabla de información SCIAN
 * Define el encabezado, función de acceso y orden de cada columna
 * @constant {Array<Object>} NICO_TABLA
 */
export const NICO_TABLA = [
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Clave S.C.I.A.N.',
    
    /** 
     * Función que extrae el valor de la clave SCIAN de un objeto NicoInfo
     * @param {NicoInfo} ele - Objeto con información SCIAN
     * @returns {string} Código de clasificación SCIAN
     */
    clave: (ele: NicoInfo): string => ele.clave_Scian,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 1,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Descripción del S.C.I.A.N.',
    
    /** 
     * Función que extrae la descripción SCIAN de un objeto NicoInfo
     * @param {NicoInfo} ele - Objeto con información SCIAN
     * @returns {string} Descripción de la actividad económica
     */
    clave: (ele: NicoInfo): string => ele.descripcion_Scian,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 2,
  },
];

/**
 * Interfaz que define la estructura de respuesta para consultas de tabla de mercancías
 * @interface MercanciasTabla
 */
export interface MercanciasTabla {
  /** 
   * Código de estado HTTP de la respuesta
   * @type {number}
   * @example 200
   */
  code: number;
  
  /** 
   * Array de objetos MercanciasInfo conteniendo los datos de mercancías
   * @type {MercanciasInfo[]}
   */
  data: MercanciasInfo[];
  
  /** 
   * Mensaje descriptivo del resultado de la operación
   * @type {string}
   * @example "Datos obtenidos correctamente"
   */
  message: string;
}

/**
 * Interfaz que define la estructura completa de información de mercancías para comercio exterior
 * Contiene todos los campos necesarios para la clasificación y descripción de productos
 * @interface MercanciasInfo
 */
export interface MercanciasInfo {
  /** 
   * Tipo de clasificación del producto (ej: Medicamento, Alimento, etc.)
   * @type {string}
   * @example "Medicamento"
   */
  clasificacion: string;
  
  /** 
   * Especificación adicional de la clasificación del producto
   * @type {string}
   * @example "Antibiótico"
   */
  especificar: string;
  
  /** 
   * Nombre específico y técnico del producto
   * @type {string}
   * @example "Amoxicilina 500mg"
   */
  denominacionEspecifica: string;
  
  /** 
   * Marca comercial o nombre distintivo del producto
   * @type {string}
   * @example "Amoxil"
   */
  denominacionDistintiva: string;
  
  /** 
   * Nombre común, genérico o científico del producto
   * @type {string}
   * @example "Amoxicilina"
   */
  denominacionComun: string;
  
  /** 
   * Presentación farmacéutica del producto (solo aplica para medicamentos)
   * @type {string}
   * @example "Cápsulas"
   */
  formaFarmaceutica: string;
  
  /** 
   * Estado físico en que se presenta el producto
   * @type {string}
   * @example "Sólido"
   */
  estadoFisico: string;
  
  /** 
   * Código de fracción arancelaria para clasificación aduanera
   * @type {string}
   * @example "3004.10.01"
   */
  fraccionArancelaria: string;
  
  /** 
   * Descripción detallada de la fracción arancelaria
   * @type {string}
   * @example "Antibióticos para uso humano"
   */
  descripcionFraccion: string;
  
  /** 
   * Unidad de medida utilizada para la comercialización del producto
   * @type {string}
   * @example "Caja"
   */
  unidad: string;
  
  /** 
   * Cantidad en la unidad de medida de comercialización
   * @type {string}
   * @example "100"
   */
  cantidadUMC: string;
  
  /** 
   * Unidad de medida de tarifa para cálculos arancelarios
   * @type {string}
   * @example "Kilogramo"
   */
  unidadUMT: string;
  
  /** 
   * Cantidad en la unidad de medida de tarifa
   * @type {string}
   * @example "0.5"
   */
  cantidadUMT: string;
  
  /** 
   * Descripción de cómo se presenta el producto al consumidor
   * @type {string}
   * @example "Caja con 20 cápsulas"
   */
  presentacion: string;
  
  /** 
   * Número de registro sanitario otorgado por la autoridad competente
   * @type {string}
   * @example "123456 SSA IV"
   */
  numeroRegistro: string;
  
  /** 
   * País donde se fabricó originalmente el producto
   * @type {string}
   * @example "México"
   */
  paisDeOrigen: string;
  
  /** 
   * País desde donde se importa directamente el producto
   * @type {string}
   * @example "Estados Unidos"
   */
  paisDeProcedencia: string;
  
  /** 
   * Categoría o tipo general del producto
   * @type {string}
   * @example "Farmacéutico"
   */
  tipoProducto: string;
  
  /** 
   * Uso o aplicación específica del producto
   * @type {string}
   * @example "Tratamiento de infecciones bacterianas"
   */
  usoEspecifico: string;

  /** 
   * Fecha de caducidad del producto
   * @type {string}
   * @example "2025-12-31"
   */
  fechaCaducidad: string;
}


/**
 * Configuración de columnas para la tabla de información de mercancías
 * Define el encabezado, función de acceso y orden de cada columna para la visualización
 * @constant {Array<Object>} MERCANCIAS_DATA
 */
export const MERCANCIAS_DATA = [
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Clasificación del producto',
    
    /** 
     * Función que extrae la clasificación del producto de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Tipo de clasificación del producto
     */
    clave: (ele: MercanciasInfo): string => ele.clasificacion,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 1,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Especificar clasificación del producto',
    
    /** 
     * Función que extrae la especificación de clasificación de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Especificación adicional de la clasificación
     */
    clave: (ele: MercanciasInfo): string => ele.especificar,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 2,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Denominación específica del producto',
    
    /** 
     * Función que extrae la denominación específica de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Nombre específico y técnico del producto
     */
    clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 3,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Denominación distintiva',
    
    /** 
     * Función que extrae la denominación distintiva de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Marca comercial o nombre distintivo del producto
     */
    clave: (ele: MercanciasInfo): string => ele.denominacionDistintiva,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 4,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Denominación común, nombre común o nombre científico',
    
    /** 
     * Función que extrae la denominación común de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Nombre común, genérico o científico del producto
     */
    clave: (ele: MercanciasInfo): string => ele.denominacionComun,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 5,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Forma farmacéutica',
    
    /** 
     * Función que extrae la forma farmacéutica de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Presentación farmacéutica del producto
     */
    clave: (ele: MercanciasInfo): string => ele.formaFarmaceutica,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 6,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Estado físico',
    
    /** 
     * Función que extrae el estado físico de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Estado físico en que se presenta el producto
     */
    clave: (ele: MercanciasInfo): string => ele.estadoFisico,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 7,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Fracción arancelaria',
    
    /** 
     * Función que extrae la fracción arancelaria de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Código de fracción arancelaria para clasificación aduanera
     */
    clave: (ele: MercanciasInfo): string => ele.fraccionArancelaria,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 8,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Descripción de la fracción',
    
    /** 
     * Función que extrae la descripción de la fracción arancelaria de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Descripción detallada de la fracción arancelaria
     */
    clave: (ele: MercanciasInfo): string => ele.descripcionFraccion,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 9,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Unidad de medida de comercialización (UMC)',
    
    /** 
     * Función que extrae la unidad de medida de comercialización de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Unidad de medida utilizada para la comercialización
     */
    clave: (ele: MercanciasInfo): string => ele.unidad,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 10,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Cantidad UMC',
    
    /** 
     * Función que extrae la cantidad en UMC de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Cantidad en la unidad de medida de comercialización
     */
    clave: (ele: MercanciasInfo): string => ele.cantidadUMC,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 11,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Unidad de medida de tarifa (UMT)',
    
    /** 
     * Función que extrae la unidad de medida de tarifa de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Unidad de medida de tarifa para cálculos arancelarios
     */
    clave: (ele: MercanciasInfo): string => ele.unidadUMT,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 12,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Cantidad UMT',
    
    /** 
     * Función que extrae la cantidad en UMT de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Cantidad en la unidad de medida de tarifa
     */
    clave: (ele: MercanciasInfo): string => ele.cantidadUMT,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 13,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Presentación',
    
    /** 
     * Función que extrae la presentación del producto de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Descripción de cómo se presenta el producto al consumidor
     */
    clave: (ele: MercanciasInfo): string => ele.presentacion,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 14,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Número de registro sanitario',
    
    /** 
     * Función que extrae el número de registro sanitario de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Número de registro sanitario otorgado por la autoridad competente
     */
    clave: (ele: MercanciasInfo): string => ele.numeroRegistro,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 15,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'País de orígen',
    
    /** 
     * Función que extrae el país de origen de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} País donde se fabricó originalmente el producto
     */
    clave: (ele: MercanciasInfo): string => ele.paisDeOrigen,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 16,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'País de procedencia',
    
    /** 
     * Función que extrae el país de procedencia de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} País desde donde se importa directamente el producto
     */
    clave: (ele: MercanciasInfo): string => ele.paisDeProcedencia,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 17,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Tipo producto',
    
    /** 
     * Función que extrae el tipo de producto de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Categoría o tipo general del producto
     */
    clave: (ele: MercanciasInfo): string => ele.tipoProducto,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 18,
  },
  {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Uso específico',
    
    /** 
     * Función que extrae el uso específico de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Uso o aplicación específica del producto
     */
    clave: (ele: MercanciasInfo): string => ele.usoEspecifico,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 19,
  },
   {
    /** 
     * Texto del encabezado de la columna para mostrar en la interfaz
     * @type {string}
     */
    encabezado: 'Fecha de caducidad',
    
    /** 
     * Función que extrae la fecha de caducidad de un objeto MercanciasInfo
     * @param {MercanciasInfo} ele - Objeto con información de mercancía
     * @returns {string} Fecha de caducidad del producto
     */
    clave: (ele: MercanciasInfo): string => ele.fechaCaducidad,
    
    /** 
     * Número que define el orden de aparición de la columna en la tabla
     * @type {number}
     */
    orden: 20,
  },
];