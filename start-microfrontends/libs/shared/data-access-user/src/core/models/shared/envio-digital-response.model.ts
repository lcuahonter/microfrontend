/**
 * Respuesta del servicio de Envío Digital.
 */
export interface EnvioDigitalResponse {
  /**
   * Número de certificado emitido.
   */
  num_certificado: string;

  /**
   * Tipo de documento enviado (por ejemplo: certificado, permiso, etc.).
   */
  tipo_documento: string;

  /**
   * País de destino del documento o certificado.
   */
  pais_destino: string;

  /**
   * Historial o lista de estados relacionados con el envío del certificado.
   */
  estado_envio_certificado: EstadoCertificado[];

  /**
   * Historial o lista de estados relacionados con la revisión del certificado.
   */
  estado_revision_certificado: EstadoCertificado[];
}

/**
 * Representa el estado de un certificado en un punto específico del proceso.
 */
export interface EstadoCertificado {
  /**
   * Fecha y hora en que se realizó la transacción.
   * Formato esperado: YYYY-MM-DD HH:mm:ss
   */
  fecha_transaccion: string;

  /**
   * Número de la transacción asociada.
   */
  num_transaccion: string;

  /**
   * Estatus actual de la transacción (por ejemplo: aprobado, rechazado, pendiente).
   */
  estatus_transaccion: string;

  /**
   * Observaciones o comentarios adicionales sobre la transacción.
   */
  observaciones: string;
}
