/**
 * Respuesta que contiene la cadena original y la lista de documentos requeridos
 * asociados a un proceso de firma.
 */
export interface CadenaOriginalResponse {
  /** Cadena original utilizada para el proceso de firma. */
  cadena_original: string;

  /** Lista de documentos requeridos para la firma. */
  doc_requeridos: DocRequerido[];
}

/**
 * Representa un documento requerido dentro del proceso de firma.
 */
export interface DocRequerido {
  /** Identificador del documento seleccionado. */
  id_documento_seleccionado: number;

  /** Hash del documento requerido. */
  hash_documento: string;
}
