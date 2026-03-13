/**
 * Mensajes de alerta para los manifiestos.
 * Contiene información sobre los requisitos y normatividad aplicable.
 */
export const MANIFIESTOS_ALERT = {
  DATOS_MANIFIESTOS: `<p style="text-align: center;">Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.</p>`

};

/**
 * Constante que representa la información relacionada con la fecha de pago.
 * 
 * @property {string} labelNombre - Etiqueta descriptiva para la fecha de pago.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_PAGO= {
  labelNombre:'Fecha de pago',
  required: false,
  habilitado: true,
}

/**
 * Constante que representa la información relacionada con el pago.
 *
 * @property {string} labelNombre - Etiqueta que describe el campo de fecha de pago.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const PAGO = {
  labelNombre:'Fecha de pago:',
  required: false,
  habilitado: true,
}

/**
 * Constante que define las longitudes máximas permitidas para varios campos relacionados con el permiso de importación biológica.
 *
 * @property {number} claveDeReferencia - Longitud máxima para la clave de referencia (9 caracteres).
 * @property {number} cadenaDependencia - Longitud máxima para la cadena de dependencia (14 caracteres).
 * @property {number} liaveDePago - Longitud máxima para la llave de pago (30 caracteres).
 * @property {number} importeDePago - Longitud máxima para el importe de pago (16 caracteres).
 */
export const MAXLENGTH = {
  claveDeReferencia:9,
  cadenaDependencia:14,
  liaveDePago:30,
  importeDePago: 16
}









