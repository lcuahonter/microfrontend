/**
 * Modelo para configurar los campos de formulario en el componente Representante Legal Exportador.
 * @interface FieldConfig
 */
export interface FieldConfig {
  /**
   * Nombre del campo en el formulario.
   * @type {string}
   */
  nombre: string;

  /**
   * Etiqueta que se mostrará para el campo.
   * @type {string}
   */
  label: string;

  /**
   * Columna en la que se ubicará el campo (por ejemplo, 'col-6' para Bootstrap).
   * @type {string}
   */
  columna: string;

  /**
   * Indica si el campo es obligatorio.
   * @type {boolean}
   */
  required?: boolean;

  /**
   * Longitud máxima permitida para el campo.
   * @type {string}
   */
  maxlength?: string;

  /**
   * Tipo de campo (por ejemplo, 'text', 'email', 'dropdown', etc.).
   * @type {string}
   */
  tipo?: string;

  /**
   * Tooltip que se mostrará para el campo.
   * @type {string}
   */
  tooltip?: string;

  /**
   * Nombre del estado en el store donde se guarda el valor del campo.
   * @type {string}
   */
  storeStateName?: string;
}