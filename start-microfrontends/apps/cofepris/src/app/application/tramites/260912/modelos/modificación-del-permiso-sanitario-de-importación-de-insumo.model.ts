/**
 * Interfaz que define la estructura de información de clasificación SCIAN (Sistema de Clasificación Industrial de América del Norte)
 * @interface NicoInfo
 */
export interface NicoInfo {
  /** Código de clasificación SCIAN */
  clave_Scian: string;
  /** Descripción detallada de la clasificación SCIAN */
  descripcion_Scian: string;
}

/**
 * Interfaz que define la estructura de respuesta para consultas de tabla SCIAN
 * @interface RespuestaTabla
 */
export interface RespuestaTabla {
  /** Código de estado de la respuesta HTTP */
  code: number;
  /** Array de información SCIAN */
  data: NicoInfo[];
  /** Mensaje descriptivo de la respuesta */
  message: string;
}

/**
 * Configuración de columnas para la tabla de clasificación SCIAN
 * Define la estructura y orden de visualización de los datos SCIAN
 * @constant {Array<Object>} NICO_TABLA
 */
export const NICO_TABLA = [
  {
    /** Título del encabezado de la columna */
    encabezado: 'Clave S.C.I.A.N.',
    /** Función que extrae la clave SCIAN del elemento */
    clave: (ele: NicoInfo): string => ele.clave_Scian,
    /** Orden de visualización de la columna */
    orden: 1,
  },
  {
    /** Título del encabezado de la columna */
    encabezado: 'Descripción del S.C.I.A.N.',
    /** Función que extrae la descripción SCIAN del elemento */
    clave: (ele: NicoInfo): string => ele.descripcion_Scian,
    /** Orden de visualización de la columna */
    orden: 2,
  },
];

/**
 * Interfaz que define la estructura de respuesta para consultas de mercancías
 * @interface MercanciasTabla
 */
export interface MercanciasTabla {
  /** Código de estado de la respuesta HTTP */
  code: number;
  /** Array de información de mercancías */
  data: MercanciasInfo[];
  /** Mensaje descriptivo de la respuesta */
  message: string;
}

/**
 * Interfaz que define la información completa de mercancías para procesos aduaneros
 * Contiene todos los campos necesarios para la clasificación y registro de productos
 * @interface MercanciasInfo
 */
export interface MercanciasInfo {
  /** Clasificación general del producto según normativas aduaneras */
  clasificacion: string;
  /** Especificación adicional de la clasificación del producto */
  especificar: string;
  /** Denominación específica técnica del producto */
  denominacionEspecifica: string;
  /** Denominación distintiva o marca comercial del producto */
  denominacionDistintiva: string;
  /** Denominación común, nombre común o nombre científico del producto */
  denominacionComun: string;
  /** Forma farmacéutica del producto (aplicable a medicamentos) */
  formaFarmaceutica: string;
  /** Estado físico del producto (sólido, líquido, gaseoso, etc.) */
  estadoFisico: string;
  /** Código de fracción arancelaria para clasificación aduanera */
  fraccionArancelaria: string;
  /** Descripción detallada de la fracción arancelaria */
  descripcionFraccion: string;
  /** Unidad de medida de comercialización (UMC) */
  unidad: string;
  /** Cantidad expresada en unidades de medida de comercialización */
  cantidadUMC: string;
  /** Unidad de medida de tarifa (UMT) para cálculos arancelarios */
  unidadUMT: string;
  /** Cantidad expresada en unidades de medida de tarifa */
  cantidadUMT: string;
  /** Forma de presentación del producto en el mercado */
  presentacion: string;
  /** Número de registro sanitario del producto (cuando aplique) */
  numeroRegistro: string;
  /** País de origen donde se produce o manufactura el producto */
  paisDeOrigen: string;
  /** País de procedencia desde donde se exporta el producto */
  paisDeProcedencia: string;
  /** Tipo o categoría específica del producto */
  tipoProducto: string;
  /** Uso específico o aplicación destinada del producto */
  usoEspecifico: string;
    /** 
   * Fecha de caducidad del producto
   * @type {string}
   * @example "2025-12-31"
   */
  fechaCaducidad: string;
}

/**
 * Configuración de columnas para la tabla de mercancías
 * Define la estructura completa de visualización de datos de mercancías con todos sus campos
 * Incluye encabezados descriptivos, funciones de extracción de datos y orden de visualización
 * @constant {Array<Object>} MERCANCIAS_DATA
 */
export const MERCANCIAS_DATA = [
  {
    /** Título del encabezado para la clasificación del producto */
    encabezado: 'Clasificación del producto',
    /** Función que extrae la clasificación del elemento */
    clave: (ele: MercanciasInfo): string => ele.clasificacion,
    /** Orden de visualización de la columna */
    orden: 1,
  },
  {
    /** Título del encabezado para especificar la clasificación */
    encabezado: 'Especificar clasificación del producto',
    /** Función que extrae la especificación de clasificación del elemento */
    clave: (ele: MercanciasInfo): string => ele.especificar,
    /** Orden de visualización de la columna */
    orden: 2,
  },
  {
    /** Título del encabezado para la denominación específica */
    encabezado: 'Denominación específica del producto',
    /** Función que extrae la denominación específica del elemento */
    clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
    /** Orden de visualización de la columna */
    orden: 3,
  },
  {
    /** Título del encabezado para la denominación distintiva */
    encabezado: 'Denominación distintiva',
    /** Función que extrae la denominación distintiva del elemento */
    clave: (ele: MercanciasInfo): string => ele.denominacionDistintiva,
    /** Orden de visualización de la columna */
    orden: 4,
  },
  {
    /** Título del encabezado para la denominación común */
    encabezado: 'Denominación común, nombre común o nombre científico',
    /** Función que extrae la denominación común del elemento */
    clave: (ele: MercanciasInfo): string => ele.denominacionComun,
    /** Orden de visualización de la columna */
    orden: 5,
  },
  {
    /** Título del encabezado para la forma farmacéutica */
    encabezado: 'Forma farmacéutica',
    /** Función que extrae la forma farmacéutica del elemento */
    clave: (ele: MercanciasInfo): string => ele.formaFarmaceutica,
    /** Orden de visualización de la columna */
    orden: 6,
  },
  {
    /** Título del encabezado para el estado físico */
    encabezado: 'Estado físico',
    /** Función que extrae el estado físico del elemento */
    clave: (ele: MercanciasInfo): string => ele.estadoFisico,
    /** Orden de visualización de la columna */
    orden: 7,
  },
  {
    /** Título del encabezado para la fracción arancelaria */
    encabezado: 'Fracción arancelaria',
    /** Función que extrae la fracción arancelaria del elemento */
    clave: (ele: MercanciasInfo): string => ele.fraccionArancelaria,
    /** Orden de visualización de la columna */
    orden: 8,
  },
  {
    /** Título del encabezado para la descripción de fracción */
    encabezado: 'Descripción de la fracción',
    /** Función que extrae la descripción de fracción del elemento */
    clave: (ele: MercanciasInfo): string => ele.descripcionFraccion,
    /** Orden de visualización de la columna */
    orden: 9,
  },
  {
    /** Título del encabezado para la unidad de medida de comercialización */
    encabezado: 'Unidad de medida de comercialización (UMC)',
    /** Función que extrae la unidad de medida del elemento */
    clave: (ele: MercanciasInfo): string => ele.unidad,
    /** Orden de visualización de la columna */
    orden: 10,
  },
  {
    /** Título del encabezado para la cantidad UMC */
    encabezado: 'Cantidad UMC',
    /** Función que extrae la cantidad UMC del elemento */
    clave: (ele: MercanciasInfo): string => ele.cantidadUMC,
    /** Orden de visualización de la columna */
    orden: 11,
  },
  {
    /** Título del encabezado para la unidad de medida de tarifa */
    encabezado: 'Unidad de medida de tarifa (UMT)',
    /** Función que extrae la unidad de medida de tarifa del elemento */
    clave: (ele: MercanciasInfo): string => ele.unidadUMT,
    /** Orden de visualización de la columna */
    orden: 12,
  },
  {
    /** Título del encabezado para la cantidad UMT */
    encabezado: 'Cantidad UMT',
    /** Función que extrae la cantidad UMT del elemento */
    clave: (ele: MercanciasInfo): string => ele.cantidadUMT,
    /** Orden de visualización de la columna */
    orden: 13,
  },
  {
    /** Título del encabezado para la presentación del producto */
    encabezado: 'Presentación',
    /** Función que extrae la presentación del elemento */
    clave: (ele: MercanciasInfo): string => ele.presentacion,
    /** Orden de visualización de la columna */
    orden: 14,
  },
  {
    /** Título del encabezado para el número de registro sanitario */
    encabezado: 'Número de registro sanitario',
    /** Función que extrae el número de registro del elemento */
    clave: (ele: MercanciasInfo): string => ele.numeroRegistro,
    /** Orden de visualización de la columna */
    orden: 15,
  },
  {
    /** Título del encabezado para el país de origen */
    encabezado: 'País de orígen',
    /** Función que extrae el país de origen del elemento */
    clave: (ele: MercanciasInfo): string => ele.paisDeOrigen,
    /** Orden de visualización de la columna */
    orden: 16,
  },
  {
    /** Título del encabezado para el país de procedencia */
    encabezado: 'País de procedencia',
    /** Función que extrae el país de procedencia del elemento */
    clave: (ele: MercanciasInfo): string => ele.paisDeProcedencia,
    /** Orden de visualización de la columna */
    orden: 17,
  },
  {
    /** Título del encabezado para el tipo de producto */
    encabezado: 'Tipo producto',
    /** Función que extrae el tipo de producto del elemento */
    clave: (ele: MercanciasInfo): string => ele.tipoProducto,
    /** Orden de visualización de la columna */
    orden: 18,
  },
  {
    /** Título del encabezado para el uso específico */
    encabezado: 'Uso específico',
    /** Función que extrae el uso específico del elemento */
    clave: (ele: MercanciasInfo): string => ele.usoEspecifico,
    /** Orden de visualización de la columna */
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
  }
];

/**
 * Constante que define los permisos para el proceso de maquila.
 * Cada objeto representa una etapa del proceso.
 */
export const PERMISO_MAQUILA = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: false,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];