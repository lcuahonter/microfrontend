
/**
 * Respuesta genérica de una API que puede contener datos de cualquier tipo.
 * @template T Tipo de datos que se espera en la respuesta.
 * @interface JSONRespuesta
 */
export interface JSONRespuesta<T> {
  /**
   * Causa del error, si aplica.
   */
  causa?: string;

  /**
   * Código de estado HTTP o personalizado.
   */
  codigo?: string;

  /**
   * Mensaje descriptivo de la respuesta.
   */
  mensaje: string;

  /**
   * Datos retornados por la API, de tipo genérico T.
   */
  datos?: T;
}