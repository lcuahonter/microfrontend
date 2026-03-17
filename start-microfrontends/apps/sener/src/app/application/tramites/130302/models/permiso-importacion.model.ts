/**
 * @interface AccionBoton
 * @description Representa una acción asociada a un botón.
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
 * @interface PermisoModel
 * @description Representa un modelo de permiso con fechas asociadas.
 */
export interface PermisoModel {
  /**
   * @property {string} fetchaSolicitud
   * @description Fecha en la que se realizó la solicitud.
   */
  fetchaSolicitud: string;

  /**
   * @property {string} fetchaInicial
   * @description Fecha inicial del permiso.
   */
  fetchaInicial: string;

  /**
   * @property {string} fetchaFinal
   * @description Fecha final del permiso.
   */
  fetchaFinal: string;
}

/**
 * @constant NICO_TABLA
 * @description Configuración de columnas para la tabla dinámica de permisos.
 */
export const NICO_TABLA = [
  /**
   * @description Columna que muestra la fecha de solicitud.
   */
  { encabezado: 'Fetcha Solicitud', clave: (item: PermisoModel): string => item.fetchaSolicitud, orden: 1 },

  /**
   * @description Columna que muestra la fecha inicial del permiso.
   */
  { encabezado: 'Fetcha inicial', clave: (item: PermisoModel): string => item.fetchaInicial, orden: 2 },

  /**
   * @description Columna que muestra la fecha final del permiso.
   */
  { encabezado: 'Fetcha Final', clave: (item: PermisoModel): string => item.fetchaFinal, orden: 3 },
];

/**
 * @constant FECHA_DE_PAGO
 * @description Configuración del campo de fecha de pago.
 */
export const FECHA_DE_PAGO = {
  /**
   * @property {string} labelNombre
   * @description Etiqueta que describe el campo de fecha de pago.
   */
  labelNombre: 'Prórroga al',

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
 * @constant PRORROGA_DEL
 * @description Configuración del campo de fecha de inicio de la prórroga.
 */
export const PRORROGA_DEL = {
  /**
   * @property {string} labelNombre
   * @description Etiqueta que describe el campo de fecha de inicio de la prórroga.
   */
  labelNombre: 'Prórroga Del',

  /**
   * @property {boolean} required
   * @description Indica si el campo de fecha de inicio de la prórroga es obligatorio.
   */
  required: false,

  /**
   * @property {boolean} habilitado
   * @description Indica si el campo de fecha de inicio de la prórroga está habilitado.
   */
  habilitado: true,
};

/**
 * @interface AvisoValor
 * @description Representa los valores asociados a un aviso.
 */
export interface AvisoValor {
  /**
   * @property {number} saldoDisponible
   * @description Saldo disponible asociado al aviso.
   */
  saldoDisponible: number;

  /**
   * @property {number} prorrogaDel
   * @description Fecha de inicio de la prórroga asociada al aviso.
   */
  prorrogaDel: number;

  /**
   * @property {number} prorrogaAl
   * @description Fecha de fin de la prórroga asociada al aviso.
   */
  prorrogaAl: number;
}