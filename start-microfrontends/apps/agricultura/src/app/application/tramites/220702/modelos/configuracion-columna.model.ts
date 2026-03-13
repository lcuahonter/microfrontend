/**
 * Interfaz que representa la configuración de una columna en una tabla.
 * @export
 * @interface ConfiguracionColumna
 * @template T - Tipo genérico que representa el tipo de los datos de las filas.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Título de la columna que se mostrará en el encabezado de la tabla.
   * @property {string} encabezado
   */
  encabezado: string;

  /**
   * Función que recibe un elemento de tipo `T` y devuelve el valor que se mostrará en la columna para esa fila.
   * @property {(ele: T) => string | number | undefined | boolean} clave
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /**
   * Orden en el que se mostrará la columna dentro de la tabla.
   * @property {number} orden
   */
  orden: number;
}