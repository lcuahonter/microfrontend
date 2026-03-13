import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * @interface Partidas
 * @description
 * Representa los datos de una partida de mercancía.
 * Incluye información como la cantidad, unidad de medida, fracción arancelaria,
 * descripción, precio unitario y el total en USD.
 */
export interface Partidas {
  /**
   * @property cantidad
   * @description
   * Cantidad de la mercancía en la partida.
   * 
   * @type {number}
   */
  cantidad: number;

  /**
   * @property unidadDeMedida
   * @description
   * Unidad de medida de la mercancía (opcional).
   * 
   * @type {string}
   */
  unidadDeMedida?: string;

  /**
   * @property fraccionArancelaria
   * @description
   * Fracción arancelaria de la mercancía (opcional).
   * 
   * @type {string}
   */
  fraccionArancelaria?: string;

  /**
   * @property descripcion
   * @description
   * Descripción de la mercancía (opcional).
   * 
   * @type {string}
   */
  descripcion?: string;

  /**
   * @property precioUnitario
   * @description
   * Precio unitario de la mercancía en USD (opcional).
   * 
   * @type {number}
   */
  precioUnitario?: number;

  /**
   * @property totalUsd
   * @description
   * Total en USD de la mercancía (opcional).
   * 
   * @type {number}
   */
  totalUsd?: number;
}

/**
 * @interface DatosDeLaSolicitud
 * @description
 * Representa los datos generales de la solicitud.
 * Incluye información sobre entidades, representaciones, fracciones arancelarias,
 * unidades de medida y tipo (UMT), régimen y clasificación.
 */
export interface DatosDeLaSolicitud {
  /**
   * @property entidad
   * @description
   * Lista de entidades disponibles en la solicitud.
   * 
   * @type {Catalogo[]}
   */
  entidad: Catalogo[];

  /**
   * @property representacion
   * @description
   * Lista de representaciones federales disponibles en la solicitud.
   * 
   * @type {Catalogo[]}
   */
  representacion: Catalogo[];

  /**
   * @property fraccion
   * @description
   * Lista de fracciones arancelarias disponibles en la solicitud.
   * 
   * @type {Catalogo[]}
   */
  fraccion: Catalogo[];

  /**
   * @property UMT
   * @description
   * Lista de unidades de medida y tipo (UMT) disponibles en la solicitud.
   * 
   * @type {Catalogo[]}
   */
  UMT: Catalogo[];

  /**
   * @property regimen
   * @description
   * Lista de regímenes disponibles en la solicitud.
   * 
   * @type {Catalogo[]}
   */
  regimen: Catalogo[];

  /**
   * @property clasificacion
   * @description
   * Lista de clasificaciones de régimen disponibles en la solicitud.
   * 
   * @type {Catalogo[]}
   */
  clasificacion: Catalogo[];
}