/**
 * interface para respuesta de consulta de movilizacion
 */
export interface ConsultarMovilizacionResponse {
  id_solicitud: number;
  id_transporte: number;
  ide_medio_transporte: string;
  identificacion_transporte: string;
  id_punto_verificacion: number;
  razon_social: string;
}