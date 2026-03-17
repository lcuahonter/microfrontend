/**
 * @fileoverview
 * Este archivo define la interfaz `ConfiguracionColumna` utilizada para representar la configuración
 * de una columna en una tabla. Proporciona una estructura para personalizar las columnas, incluyendo
 * el encabezado, la clave de acceso a los datos y el orden en que se deben mostrar.
 * 
 * @module ConfiguracionColumnaModel
 * @description
 * Este archivo contiene la definición de la interfaz `ConfiguracionColumna`, que se utiliza para manejar
 * la configuración de las columnas en tablas dinámicas dentro de la aplicación.
 */

/**
 * @interface ConfiguracionColumna
 * @description
 * Representa la configuración de una columna en una tabla.
 * 
 * @template T El tipo de los datos que se utilizarán en la columna.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Título de la columna que se mostrará en la tabla.
   * @type {string}
   */
  encabezado: string;

  /**
   * Función que toma un elemento de tipo `T` y devuelve el valor correspondiente
   * a la columna para esa fila. Este valor puede ser un string, número, booleano o indefinido.
   * 
   * @type {(ele: T) => string | number | undefined | boolean}
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /**
   * Posición de la columna en la tabla, donde un número menor indica una posición más a la izquierda.
   * @type {number}
   */
  orden: number;
}