export interface NicoInfo {
  clave_Scian: string;
  descripcion_Scian: string;
}

export interface RespuestaTabla {
  code: number;
  data: NicoInfo[];
  message: string;
}

export const NICO_TABLA = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (ele: NicoInfo): string => ele.clave_Scian,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (ele: NicoInfo): string => ele.descripcion_Scian,
    orden: 2,
  },
];

export interface MercanciasTabla {
  code: number;
  data: MercanciasInfo[];
  message: string;
}

export interface MercanciasInfo {
  clasificacion: string;
  especificar: string;
  denominacionEspecifica: string;
  denominacionDistintiva: string;
  denominacionComun: string;
  formaFarmaceutica: string;
  estadoFisico: string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  unidad: string;
  cantidadUMC: string;
  unidadUMT: string;
  cantidadUMT: string;
  presentacion: string;
  numeroRegistro: string;
  paisDeOrigen: string;
  paisDeProcedencia: string;
  tipoProducto: string;
  usoEspecifico: string;
   /** 
   * Fecha de caducidad del producto
   * @type {string}
   * @example "2025-12-31"
   */
  fechaCaducidad: string;
}

export const MERCANCIAS_DATA = [
  {
    encabezado: 'Clasificación del producto',
    clave: (ele: MercanciasInfo): string => ele.clasificacion,
    orden: 1,
  },
  {
    encabezado: 'Especificar clasificación del producto',
    clave: (ele: MercanciasInfo): string => ele.especificar,
    orden: 2,
  },
  {
    encabezado: 'Denominación específica del producto',
    clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
    orden: 3,
  },
  {
    encabezado: 'Denominación distintiva',
    clave: (ele: MercanciasInfo):string => ele.denominacionDistintiva,
    orden: 4,
  },
  {
    encabezado: 'Denominación común, nombre común o nombre científico',
    clave: (ele: MercanciasInfo): string => ele.denominacionComun,
    orden: 5,
  },
  {
    encabezado: 'Forma farmacéutica',
    clave: (ele: MercanciasInfo): string => ele.formaFarmaceutica,
    orden: 6,
  },
  {
    encabezado: 'Estado físico',
    clave: (ele: MercanciasInfo): string => ele.estadoFisico,
    orden: 7,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: MercanciasInfo): string => ele.fraccionArancelaria,
    orden: 8,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: MercanciasInfo): string => ele.descripcionFraccion,
    orden: 9,
  },
  {
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (ele: MercanciasInfo): string => ele.unidad,
    orden: 10,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (ele: MercanciasInfo): string => ele.cantidadUMC,
    orden: 11,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (ele: MercanciasInfo): string => ele.unidadUMT,
    orden: 12,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (ele: MercanciasInfo): string => ele.cantidadUMT,
    orden: 13,
  },
  {
    encabezado: 'Presentación',
    clave: (ele: MercanciasInfo): string => ele.presentacion,
    orden: 14,
  },
  {
    encabezado: 'Número de registro sanitario',
    clave: (ele: MercanciasInfo): string => ele.numeroRegistro,
    orden: 15,
  },
  {
    encabezado: 'País de orígen',
    clave: (ele: MercanciasInfo): string => ele.paisDeOrigen,
    orden: 16,
  },
  {
    encabezado: 'País de procedencia',
    clave: (ele: MercanciasInfo): string => ele.paisDeProcedencia,
    orden: 17,
  },
  {
    encabezado: 'Tipo producto',
    clave: (ele: MercanciasInfo): string => ele.tipoProducto,
    orden: 18,
  },
  {
    encabezado: 'Uso específico',
    clave: (ele: MercanciasInfo): string => ele.usoEspecifico,
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



 