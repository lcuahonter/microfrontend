/**
 * Interfaz que representa la configuración de una columna en una tabla.
 * 
 * @template T - Tipo genérico que representa los datos de cada fila en la tabla.
 * 
 * @interface ConfiguracionColumna
 */
export interface ConfiguracionColumna<T> {
  /**
   * Texto que será mostrado como título de la columna en el encabezado de la tabla.
   */
  encabezado: string;

  /**
   * Función que recibe un elemento (fila) de tipo `T` y retorna el valor que se mostrará en la celda correspondiente a esta columna.
   * Puede devolver un string, número, booleano o undefined.
   * 
   * @param {T} ele - Elemento (fila) del tipo genérico `T`.
   * @returns {string | number | undefined | boolean} Valor a mostrar en la celda.
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /**
   * Número que indica el orden en que la columna será mostrada dentro de la tabla.
   * Columnas con orden menor se muestran antes.
   */
  orden: number;
}
