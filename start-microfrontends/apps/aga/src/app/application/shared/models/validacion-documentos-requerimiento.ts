/**
 * Define el estado de validación de las tablas de documentos
 * asociadas a un requerimiento.
 */
export interface ValidacionDocumentosRequerimiento {
  /** Indica si la tabla de documentos de requerimiento es válida. */
  TablaDocumentosRequeridos: boolean;

  /** Indica si la tabla de documentos adicionales es válida. */
  TablaDocumentosAdicionales: boolean;
}
