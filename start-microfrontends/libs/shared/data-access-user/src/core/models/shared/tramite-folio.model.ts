/**
 * Modelo de respuesta para el folio de un trámite.
 * Este modelo define la estructura de la respuesta que se espera al generar un folio para un trámite.
 * * @property {string} code - Código de respuesta del servicio.
 * * @property {string} message - Mensaje de respuesta del servicio.
 * * @property {string} datos - Datos del trámite, que generalmente contiene el folio generado.
 */
export interface TramiteFolioResponse {
    code: string;
    message: string;
    datos: string;
}

/*
    * Modelo que representa el detalle de un trámite, incluyendo información sobre la resolución asociada.
*/
export interface Resolucion {
  id_resolucion: number;
  sentido_resolucion: string;
  descripcion: string | null;
  fecha_inicio_vigencia: string;
  fecha_fin_vigencia: string;
  fecha_resolucion: string;
  estado_resolucion: string;
  num_folio_tramite: string;
  numero_folio_resolucion: string | null;
  cve_folio_caat: string | null;
  fec_renovacion: string | null;
  num_folio_tramite_original: string | null;
  id_resolucion_original: number | null;
  documento: string | null;
  id_dictamen: number | null;
}

/**
 * Modelo que representa el detalle completo de un trámite.
 */
export interface TramiteDetalle {
  num_folio_tramite: string;
  fec_ini_tramite: string;
  fec_fin_tramite: string;
  fecha_recepcion: string;
  fec_cal_transcurridos: string;
  fec_estatus: string;
  ide_est_tramite: string;
  estado_tramite: string;
  id_solicitud: number;
  justificacion: string | null;
  entrega_fisica_procesada: string | null;
  envio_documentum_procesado: string | null;
  requerimiento: any | null;
  resolucion: Resolucion | null;
  requerimiento_complementario: any | null;
  opinion: any | null;
  solicitud_requerimiento: any | null;
  dictamen_interno: any | null;
  dictamen_secundario: any | null;
}

/**
 * Modelo de respuesta para guardar una resolución.
 */
export interface GuardarResolucionResponse {
    llave_archivo: string;
}