/**
 * Configuración de una columna en una tabla.
 * @template T Tipo genérico para los datos de la columna.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Título de la columna.
   */
  encabezado: string;

  /**
   * Función que devuelve el valor de la columna para cada fila.
   * @param ele Elemento de tipo T.
   * @returns Valor de la columna (puede ser string, number, undefined o boolean).
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /**
   * Orden de la columna en la tabla.
   */
  orden: number;
}