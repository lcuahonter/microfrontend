/**
 * Interfaz que representa la respuesta de una operación relacionada con mercancías.
 * Contiene información sobre el resultado de la operación, un mensaje descriptivo
 * y los datos relacionados con la mercancía si la operación fue exitosa.
 */
export interface RespuestaMercancia {
  /**
   * Indica si la operación fue exitosa.
   * `true` si se completó correctamente; de lo contrario, `false`.
   */
  success: boolean;

  /**
   * Objeto que contiene los datos detallados de la mercancía relacionados con la operación.
   */
  datos: DatosDelMercancia[];

  /**
   * Mensaje que describe el resultado de la operación.
   * Puede incluir información de éxito, error o advertencia.
   */
  message: string;
}

/**
 * Interfaz que representa los datos de una mercancía.
 */
export interface DatosDelMercancia {
  /**
   * Identificador único de la mercancía.
   * @type {number}
   */
  id: number;

  /**
   * Tipo de mercancía.
   * @type {string}
   */
  tipoDeMercancia: string;

  /**
   * Unidad de medida de la mercancía.
   * @type {string | number}
   */
  unidadMedida: string | number;

  /**
   * Condición de la mercancía.
   * @type {string | number}
   */
  condicionMercancia: string | number;

  /**
   * Año relacionado con la mercancía.
   * @type {string | number}
   */
  ano: string | number;

  /**
   * Cantidad de mercancía.
   * @type {string}
   */
  cantidad: string;

  /**
   * Marca de la mercancía.
   * @type {string}
   */
  marca: string;

  /**
   * Modelo de la mercancía.
   * @type {string}
   */
  modelo: string;

  /**
   * Serie de la mercancía.
   * @type {string}
   */
  serie: string;

  /**
   * Datos adicionales relacionados con la mercancía.
   * @type {Array<any>}
   */
  datosDelMercancia: [];
}
