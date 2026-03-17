import { Catalogo} from "@libs/shared/data-access-user/src";

/**
 * Respuesta del catálogo de estados.
 * @interface EstadoCatalogResponse
 * @property {number} code - Código de respuesta del servicio.
 * @property {Catalogo[]} data - Lista de elementos del catálogo.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 */
export interface EstadoCatalogResponse {
  /** Código de respuesta del servicio. */
  code: number;
  /** Lista de elementos del catálogo. */
  data: Catalogo[];
  /** Mensaje descriptivo de la respuesta. */
  message: string;
}

/**
 * Interfaz que representa una opción de radio.
 */
export interface RadioOpcion {
  /** Etiqueta que describe la opción de radio. */
  label: string;

  /** Valor asociado a la opción de radio. */
  value: string;
}