/**
 * Interfaz que representa la respuesta de una consulta general.
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
   * Clave del régimen.
   * @type {string}
   */
  regimen_0: boolean;

  /**
   * Clave del régimen adicional.
   * @type {string}
   */
  regimen_1: boolean;

  /**
   * Clave del régimen adicional.
   * @type {string}
   */
  regimen_2: boolean;

  /**
   * Clave del régimen adicional.
   * @type {string}
   */
  regimen_3: boolean;

  /**
   * Manifiesto de la consulta.
   * @type {string}
   */
  manifiesto: boolean;
}
