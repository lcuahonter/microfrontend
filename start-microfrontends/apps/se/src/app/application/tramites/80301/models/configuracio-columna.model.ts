/**
 * Interfaz genérica que define la configuración de una columna para tablas dinámicas.
 * 
 * Esta estructura es utilizada para generar automáticamente columnas en componentes de visualización,
 * como tablas o listas, extrayendo dinámicamente los valores desde un tipo de dato genérico `T`.
 *
 * @template T - Tipo de objeto del cual se extraerán los datos para cada columna.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Título de la columna que se mostrará en la interfaz de usuario.
   * Generalmente corresponde al encabezado visible de la tabla.
   */
  encabezado: string;

  /**
   * Función que recibe un elemento de tipo `T` y retorna el valor a mostrar en la celda correspondiente.
   * El valor devuelto puede ser una cadena, número, booleano o indefinido.
   */
  clave: (ele: T) => string | number | boolean | undefined;

  /**
   * Orden en que debe mostrarse la columna dentro de la tabla.
   * Las columnas se organizan en orden ascendente según este valor.
   */
  orden: number;
}
