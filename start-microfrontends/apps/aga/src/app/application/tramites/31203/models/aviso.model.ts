/**
 * @interface
 * @name AccionBoton
 * @description
 * Representa una acción específica que se puede ejecutar desde un botón dentro de la interfaz de usuario.
 * Puede utilizarse para navegación entre pasos, acciones contextuales, etc.
 */
export interface AccionBoton {
  /**
   * Nombre o identificador de la acción del botón (por ejemplo, 'cont' para continuar, 'ant' para anterior).
   * @type {string}
   */
  accion: string;

  /**
   * Valor numérico que representa un índice o paso asociado a la acción.
   * @type {number}
   */
  valor: number;
}

/**
 * Representa la configuración de un campo de formulario relacionado con fecha de pago.
 */
export interface FechaDePagoConfig {
  /** Nombre que se muestra en la etiqueta del campo. */
  labelNombre: string;

  /** Define si el campo es obligatorio. */
  required: boolean;

  /** Indica si el campo está habilitado para interacción. */
  habilitado: boolean;
}

/**
 * Configuración predeterminada para el campo de fecha de pago.
 */
export const FECHA_DE_PAGO: FechaDePagoConfig = {
  labelNombre: 'Fecha de pago',
  required: false,
  habilitado: true,
};

/**
 * @interface
 * @name PreOperativo
 * @description
 * Estructura que representa una opción preoperativa con su texto visible (label) y valor técnico (value).
 * Utilizado comúnmente en listas desplegables o selecciones previas a una operación.
 */
export interface PreOperativo {
  /**
   * Texto descriptivo visible para el usuario.
   * @type {string}
   */
  label: string;

  /**
   * Valor técnico asociado a la opción, usado internamente en el sistema.
   * @type {string}
   */
  value: string;
}

/**
 * @interface
 * @name AvisoValor
 * @description
 * Define la estructura de datos de un aviso relacionado con pagos.
 * Incluye clave de referencia, cadena de dependencia e importe asociado al aviso.
 */
export interface AvisoValor {
  /**
   * Clave de referencia única asignada al aviso.
   * @type {string}
   */
  claveReferencia: string;

  /**
   * Cadena que representa a la dependencia asociada al aviso.
   * @type {string}
   */
  cadenaDependencia: string;

  /**
   * Monto o cantidad económica relacionada con el aviso de pago.
   * @type {string}
   */
  importePago: string;
}