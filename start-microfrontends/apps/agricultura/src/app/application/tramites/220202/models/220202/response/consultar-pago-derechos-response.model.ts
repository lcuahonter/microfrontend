/**
 * interface para respuesta de consulta de pago de derechos
 */
export interface ConsultarPagoDerechosResponse {
  id_solicitud: number;
  id_pago: number;
  exento_pago: boolean;
  ide_motivo_exento_pago: string;
  cve_referencia_bancaria: string;
  cadena_pago_dependencia: string;
  cve_banco: string;
  llave_pago: string;
  fec_pago: string;
  imp_pago: number;
}