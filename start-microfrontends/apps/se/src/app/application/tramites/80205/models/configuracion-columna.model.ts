/**
 * @fileoverview
 * Este archivo contiene la definición de la interfaz `ConfiguracionColumna`, que se utiliza para configurar
 * las columnas de una tabla en la aplicación. La interfaz permite definir el encabezado, el valor que se mostrará
 * en cada celda y el orden de las columnas.
 *
 * @module ConfiguracionColumnaModel
 * @description
 * Define la estructura necesaria para configurar las columnas de una tabla, incluyendo el título, el valor
 * dinámico de cada celda y el orden de las columnas.
 */

/**
 * Interfaz que define la configuración de una columna en una tabla.
 * 
 * @template T - Tipo genérico que representa el tipo de los datos de las filas.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Título de la columna que se mostrará en el encabezado de la tabla.
   * @property {string} encabezado
   * 
   * @example
   * const columna: ConfiguracionColumna<any> = {
   *   encabezado: 'Nombre',
   *   clave: (ele) => ele.nombre,
   *   orden: 1,
   * };
   * console.log(columna.encabezado); // 'Nombre'
   */
  encabezado: string;

  /**
   * Función que recibe un elemento de tipo `T` y devuelve el valor que se mostrará en la columna
   * para esa fila. Puede devolver un string, número, booleano o undefined.
   * @property {(ele: T) => string | number | undefined | boolean} clave
   * 
   * @param {T} ele - Elemento de la fila de la tabla.
   * @returns {string | number | undefined | boolean} Valor que se mostrará en la columna.
   * 
   * @example
   * const columna: ConfiguracionColumna<{ nombre: string }> = {
   *   encabezado: 'Nombre',
   *   clave: (ele) => ele.nombre,
   *   orden: 1,
   * };
   * const fila = { nombre: 'Juan' };
   * console.log(columna.clave(fila)); // 'Juan'
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /**
   * Orden en el que se mostrará la columna dentro de la tabla.
   * @property {number} orden
   * 
   * @example
   * const columna: ConfiguracionColumna<any> = {
   *   encabezado: 'Nombre',
   *   clave: (ele) => ele.nombre,
   *   orden: 1,
   * };
   * console.log(columna.orden); // 1
   */
  orden: number;
}