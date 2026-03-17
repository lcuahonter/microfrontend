/**
 * Modelo de entrada para acciones con observaciones
 */
export interface ObservacionRequest {
  /** ID único de la acción realizada */
  id_accion: string | null;

  /** Clave del usuario que realizó la observación */
  cve_usuario: string | null;

   /** Texto de la observación */
  observacion: string | null;
}

/** Modelo de solicitud para documento oficial
 */
export interface DocumentoOficialRequest{
  /** RFC del usuario que realiza la solicitud */
  rfc?: string;
}

