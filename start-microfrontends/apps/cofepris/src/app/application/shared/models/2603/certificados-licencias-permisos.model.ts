import { Catalogo} from "@libs/shared/data-access-user/src";

/**
 * Interfaz que representa la respuesta del catálogo de estados.
 * Incluye el código de estado, los datos del catálogo y un mensaje descriptivo.
 */
export interface EstadoCatalogResponse {
  /** Código de estado de la respuesta. */
  code: number;
  /** Lista de elementos del catálogo de estados. */
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