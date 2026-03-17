import { Catalogo } from '@ng-mf/data-access-user';

/**
 * Interfaz que representa la respuesta de una petición para obtener catálogos.
 *
 * @property {number} code - Código de estado de la respuesta.
 * @property {Catalogo[]} data - Lista de elementos del catálogo retornados.
 * @property {string} message - Mensaje de estado o error de la respuesta.
 */
export interface RespuestaCatalogos {
  code: number;
  data: Catalogo[];
  message: string;
}
