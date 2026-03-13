/**
 * Modelo de respuesta para documento oficial
 */
export interface DocumentoOficialResponse {

  /** Nombre del documento oficial */
  nombre_archivo?: string;

  /** Llave del archivo en el sistema de almacenamiento (opcional) */
  llave_archivo?: string;
  /** Contenido del documento en formato base64 */
  contenido?: string;
}

export interface OficioAutorizacionResponse {
  llave_archivo: string;
  nombre_archivo: string;
  contenido: string;
}