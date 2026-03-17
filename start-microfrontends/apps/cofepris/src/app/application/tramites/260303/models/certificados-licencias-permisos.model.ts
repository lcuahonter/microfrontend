import { Catalogo} from "@libs/shared/data-access-user/src";

/**
 * Respuesta del catálogo de estados.
 * @interface EstadoCatalogResponse
 * @property {number} code - Código de respuesta.
 * @property {Catalogo[]} data - Datos del catálogo de estados.
 * @property {string} message - Mensaje de respuesta.
 */
export interface EstadoCatalogResponse {
  code: number;
  data: Catalogo[];
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