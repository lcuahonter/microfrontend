/**
 * Respuesta del servicio al guardar o generar un requerimiento.
 * Contiene el identificador único del requerimiento creado.
 */
export interface GuardarGenerarRequerimientoResponse {
  /**
   * Identificador del requerimiento que fue generado y almacenado.
   */
  id_requerimiento: number;
}
