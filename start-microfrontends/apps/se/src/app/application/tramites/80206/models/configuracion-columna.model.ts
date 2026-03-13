/**
 * Este archivo define la interfaz `ConfiguracionColumna`, utilizada para configurar las columnas de las tablas dinámicas en el módulo de ampliación de servicios.
 * Proporciona propiedades para definir el encabezado, la clave de acceso a los datos y el orden de las columnas.
 * 
 * La interfaz `ConfiguracionColumna` permite configurar dinámicamente las columnas de las tablas, especificando el encabezado, 
 * la función para acceder a los datos y el orden de las columnas.
 */

/**
 * Interfaz para configurar las columnas de una tabla dinámica.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Encabezado de la columna.
   */
  encabezado: string;

  /**
   * Función que define la clave para acceder a los datos de la columna.
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /**
   * Orden de la columna en la tabla.
   */
  orden: number;
}