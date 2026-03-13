/**
 * Request para firmar un requerimiento.
 * Contiene la información de la firma electrónica, el usuario que la realiza 
 * y metadatos relacionados con la acción.
 */
export interface FirmarRequerimientoRequest {
  /**
   * Objeto con los datos de la firma electrónica.
   */
  firma: Firma;

  /**
   * Clave del usuario que realiza la firma.
   */
  cve_usuario: string;

  /**
   * Indica si se requiere la autorización de un usuario autorizador adicional.
   */
  requiere_autorizador: boolean;

  /**
   * Identificador de la acción que se está ejecutando 
   * (ejemplo: aprobar, rechazar, firmar, etc.).
   */
  id_accion: string;
}

/**
 * Información de la firma electrónica aplicada al requerimiento.
 */
export interface Firma {
  /**
   * Cadena original que se firmó electrónicamente.
   */
  cadena_original: string;

  /**
   * Número de serie del certificado digital utilizado para la firma.
   */
  cert_serial_number: string;

  /**
   * Clave del usuario que generó la firma.
   */
  clave_usuario: string;

  /**
   * Fecha en que se realizó la firma en formato ISO (ejemplo: "2025-09-02T12:34:56Z").
   */
  fecha_firma: string;

  /**
   * Rol del usuario que realiza la firma (ejemplo: "ADMIN", "VALIDADOR").
   */
  clave_rol: string;

  /**
   * Sello digital generado a partir de la cadena original.
   */
  sello: string;
}
