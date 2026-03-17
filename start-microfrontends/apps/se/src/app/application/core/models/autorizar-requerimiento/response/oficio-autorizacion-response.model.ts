/**
 * Modelo de respuesta para documento oficial
 */
export interface DocumentoOficialResponse {

  /** Nombre del documento oficial */
  nombre_archivo?: string;

  /** Llave del archivo en el sistema de almacenamiento (opcional) */
  llave_archivo?: string;
}