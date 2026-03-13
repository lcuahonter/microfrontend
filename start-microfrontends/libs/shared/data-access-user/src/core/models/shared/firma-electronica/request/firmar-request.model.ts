/**
 * Representa un documento que será firmado electrónicamente.
 */
export interface DocumentoRequeridoFirmar {
  /**
   * Identificador del documento previamente seleccionado para la firma.
   */
  id_documento_seleccionado: number;

  /**
   * Hash del contenido del documento, usado para garantizar la integridad del archivo.
   */
  hash_documento: string;

  /**
   * Sello digital generado tras la firma del documento.
   */
  sello_documento: string;
}

/**
 * Estructura del cuerpo de la solicitud para realizar la firma electrónica de un trámite.
 */
export interface FirmarRequest {
  /**
   * Identificador único de la solicitud a firmar.
   */
  id_solicitud?: number;

  /**
   * Cadena original generada a partir de los datos del trámite. Es la base para la firma electrónica.
   */
  cadena_original: string;

  /**
   * Número de serie del certificado digital con el que se realizó la firma.
   */
  cert_serial_number: string;

  /**
   * Clave del usuario que realiza la firma.
   */
  clave_usuario: string;

  /**
   * Fecha en la que se realiza la firma (formato ISO o YYYY-MM-DD).
   */
  fecha_firma: string;

  /**
   * Clave del rol del usuario firmante.
   */
  clave_rol: string;

  /**
   * Cadena de la firma electrónica generada (sello digital) en base64.
   */
  sello: string;

  /**
   * Fecha de vencimiento del certificado digital utilizado en la firma.
   */
  fecha_fin_vigencia: string;

  /**
   * Lista de documentos firmados con su respectivo hash y sello.
   */
  documentos_requeridos: DocumentoRequeridoFirmar[];
  rfcSolicitante?: string;
  rfc_solicitante?: string;
  id_mecanismo?:number;
}

/**
 * Payload para la firma electrónica.
 */
export interface FielPayload {
  certificate: string;
  privateKey: string;
  password: string;
  rfc: string;
}

