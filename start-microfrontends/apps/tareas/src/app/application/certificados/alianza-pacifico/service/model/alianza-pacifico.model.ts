/**
 * Modelo de respuesta de la API de Alianza Pacifico
 */
export interface AlianzaPacificoResponse {
  noCertificado: string;
  paisProcedencia: string;
  estadoCod: string;
  estadoReemplazo: string;
  fechaExpedicion: string;
  noTransaccion: string;
  informacionAdicional: string;
  pdfUrl?: string;
  xmlUrl?: string;
}

/**
 * Modelo de parametros de busqueda de la API de Alianza Pacifico
 */
export interface SearchAlianzaPacificoParams {
  noCertificado?: string;
  paisProcedencia?: string;
  estadoCod?: string;
  estadoReemplazo?: string;
  noTransaccion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

/**
 * Modelo de error de la API de Alianza Pacifico
 */
export interface ErrorAlianzaPacifico {
  seccion: string;
  valor: string;
  descripcion: string;
}

/**
 * Modelo de seguimiento de envio de la API de Alianza Pacifico
 */
export interface SeguimientoEnvioAlianzaPacifico {
  fecha: string;
  operacion: string;
  transaccion: string;
  estatus: string;
  observacion: string;
}
