/**
 * Representa un documento requerido para el trámite.
 */
export interface DocumentoRequerido {
  /**
   * Nombre del documento.
   */
  nombre: string;

  /**
   * Identificador del documento (clave única).
   */
  id: string;

  /**
   * Identificador del documento seleccionado por el usuario.
   */
  id_documento_seleccionado: number;

  /**
   * Identificador del tipo de documento.
   */
  id_tipo_Documento: string;

  /**
   * Hash del documento, utilizado para validación de integridad.
   */
  hash_documento: string;

  /**
   * Sello digital del documento (opcional).
   */
  sello_documento?: string;

  /**
   * Clave de la persona a la que pertenece el documento.
   */
  cve_persona: number;

  /**
   * Indica si el documento está vinculado a una regla.
   */
  regla_anexada: boolean;

  /**
   * Número de anexo del documento.
   */
  num_anexo_documento: string;
}

/**
 * Representa los datos del solicitante del trámite.
 */
export interface Solicitante {
  /**
   * Identificador del domicilio del solicitante.
   */
  id_domicilio: number;

  /**
   * Nombre(s) del solicitante.
   */
  nombre: string;

  /**
   * Apellido paterno del solicitante.
   */
  apellido_paterno: string;

  /**
   * Apellido materno del solicitante.
   */
  apellido_materno: string;

  /**
   * Razón social (en caso de persona moral).
   */
  razon_social: string;

  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * CURP del solicitante.
   */
  curp: string;

  /**
   * Clave de usuario en el sistema.
   */
  cve_usuario: string;

  /**
   * Descripción del giro o actividad del solicitante.
   */
  descripcion_giro: string;

  /**
   * Número de identificación fiscal (NIF) del solicitante (cuando aplique).
   */
  numero_identificacion_fiscal: string;

  /**
   * Número de Seguro Social del solicitante.
   */
  nss: string;

  /**
   * Correo electrónico del solicitante.
   */
  correo_electronico: string;
}

/**
 * Representa la estructura de datos necesaria para generar la cadena original de firma.
 */
export interface CadenaOriginalRequest {
  /**
   * Identificador único de la solicitud.
   */
  id_solicitud: number;

  /**
   * Folio del trámite relacionado con la solicitud.
   */
  num_folio_tramite: string;

  /**
   * Indica si el solicitante es extranjero (opcional).
   */
  boolean_extranjero?: boolean;

  /**
   * Lista de documentos requeridos asociados al trámite.
   */
  documento_requerido: DocumentoRequerido[];

  /**
   * Datos del solicitante que firma la solicitud.
   */
  solicitante: Solicitante;

  /**
   * Clave del rol del usuario capturista.
   */
  cve_rol_capturista: string;

  /**
   * Clave de usuario del capturista.
   */
  cve_usuario_capturista: string;

  /**
   * Fecha en que se realizó la firma (formato ISO o YYYY-MM-DD).
   */
  fecha_firma: string;
}
/**
 * Representa la cadena original generada y su firma digital opcional.
 */
export interface CadenaOriginalGenerada {
  /**
   * Cadena original generada a partir de los datos de la solicitud.
   */
  cadenaOriginal: string;

  /**
   * Firma digital de la cadena original (opcional).
   */
  firmaDigital?: string;
}