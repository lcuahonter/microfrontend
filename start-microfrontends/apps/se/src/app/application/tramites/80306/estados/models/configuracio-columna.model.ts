/**
 * Representa la configuración de una columna en una tabla genérica.
 * @template T Tipo de los datos de la fila.
 * @interface ConfiguracionColumna
 */
export interface ConfiguracionColumna<T> {
  /** Título de la columna */
  encabezado: string;
  /** Función que devuelve el valor de la columna para cada fila */
  clave: (ele: T) => string | number | undefined | boolean;
  /** Orden de la columna en la tabla */
  orden: number;
}