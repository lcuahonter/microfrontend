import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';

/**
 * @interface DestinoFinalRespuesta
 * @description
 * Define la estructura de la respuesta que se espera desde la API
 * cuando se consultan los registros de destino final.
 */
export interface DestinoFinalRespuesta {
  /**
   * Código de estado de la respuesta HTTP o lógica.
   * 
   * @example 200
   */
  code: number;

  /**
   * Lista de objetos de tipo `DestinoFinal` devueltos en la respuesta.
   */
  data: DestinoFinal[];

  /**
   * Mensaje descriptivo asociado con la respuesta.
   * 
   * @example "Consulta exitosa"
   */
  message: string;
}

/**
 * @interface ProveedorRespuesta
 * @description
 * Define la estructura de la respuesta que se espera desde la API
 * cuando se consultan los proveedores relacionados al trámite.
 */
export interface ProveedorRespuesta {
  /**
   * Código de estado devuelto por la API.
   * 
   * @example 200
   */
  code: number;

  /**
   * Arreglo de proveedores obtenidos en la respuesta.
   */
  data: Proveedor[];

  /**
   * Mensaje textual que acompaña a la respuesta.
   */
  message: string;
}