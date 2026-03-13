/**
 * Modelo para guardar el requerimiento
 */
export interface GuardarRequerimiento {
  /**
   * Clave del usuario que realiza la acción dentro del sistema.
   */
  cve_usuario: string;

  /**
   * Identificador de la acción que se ejecutará.
   * Este ID determina el tipo de operación relacionada al requerimiento.
   */
  id_accion: string;

  /**
   * Justificación que explica la razón por la cual se genera el requerimiento.
   */
  justificacion: string;

  /**
   * Motivo específico del requerimiento.
   * Este campo es opcional y depende del flujo del trámite.
   */
  motivo?: string;

  /**
   * Fundamento legal, normativo o administrativo que respalda el requerimiento.
   * Puede no ser obligatorio según el tipo de trámite.
   */
  fundamento?: string;

  /**
   * Siglas del participante externo involucrado en la solicitud o trámite.
   */
  siglas_participante_externo?: string;

  /**
   * Identificador del motivo asociado al tipo de trámite.
   * Se utiliza para clasificar el requerimiento según reglas del proceso.
   */
  id_motivo_tipo_tramite?: number;

  /**
   * Lista de documentos relacionados que se deben incluir o validar
   * para generar el requerimiento.
   */
  documentos?: Documento[];

  /**
   * Lista de identificadores de documentos específicos requeridos.
   * Útil cuando solo se necesita el ID y no el detalle del documento.
   */
  documentos_especificos?: number[];

  /**
   * Descripción detallada del alcance del requerimiento,
   * especificando el objetivo o lo que se solicita al usuario.
   */
  alcance_requerimiento?: string;

  /**
   * Áreas involucradas en el requerimiento.
   */
  areas?: string[];

  id_tipo_requerimiento?: string;
}

/**
 * Representa un documento asociado a un requerimiento o solicitud.
 */
export interface Documento {
  /**
   * Identificador del documento dentro de la solicitud.
   */
  id_documento_solicitud: number;

  /**
   * Identificador del documento.
   */
  id_documento: number;

  /**
   * Nombre del documento.
   */
  nombre: string;

  /**
   * Identificador del tipo de documento.
   */
  id_tipo_documento: number;

  /**
   * Descripción del tipo de documento.
   */
  tipo_documento: string;

  /**
   * Estado del documento en la solicitud.
   */
  estado_documento_solicitud: string;

  /**
   * Indica si el documento es obligatorio para el requerimiento.
   */
  requerido: boolean;

  /**
   * Identificador del documento en el requerimiento.
   */
  id_documento_requerimiento: number;

  /**
   * Identificador externo del documento.
   */
  id_e_document: string;
}
