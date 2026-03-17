/**
 * Modelo de parametros de busqueda para Certificado de Origen
 */
export interface SearchOrigenParams {
  rfc: string;
  noCertificado?: string;
  noAcuse?: string;
  // Criterios específicos
  estadoCertificado?: string;
  tratadoAcuerdo?: string;
  paisBloque?: string;
  fechaInicial?: string;
  fechaFinal?: string;
}

/**
 * Modelo de respuesta para Certificado de Origen
 */
export interface OrigenResponse {
  folioTramite: string;
  noCertificado: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  paisBloque: string;
  tratadoAcuerdo: string;
  estadoCertificado: string;
  idiomaCertificado: string;
}
