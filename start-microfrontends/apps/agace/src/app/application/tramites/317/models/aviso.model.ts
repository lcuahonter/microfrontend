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
  habilitado: true,
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

export interface AvisoValor {
  /**
   * @property {string} claveReferencia
   * @description claveReferencia del valor en español.
   */
  claveReferencia: string;

  /**
   * @property {number} cadenaDependencia
   * @description cadenaDependencia asociada al valor.
   */

  cadenaDependencia: string;

  /**
   * @property {number} importePago
   * @description Importe de pago asociado al valor.
   */
  importePago: string;
}
