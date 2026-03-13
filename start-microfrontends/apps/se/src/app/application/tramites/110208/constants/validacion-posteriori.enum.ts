/** Interfaz que define la estructura de un ítem de mercancía en la respuesta de búsqueda.
 */
export interface MercanciaResponseItem {
  idMercancia: number;
  fraccionArancelaria?: string;
  numeroRegistroProducto?: string;
  fechaExpedicion?: string;
  fechaVencimiento?: string;
  nombreTecnico?: string;
  nombreComercial?: string;
  criterioOrigen?: string;
  valorContenidoRegional?: string;
  normaOrigen?: string;
  nombreIngles?: string;
}

/** Interfaz que define la estructura de la respuesta de búsqueda de mercancías.
 */
export interface BuscarMercanciasResponse {
  datos?: MercanciaResponseItem[];
}

/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La Solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Usted cuenta con 5 días naturales para firmar electrónicamente su solicitud y así poder obtener el certificado, de lo contrario ésta será cancelada</p>`;