export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos resultantes de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

export interface ConsultaDatos {
  /**
   * Información sobre exención de impuestos.
   * @type {TecnicaForm}
   */
  tecnicaForm: TecnicaForm;
}

export interface TecnicaForm {
  /**
   * Número de manifiesto.
   * @type {string}
   */
  contenedores: string;

  /**
   * Aduana relacionada.
   * @type {string}
   */
  aduana: string;

  /**
   * Organismo público involucrado.
   * @type {string}
   */
  observaciones: string;
}