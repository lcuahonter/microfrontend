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

