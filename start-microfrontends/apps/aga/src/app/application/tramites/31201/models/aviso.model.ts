/**
 * @interface
 * @name AccionBoton
 * @description
 * Representa una acción asociada a un botón en la interfaz de usuario.
 */
export interface AccionBoton {
  /**
   * @property {string} accion
   * @description Nombre de la acción asociada al botón.
   */
  accion: string;

  /**
   * @property {number} valor
   * @description Valor numérico asociado a la acción del botón.
   */
  valor: number;
}

/**
 * @constant
 * @name FECHA_DE_PAGO
 * @description
 * Configuración predeterminada para el campo de fecha de pago.
 */
export const FECHA_DE_PAGO = {
  /**
   * @property {string} labelNombre
   * @description Etiqueta que describe el campo de fecha de pago.
   */
  labelNombre: 'Fecha de pago',

  /**
   * @property {boolean} required
   * @description Indica si el campo de fecha de pago es obligatorio.
   */
  required: false,

  /**
   * @property {boolean} habilitado
   * @description Indica si el campo de fecha de pago está habilitado.
   */
  habilitado: true
};

/**
 * @interface
 * @name PreOperativo
 * @description
 * Representa una opción preoperativa con una etiqueta y un valor asociado.
 */
export interface PreOperativo {
  /**
   * @property {string} label
   * @description Etiqueta que describe la opción preoperativa.
   */
  label: string;

  /**
   * @property {string} value
   * @description Valor asociado a la opción preoperativa.
   */
  value: string;
}

/**
 * @interface
 * @name AvisoValor
 * @description
 * Representa la información asociada al aviso, como la clave de referencia, 
 * la dependencia y el importe de pago.
 */
export interface AvisoValor {
  /**
   * @property {string} claveReferencia
   * @description Clave de referencia del valor en español.
   */
  claveReferencia: string;

  /**
   * @property {string} cadenaDependencia
   * @description Cadena de dependencia asociada al valor.
   */
  cadenaDependencia: string;

  /**
   * @property {string} importePago
   * @description Importe de pago asociado al valor.
   */
  importePago: string;
}

/**
 * @interface
 * @name RespuestaConsulta
 * @description
 * Interfaz que representa la respuesta de una consulta.
 */
export interface RespuestaConsulta {
  /**
   * @property {boolean} success
   * @description Indica si la consulta fue exitosa.
   */
  success: boolean;

  /**
   * @property {ConsultaDatos} datos
   * @description Datos resultantes de la consulta.
   */
  datos: ConsultaDatos;

  /**
   * @property {string} message
   * @description Mensaje de la respuesta.
   */
  message: string;
}

/**
 * @interface
 * @name ConsultaDatos
 * @description
 * Contiene los datos obtenidos de una consulta.
 */
export interface ConsultaDatos {
  /**
   * @property {string} mapTipoTramite
   * @description Mapa del tipo de trámite.
   */
  mapTipoTramite: string;

  /**
   * @property {string} mapDeclaracionSolicitud
   * @description Mapa de la declaración de la solicitud.
   */
  mapDeclaracionSolicitud: string;

  /**
   * @property {string} envioAviso
   * @description Indica si se envió el aviso.
   */
  envioAviso: string;

  /**
   * @property {string} numeroAviso
   * @description Número del aviso generado.
   */
  numeroAviso: string;

  /**
   * @property {string} claveReferencia
   * @description Clave de referencia de la operación.
   */
  claveReferencia: string;

  /**
   * @property {string} numeroOperacion
   * @description Número de la operación.
   */
  numeroOperacion: string;

  /**
   * @property {string} cadenaDependencia
   * @description Cadena de dependencia relacionada.
   */
  cadenaDependencia: string;

  /**
   * @property {string} banco
   * @description Nombre del banco relacionado.
   */
  banco: string;

  /**
   * @property {string} llavePago
   * @description Llave de pago utilizada.
   */
  llavePago: string;

  /**
   * @property {string} fechaPago
   * @description Fecha en la que se realizó el pago.
   */
  fechaPago: string;

  /**
   * @property {string} importePago
   * @description Importe monetario del pago.
   */
  importePago: string;
}
