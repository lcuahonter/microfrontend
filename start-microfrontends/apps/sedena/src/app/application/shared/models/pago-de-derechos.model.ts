/**
 * Constante que define la configuración para el campo de fecha de pago.
 *
 * @constant
 * @property {string} labelNombre - Etiqueta del campo mostrada al usuario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado para edición.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: true,
};

/**
 * Interfaz que representa el estado del formulario de pago de derechos.
 *
 * @property {string} claveReferencia - Clave de referencia del pago.
 * @property {string} cadenaDependencia - Cadena de dependencia asociada.
 * @property {string} banco - Banco seleccionado para el pago.
 * @property {string} llavePago - Llave de pago generada.
 * @property {string} fechaPago - Fecha en la que se realizó el pago.
 * @property {string} importePago - Importe total del pago.
 */
export interface PagoDerechosFormState {
  claveReferencia: string;
  cadenaDependencia: string;
  banco: string;
  llavePago: string;
  fechaPago: string;
  importePago: string;
}
