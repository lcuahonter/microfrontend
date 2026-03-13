import { Catalogo} from "@libs/shared/data-access-user/src";

/**
 * Respuesta del catálogo de estados.
 * @interface EstadoCatalogResponse
 * @property {number} code - Código de respuesta del catálogo.
 * @property {Catalogo[]} data - Arreglo de objetos de catálogo devueltos.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 */
export interface EstadoCatalogResponse {
  code: number;
  data: Catalogo[];
  message: string;
}

/**
 * Representa una opción de selección tipo radio.
 * @interface RadioOpcion
 * @property {string} label - Etiqueta que describe la opción de radio.
 * @property {string} value - Valor asociado a la opción de radio.
 */
export interface RadioOpcion {
  label: string;
  value: string;
}