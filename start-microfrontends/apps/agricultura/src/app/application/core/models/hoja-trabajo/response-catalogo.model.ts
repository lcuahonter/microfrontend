import { Catalogo } from '@ng-mf/data-access-user';

/**
 * Representa la estructura de respuesta para una solicitud de catálogo.
 *
 * @property codigo - Un código en formato texto que indica el resultado de la solicitud.
 * @property mensaje - Un mensaje descriptivo sobre la respuesta.
 * @property datos - Un arreglo de elementos `Catalogo` retornados en la respuesta.
 */
export interface ResponseCatalogo {
  codigo: string;
  mensaje: string;
  datos: Catalogo[];
}
