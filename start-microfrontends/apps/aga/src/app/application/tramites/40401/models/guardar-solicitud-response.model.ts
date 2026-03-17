/**
 * Modelo de respuesta del guardado de solicitud CAAT Aéreo
 *
 * NOTA:
 * El backend envuelve este objeto dentro de BaseResponse<T>
 */
export interface GuardarSolicitudResponse {

  /**
   * ID generado de la solicitud
   */
  id_solicitud: number;
}
