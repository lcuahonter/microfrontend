import { Catalogo } from "@libs/shared/data-access-user/src";

/** Interfaz que representa los datos de las regiones */
export interface RegionesData {
     /** Identificador único del destinatario. */
  id: number;
    /** Estado de la región */
    estado: string,

    /** Cantidad de café comprado */
    cafeCompra: string,

    /** Nombre de la región */
    region: string,

    /** Tipo de café */
    tipoDeCafe: string,

    /** Volumen de café */
    volumen: number
}

/** Interfaz que representa los datos de los beneficios */
export interface BeneficiosData {
       /** Identificador único del destinatario. */

      id: number;

    /** Nombre del beneficio */
    nombre: string,

    /** Calle donde se encuentra el beneficio */
    calle: string,

    /** Número exterior del beneficio */
    numeroExterior: number,

    /** Número interior del beneficio */
    numeroInterior: number,

    /** Colonia donde se encuentra el beneficio */
    colonia: string,

    /** Estado donde se encuentra el beneficio */
    estado: string,

    /** Código postal del beneficio */
    codigoPostal: number,

    /** Indica si el beneficio es propio o alquilado */
    propiaoAliquilada: string,

    /** Capacidad del beneficio en kilogramos */
    capacidad: number,

    /** Volumen del beneficio en kilogramos */
    volumen: number,
}

/** Interfaz que representa los datos de las bodegas */
export interface BodegasData {
       /** Identificador único del destinatario. */

      id: number;

    /** Nombre de la bodega */
    nombre: string,

    /** Calle donde se encuentra la bodega */
    calle: string,

    /** Número exterior de la bodega */
    numeroExterior: number,

    /** Número interior de la bodega */
    numeroInterior: number,

    /** Colonia donde se encuentra la bodega */
    colonia: string,

    /** Estado donde se encuentra la bodega */
    estado: string,

    /** Código postal de la bodega */
    codigoPostal: number,

    /** Indica si la bodega es propia o alquilada */
    propiaoAliquilada: string,

    /** Capacidad de la bodega en kilogramos */
    capacidad: number
}

/** Interfaz que representa los datos de los exportadores de café */
export interface CafeExportadoresData {
       /** Identificador único del destinatario. */

      id: number;

    /** Marca comercial del exportador */
    marcaComercial: string,

    /** Clasificación del café */
    clasificacion: string,

    /** Volumen del café exportado en kilogramos */
    volumen: number
}
export interface RegionFormaInt {
  /**
   * Estado o entidad federativa donde se produce o procesa el café.
   * 
   * @property {string} estado
   */
  estado: string;

  /**
   * Tipo o variedad específica del producto de café.
   * 
   * @property {string} productoCafe
   */
  productoCafe: string;

  /**
   * Descripción detallada de la región de compra del café.
   * 
   * @property {string} descRegionCompra
   */
  descRegionCompra: string;

  /**
   * Descripción del tipo de café (por ejemplo: arábica, robusta, etc.).
   * 
   * @property {string} descripTipoCafe
   */
  descripTipoCafe: string;

  /**
   * Volumen de café en la unidad de medida correspondiente.
   * 
   * @property {number} volumen
   */
  volumen: number;
}


/**
 * Representa la respuesta de un conjunto de catálogos.
 */
export interface RespuestaCatalogos {
  /** Código de estado de la respuesta. */
  code: number;
  /** Lista de catálogos incluidos en la respuesta. */
  data: Catalogo[];
  /** Mensaje asociado a la respuesta. */
  message: string;
}