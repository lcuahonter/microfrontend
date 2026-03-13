/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Interfaz que define la estructura de la información NICO.
 * 
 * Esta interfaz se utiliza para modelar la información de las claves y descripciones
 * del Sistema de Clasificación Industrial de América del Norte (S.C.I.A.N.).
 */
export interface NicoInfo {
    /** Clave del S.C.I.A.N. */
    clave_Scian: string;
    /** Descripción asociada a la clave del S.C.I.A.N. */
    descripcion_Scian: string;
  }
   
  /**
   * Configuración de la tabla para la visualización de datos NICO.
   * 
   * Esta constante define las columnas y el orden en que se mostrarán los datos.
   */
  export const NICO_TABLA = [
    {
      /** Encabezado para la clave del S.C.I.A.N. */
      encabezado: 'Clave S.C.I.A.N.',
      /** Función que obtiene la clave del elemento */
      clave: (ele: NicoInfo) => ele.clave_Scian,
      /** Orden de visualización de la columna */
      orden: 1,
    },
    {
      /** Encabezado para la descripción del S.C.I.A.N. */
      encabezado: 'Descripción del S.C.I.A.N.',
      /** Función que obtiene la descripción del elemento */
      clave: (ele: NicoInfo) => ele.descripcion_Scian,
      /** Orden de visualización de la columna */
      orden: 2,
    },
  ];
   
  /**
   * Interfaz que define la estructura de la información de mercancías.
   * 
   * Esta interfaz se utiliza para modelar todos los atributos relacionados con las mercancías,
   * incluyendo clasificación, denominaciones, medidas, procedencia y caducidad.
   */
  export interface MercanciasInfo {
    id: string;
    /** Clasificación del producto */
    clasificacion: string;
    /** Especificación de la clasificación */
    especificar: string;
    /** Denominación específica del producto */
    denominacionEspecifica: string;
    /** Denominación distintiva del producto */
    denominacionDistintiva: string;
    /** Denominación común o científica */
    denominacionComun: string;
    /** Forma farmacéutica del producto */
    formaFarmaceutica: string;
    /** Estado físico del producto */
    estadoFisico: string;
    /** Fracción arancelaria asociada */
    fraccionArancelaria: string;
    /** Descripción de la fracción arancelaria */
    descripcionFraccion: string;
    /** Unidad de medida de comercialización (UMC) */
    unidad: string;
    /** Cantidad correspondiente a la UMC */
    cantidadUMC: string;
    /** Unidad de medida de tarifa (UMT) */
    unidadUMT: string;
    /** Cantidad correspondiente a la UMT */
    cantidadUMT: string;
    /** Presentación del producto */
    presentacion: string;
    /** Número de registro sanitario del producto */
    numeroRegistro: string;
    /** País de origen del producto */
    paisDeOrigen: string;
    /** País de procedencia del producto */
    paisDeProcedencia: string;
    /** Tipo de producto */
    tipoProducto: string;
    /** Uso específico del producto */
    usoEspecifico: string;
    /** Fecha de caducidad del producto */
    fechaCaducidad: string;
  }
   
  /**
   * Configuración de la tabla para la visualización de datos de mercancías.
   * 
   * Esta constante define las columnas y el orden en que se mostrarán los datos.
   */
  export const MERCANCIAS_DATA = [
    {
      encabezado: 'Clasificación del producto',
      clave: (ele: MercanciasInfo) => ele.clasificacion,
      orden: 1,
    },
    {
      encabezado: 'Especificar clasificación del producto',
      clave: (ele: MercanciasInfo) => ele.especificar,
      orden: 2,
    },
    {
      encabezado: 'Denominación específica del producto',
      clave: (ele: MercanciasInfo) => ele.denominacionEspecifica,
      orden: 3,
    },
    {
      encabezado: 'Denominación distintiva',
      clave: (ele: MercanciasInfo) => ele.denominacionDistintiva,
      orden: 4,
    },
    {
      encabezado: 'Denominación común, nombre común o nombre científico',
      clave: (ele: MercanciasInfo) => ele.denominacionComun,
      orden: 5,
    },
    {
      encabezado: 'Forma farmacéutica',
      clave: (ele: MercanciasInfo) => ele.formaFarmaceutica,
      orden: 6,
    },
    {
      encabezado: 'Estado físico',
      clave: (ele: MercanciasInfo) => ele.estadoFisico,
      orden: 7,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciasInfo) => ele.fraccionArancelaria,
      orden: 8,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (ele: MercanciasInfo) => ele.descripcionFraccion,
      orden: 9,
    },
    {
      encabezado: 'Unidad de medida de comercialización (UMC)',
      clave: (ele: MercanciasInfo) => ele.unidad,
      orden: 10,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (ele: MercanciasInfo) => ele.cantidadUMC,
      orden: 11,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (ele: MercanciasInfo) => ele.unidadUMT,
      orden: 12,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (ele: MercanciasInfo) => ele.cantidadUMT,
      orden: 13,
    },
    {
      encabezado: 'Presentación',
      clave: (ele: MercanciasInfo) => ele.presentacion,
      orden: 14,
    },
    {
      encabezado: 'Número de registro sanitario',
      clave: (ele: MercanciasInfo) => ele.numeroRegistro,
      orden: 15,
    },
    {
      encabezado: 'País de origen',
      clave: (ele: MercanciasInfo) => ele.paisDeOrigen,
      orden: 16,
    },
    {
      encabezado: 'País de procedencia',
      clave: (ele: MercanciasInfo) => ele.paisDeProcedencia,
      orden: 17,
    },
    {
      encabezado: 'Tipo producto',
      clave: (ele: MercanciasInfo) => ele.tipoProducto,
      orden: 18,
    },
    {
      encabezado: 'Uso específico',
      clave: (ele: MercanciasInfo) => ele.usoEspecifico,
      orden: 19,
    },
    {
      encabezado: 'Fecha de caducidad',
      clave: (ele: MercanciasInfo) => ele.fechaCaducidad,
      orden: 20,
    },
  ];
   