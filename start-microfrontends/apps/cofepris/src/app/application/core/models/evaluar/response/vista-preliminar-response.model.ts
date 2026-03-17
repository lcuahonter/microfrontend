export interface VistaPreliminarResponse {
      /** Nombre del documento oficial */
  nombre_archivo: string;

  /** Llave del archivo en el sistema de almacenamiento (opcional) */
  llave_archivo: string;
    /** Contenido del documento en base64 */
  contenido: string;
}