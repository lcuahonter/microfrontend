import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

export interface NicoInfo {
  clave_Scian: string;
  descripcion_Scian: string;
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

export interface MercanciasInfo {
  nombreComercial: string;
  nombreComun: string;
  nombreCientifico: string;
  porcentajeConcentracion: string;
  clasificacionToxicologica: string;
  clasificacionToxicologicaClave?: string;
  objetoImportacion: string;
  objetoImportacionClave?: string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  unidadMedidaTarifa: string;
  cantidadUmt: string;
  cantidadUmc: string;
  paisProduccionIngredienteActivo: string;
  paisElaboracionProducto: string;
  paisProcedenciaUltimoPuerto: string;
  paisOrigen: string;
  numeroRegistroSanitario: string;
  numeroCas: string;
  estadoFisico: string;
  estadoFisicoClave?: string;
  usoEspecifico: string;
  umc: string;
  umcClave?: string;
  estadoFisicoOtro?: string;
  objetoImportacionOtro?: string;
  paisDeOriginDatosObj?: Array<{ clave: string; descripcion: string }>;
  paisDeProcedenciaDatosObj?: Array<{ clave: string; descripcion: string }>;
  /** País proveedor de la mercancía. */
  paisProveedor?: string | string[];

  /** País donde se elabora el producto (FORMULADO). */
  paisElaboracion?: string | string[];

  /** País donde se produce o fabrica el ingrediente activo (TÉCNICO). */
  paisFabrica?: string | string[];
}

export interface PermisoModel {
  nombre: string;
  rfc: string;
  curp: string;
  telefono: number;
  correoElectronico: string;
  calle: string;
}
  
  export const MERCANCIAS_DATA:ConfiguracionColumna<MercanciasInfo>[] = [
    {
      encabezado: 'Nombre comercial',
      clave: (ele: MercanciasInfo) => ele.nombreComercial,
      orden: 1,
    },
    {
      encabezado: 'Nombre común',
      clave: (ele: MercanciasInfo) => ele.nombreComun,
      orden: 2,
    },
    {
      encabezado: 'Nombre científico',
      clave: (ele: MercanciasInfo) => ele.nombreCientifico,
      orden: 3,
    },
    {
      encabezado: 'Porcentaje de concentración',
      clave: (ele: MercanciasInfo) => ele.porcentajeConcentracion,
      orden: 4,
    },
    {
      encabezado: 'Clasificación toxicológica',
      clave: (ele: MercanciasInfo) => ele.clasificacionToxicologica,
      orden: 5,
    },
    {
      encabezado: 'Objeto de importación',
      clave: (ele: MercanciasInfo) => ele.objetoImportacion,
      orden: 6,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciasInfo) => ele.fraccionArancelaria,
      orden: 7,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (ele: MercanciasInfo) => ele.descripcionFraccion,
      orden: 8,
    },
    {
      encabezado: 'Unidad de medida de tarifa (umt)',
      clave: (ele: MercanciasInfo) => ele.unidadMedidaTarifa,
      orden: 9,
    },
    {
      encabezado: 'Cantidad umt',
      clave: (ele: MercanciasInfo) => ele.cantidadUmt,
      orden: 10,
    },
    {
      encabezado: 'Cantidad umc',
      clave: (ele: MercanciasInfo) => ele.cantidadUmc,
      orden: 11,
    },
    {
      encabezado: 'País donde se produce o fabrica el ingrediente activo',
      clave: (ele: MercanciasInfo) => ele.paisProduccionIngredienteActivo,
      orden: 12,
    },
    {
      encabezado: 'País donde se elabora el producto',
      clave: (ele: MercanciasInfo) => ele.paisElaboracionProducto,
      orden: 13,
    },
    {
      encabezado: 'País de procedencia (último puerto embarque)',
      clave: (ele: MercanciasInfo) => ele.paisProcedenciaUltimoPuerto,
      orden: 14,
    },
    {
      encabezado: 'País de orígen',
      clave: (ele: MercanciasInfo) => Array.isArray(ele.paisDeOriginDatosObj)
      ? ele.paisDeOriginDatosObj.map(p => p.descripcion).join(', ')
      : '',
      orden: 15,
    },
    {
      encabezado: 'Número de registro sanitario',
      clave: (ele: MercanciasInfo) => ele.numeroRegistroSanitario,
      orden: 16,
    },
    {
      encabezado: 'Número cas',
      clave: (ele: MercanciasInfo) => ele.numeroCas,
      orden: 17,
    },
    {
      encabezado: 'Estado físico',
      clave: (ele: MercanciasInfo) => ele.estadoFisico,
      orden: 18,
    },
    {
      encabezado: 'Uso específico',
      clave: (ele: MercanciasInfo) => ele.usoEspecifico,
      orden: 19,
    },
    {
      encabezado: 'UMC',
      clave: (ele: MercanciasInfo) => ele.umc,
      orden: 20,
    },
  ];


  export const DATOS_MERCANCIAS:ConfiguracionColumna<MercanciasInfo>[] = [
    {
      encabezado: 'Nombre comercial',
      clave: (ele: MercanciasInfo) => ele.nombreComercial,
      orden: 1,
    },
    {
      encabezado: 'Nombre común',
      clave: (ele: MercanciasInfo) => ele.nombreComun,
      orden: 2,
    },
    {
      encabezado: 'Nombre científico',
      clave: (ele: MercanciasInfo) => ele.nombreCientifico,
      orden: 3,
    },
    {
      encabezado: 'Porcentaje de concentración',
      clave: (ele: MercanciasInfo) => ele.porcentajeConcentracion,
      orden: 4,
    },
    {
      encabezado: 'Clasificación toxicológica',
      clave: (ele: MercanciasInfo) => ele.clasificacionToxicologica,
      orden: 5,
    },
    {
      encabezado: 'Objeto de importación',
      clave: (ele: MercanciasInfo) => ele.objetoImportacion,
      orden: 6,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciasInfo) => ele.fraccionArancelaria,
      orden: 7,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (ele: MercanciasInfo) => ele.descripcionFraccion,
      orden: 8,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (ele: MercanciasInfo) => ele.unidadMedidaTarifa,
      orden: 9,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (ele: MercanciasInfo) => ele.cantidadUmt,
      orden: 10,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (ele: MercanciasInfo) => ele.cantidadUmc,
      orden: 11,
    },
    {
      encabezado: 'País donde se produce o fabrica el ingrediente activo  (TÉCNICO)',
      clave: (ele: MercanciasInfo) => ele.paisProduccionIngredienteActivo,
      orden: 12,
    },
    {
      encabezado: 'País donde se elabora el producto (FORMULADO)',
      clave: (ele: MercanciasInfo) => ele.paisElaboracionProducto,
      orden: 13,
    },
    {
      encabezado: 'País de procedencia (último puerto de embarque)',
      clave: (ele: MercanciasInfo) => ele.paisProcedenciaUltimoPuerto,
      orden: 14,
    },
    {
      encabezado: 'País de orígen',
      clave: (ele: MercanciasInfo) => Array.isArray(ele.paisDeOriginDatosObj) && ele.paisDeOriginDatosObj.length > 0
      ? ele.paisDeOriginDatosObj.map(p => p.descripcion).join(', ')
      : ele.paisOrigen,
      orden: 15,
    },
    {
      encabezado: 'Número de registro sanitario',
      clave: (ele: MercanciasInfo) => ele.numeroRegistroSanitario,
      orden: 16,
    },
    {
      encabezado: 'Número cas',
      clave: (ele: MercanciasInfo) => ele.numeroCas,
      orden: 17,
    },
    {
      encabezado: 'Estado físico',
      clave: (ele: MercanciasInfo) => ele.estadoFisico,
      orden: 18,
    },
    {
      encabezado: 'Uso específico',
      clave: (ele: MercanciasInfo) => ele.usoEspecifico,
      orden: 19,
    },
    {
      encabezado: 'UMC',
      clave: (ele: MercanciasInfo) => ele.umc,
      orden: 20,
    },
  ];
  /**
   * Interfaz que representa la configuración de visibilidad para varios campos relacionados con países.
   */
  export interface ConfiguracionVisibilidad {
    paisOrigen: boolean;
    paisFabrica: boolean;
    paisElaboracion: boolean;
    paisProveedor: boolean;
    paisProcedencia: boolean;
  }
/**
 * Interfaz que define la estructura de un objeto de fracción arancelaria.
 */
  export interface FraccionArancelaria {
    descripcion: string;
    umt: string;
  }

  /**
   * Array of numeric identifiers corresponding to the "nombres" fields used by the
   * datos-domicilio-legal model.
   *
   * This constant provides a canonical, immutable list of field IDs that are consumed
   * across the application for form generation, mapping backend responses, and validation
   * related to the legal domicile "nombres" section.
   *
   * @remarks
   * - Treat this constant as read-only at runtime.
   * - Use it wherever a definitive set of "nombres" field identifiers is required.
   *
   * @public
   * @module app/application/shared/models/datos-domicilio-legal.model
   * @compodoc
   */
  export const NOMBRES_CAMPOS = [260512,260513, 260514, 260516,260515];