/**
 * Respuesta del servicio de firma.
 */
export interface FirmarResponse {
  /**
   * Identificador único de la solicitud firmada.
   */
  id_solicitud: number;

  /**
   * Identificador del requerimiento asociado (opcional).
   */
  id_requerimiento?: number;
}
