/**
 * Interfaz que representa la respuesta de una consulta general
 */
export interface RespuestaConsulta {
  /**
   * Indica si la operación fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos obtenidos de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

/**
 * Interfaz que representa los datos generales obtenidos de una consulta.
 */
export interface ConsultaDatos {
  
  /**
   * Descripción de la mercancía consultada.
   */
  descripcionMercancia: string;

  /**
   * Porcentaje de desperdicio asociado a la mercancía.
   */
  porcentajeDesperdicio: number;

  /**
   * Código ADACE relacionado con la consulta.
   */
  adace: string;
}
