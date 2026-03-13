/**
 * Interfaz que representa los datos del pago de derechos.
 */
export interface PagoDeDerechos {
  /**
   * Indica si el pago está exento (Sí/No).
   */
  exentoPago: string;
  /**
   * Justificación del motivo de exención (si aplica).
   */
  justificacion: string;
  /**
   * Clave de referencia para el pago.
   */
  claveReferencia: string;
  /**
   * Cadena generada por la dependencia para pago.
   */
  cadenaDependencia: string;
  /**
   * Nombre del banco donde se realiza el pago.
   */
  banco: string;
  /**
   * Llave única para realizar el pago.
   */
  llavePago: string;
  /**
   * Monto del pago.
   */
  importePago: string;
  /**
   * Fecha en que se realizó el pago.
   */
  fechaPago: string;
}
