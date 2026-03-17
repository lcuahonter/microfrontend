/**
 * Modelo de respuesta para la validación del encargo conferido.
 * @property {number} code - Código de respuesta del servicio.
 * @property {boolean} datos - Indica si el RFC tiene un encargo conferido.
 * @property {string} message - Mensaje de respuesta del servicio.
 */
export interface EncargoConferidoResponse {
  code: number;
  datos: boolean;
  message: string;
}

/**
 * Cuerpo de la solicitud para validar el encargo conferido.
 * @property {string} rfc - RFC del solicitante.
 * @property {number} tipoOperacion - Tipo de operación a validar.
 */
export interface BodyValidarEncargoConferido {
  rfc: string;
  tipoOperacion: string;
}
