export interface ResultadoSolicitud {
  /**
   * Indica si la solicitud fue exitosa.
   */
  exito: boolean;

  /**
   * Mensaje de error o éxito de la solicitud.
   */
  mensaje?: string;

  /**
   * Errores del modelo, si los hay.
   */
  erroresModelo?: { campo: string; errores: string[] }[];
}