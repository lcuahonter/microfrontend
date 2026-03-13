/** Interface para la respuesta del servicio */
export interface EmailModifyResponse {
  /** Código de resultado: positivo para éxito, negativo para error */
  codigo: number;
  /** Mensaje descriptivo del resultado */
  mensaje: string;
  datos?: {
    /** Nuevo correo electrónico */
    correoNuevo: string;
  };
}

/** Interface para los datos del correo */
export interface EmailData {
  /** Correo electrónico anterior */
  currentEmail: string;
  /** Nuevo correo electrónico */
  newEmail: string;
}
