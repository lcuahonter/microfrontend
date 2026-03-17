/**
  * @interface Partidas
  * @description
  * Esta interfaz define la estructura de los datos para las partidas de mercancía en el proceso 
  * de importación definitiva. Incluye propiedades opcionales para capturar información detallada 
  * sobre las partidas, como cantidad, unidad de medida, fracción arancelaria, descripción, y valores monetarios.
  * 
  * Propiedades:
  * - `id` (number): Identificador único de la partida.
  * - `cantidad` (number | opcional): Cantidad de la mercancía.
  * - `unidad_de_medida` (string | opcional): Unidad de medida de la mercancía.
  * - `fraccion_arancelaria_tigie` (number | opcional): Fracción arancelaria TIGIE de la mercancía.
  * - `descripcion` (string | opcional): Descripción de la mercancía.
  * - `precio_unitario` (string | opcional): Precio unitario de la mercancía.
  * - `total_usd` (number | opcional): Valor total de la partida en USD.
  * - `fraccion_arancelaria_prosec` (string | opcional): Fracción arancelaria PROSEC asociada.
  * - `fraccion_arancelaria` (string | opcional): Fracción arancelaria general.
  */
export interface Partidas {
  id: number;
  cantidad?: number;
  unidadDeMedida?: string;
  fraccionArancelariaTigie?: number | string;
  descripcion?: string;
  precioUnitario?: string;
  totalUsd?: number;
  fraccionArancelariaProsec?: string;
  fraccionArancelaria?: string;
}

/**
 * @interface MercanciaData
 * @description
 * Esta interfaz define la estructura de los datos relacionados con la mercancía en el contexto
 */
    interface MercanciaData {
    descripcion?: string;
    cantidadComercial?: number;
    valorFacturaUSD?: number;
    unidadMedidaTarifaria?: {
      clave?: string;
    };
    fraccionArancelaria?: {
      cveFraccion?: string;
    };
  }

  /**
   * @interface DatosResponse
   * @description
   * Esta interfaz define la estructura de la respuesta que contiene los datos de mercancía.
   * Incluye una propiedad opcional `mercancia` que es de tipo `MercanciaData`.
   */
  export interface DatosResponse {
    mercancia?: MercanciaData;
  }