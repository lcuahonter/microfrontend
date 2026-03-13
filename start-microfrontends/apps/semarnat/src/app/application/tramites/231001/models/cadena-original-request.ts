/**
 * Modelo de solicitud para la cadena original.
 * Define la estructura de los datos necesarios para la cadena original en el trámite.
 */
export interface CadenaOriginalRequest {
  num_folio_tramite: string | null;
  boolean_extranjero: boolean;
  documento_requerido?: DocumentoRequerido[];
  solicitante: Solicitante;
  cve_rol_capturista: string;
  cve_usuario_capturista: string;
  fecha_firma: string;
}

/**
 * Modelo que representa un documento requerido en el trámite.
 * Contiene información sobre el ID del documento seleccionado, su hash y sello.
 */
export interface DocumentoRequerido {
  id_documento_seleccionado: number;
  hash_documento: string;
  sello_documento: string;
}

/**
 * Modelo que representa un solicitante en el trámite.
 * Contiene información sobre el RFC, nombre y si es persona moral.
 */
export interface Solicitante {
  rfc: string;
  nombre: string | null;
  es_persona_moral: boolean;
  certificado_serial_number: string;
}
