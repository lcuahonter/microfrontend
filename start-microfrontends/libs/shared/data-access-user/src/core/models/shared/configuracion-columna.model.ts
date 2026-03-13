/**
 * @description Interfaz que define la configuración de una columna en una tabla genérica.
 * Permite establecer el encabezado, la clave para el valor de la columna y el orden de la misma.
 */
export interface ConfiguracionColumna<T> {
  /** Encabezado o título de la columna */
  encabezado: string;

  /**
   * Función que devuelve el valor de la columna para cada fila.
   * Puede retornar un valor de tipo string, number, undefined o boolean.
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /** Orden en el que se mostrará la columna dentro de la tabla */
  orden: number;

  /** Orden en el que se mostrará la columna dentro de la tabla */
  hiperenlace?: boolean; // Indica si la columna es un enlace (opcional)
  showIcon?: boolean; // Indica si la columna debe mostrar un icono (opcional)
}

/**
 * @description Interfaz que extiende la funcionalidad de configuración de columnas,
 * añadiendo propiedades adicionales como la llave y la opción de entrada.
 */
export interface ConfiguracionAporteColumna<T> {
  /** Encabezado o título de la columna */
  encabezado: string;

  /** Llave que identifica la columna */
  llave: string;

  /**
   * Función que devuelve el valor de la columna para cada fila.
   * Puede retornar un valor de tipo string, number, undefined o boolean.
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /** Opción de entrada asociada a la columna (por ejemplo, un campo de entrada o selección) */
  opcionDeEntrada: string;

  /** Orden en el que se mostrará la columna dentro de la tabla */
  orden: number;

  /**
   * Define la longitud máxima permitida para el campo correspondiente.
   *
   * Esta propiedad es opcional y se utiliza, por ejemplo, para establecer
   * la cantidad máxima de caracteres que se pueden ingresar en un input.
   */
  longitudMaxima?: number;

  /**
   * Tipo de valor que representa esta propiedad.
   *
   * Es una cadena de texto opcional que puede usarse para especificar
   * el tipo de entidad o categoría que se está manejando.
   */
  tipo?: string; // 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea';
}
