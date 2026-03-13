/**
 * Representa un elemento de la lista de trámites.
 * Incluye una descripción y un identificador único.
 */
export interface TramiteList {
  /** Descripción del trámite. */
  descripcion: string;

  /** Identificador único del trámite. */
  id: number;
}

/**
 * Representa la respuesta de la API relacionada con los trámites.
 * Incluye un código, los datos del trámite y un mensaje adicional.
 */
export interface RespuestaTramite {
  /** Código de estado de la respuesta. */
  code: number;

  /** Lista de trámites obtenida de la API. */
  data: TramiteList[];

  /** Mensaje adicional proporcionado en la respuesta. */
  message: string;
}

/**
 * Representa un contenedor con su tipo e identificador único.
 */
export interface Contenedores {
  /** Tipo del contenedor. */
  tipo: string;

  /** Identificador único del contenedor. */
  id: string;
}

/**
 * Representa la respuesta de la API para un único contenedor.
 * Incluye un indicador de éxito, datos y un mensaje.
 */
export interface RespuestaContenedor {
  /** Indica si la operación fue exitosa. */
  success: boolean;

  /** Datos de la tabla asociados al contenedor. */
  datos: DatosDeLaTabla;

  /** Mensaje adicional proporcionado en la respuesta. */
  message: string;
}

/**
 * Representa la respuesta de la API para una lista de contenedores.
 * Incluye un código, los datos de los contenedores y un mensaje adicional.
 */
export interface RespuestaContenedores {
  /** Código de estado de la respuesta. */
  code: number;

  /** Lista de contenedores obtenida de la API. */
  data: Contenedores[];

  /** Mensaje adicional proporcionado en la respuesta. */
  message: string;
}

/**
 * Representa los datos que se mostrarán en una tabla.
 * Incluye información del trámite y datos relacionados.
 */
export interface DatosDeLaTabla {
  /** Identificador único del registro de la tabla. */
  id: number;

  /** Folio del trámite asociado. */
  folioTramite: string;

  /** Tipo de trámite realizado. */
  tipoTramite: string;

  /** RFC del usuario asociado al trámite. */
  rfc: string;

  /** Razón social asociada al trámite. */
  razonSocial: string;

  /** Estado actual del trámite. */
  estadoDelTramite: string;
}

/**
 * Representa el folio del trámite y su tipo.
 */
export interface FolioTramite {
  /** Folio único del trámite. */
  folioTramite: string;

  /** Tipo de trámite realizado. */
  tipoTramite: string;
}

/**
 * Interfaz que representa los datos para capturar el texto libre.
 * Contiene detalles administrativos, dirección y otros campos relevantes.
 */
export interface CapturarElTextoLibre {
  /** Detalles administrativos, primera sección. */
  detalles_de_administracion_1: string;

  /** Detalles administrativos, segunda sección. */
  detalles_de_administracion_2: string;

  /** Detalles administrativos, tercera sección. */
  detalles_de_administracion_3: string;

  /** Campo para datos relacionados con el exterior. */
  exterior: string;

  /** Campo para datos del oficio. */
  officio: string;

  /** Ubicación en la Ciudad de México. */
  ciudad_de_mexico: string;

  /** Primera dirección proporcionada. */
  direccion_1: string;

  /** Segunda dirección proporcionada. */
  direccion_2: string;

  /** Identificación del texto libre. */
  identificacion: string;
}

/**
 * Representa un catálogo de selección con una lista de elementos.
 * Incluye un código, una lista de elementos y un mensaje adicional.
 */
export interface RequerimientoOpcions {
  /** Código de estado del catálogo. */
  label: string;
  /** Lista de elementos del catálogo. */
  value: number;
}

/**
 * Representa las opciones asociadas a un requerimiento específico.
 */
export interface RequerimientoOpciones {
  /**
   * Estado actual del trámite.
   */
  estadoDelTramite: string;

  /**
   * Folio único que identifica el trámite.
   */
  folioTramite: string;

  /**
   * Identificador único del requerimiento.
   */
  id: number;

  /**
   * Razón social de la entidad asociada al trámite.
   */
  razonSocial: string;

  /**
   * RFC de la entidad o persona relacionada con el trámite.
   */
  rfc: string;

  /**
   * Tipo de trámite que se está gestionando.
   */
  tipoTramite: string;
}

/**
 * Representa un requerimiento con su columna asociada y datos de fila.
 */
export interface Requerimiento {
  /**
   * Nombre o identificador de la columna (usado en visualización o estructura).
   */
  column: string;

  /**
   * Objeto que contiene los datos del requerimiento.
   */
  row: RequerimientoOpciones;
}

/**
 * Representa la forma de captura de información para un requerimiento.
 */
export interface FormaRequerimiento {
  /**
   * Folio del trámite al cual está asociado el requerimiento.
   */
  folioTramite: string;

  /**
   * Tipo de trámite relacionado.
   */
  tipoTramite: string;

  /**
   * Motivo por el cual se realiza una cancelación del requerimiento.
   */
  motivoCancelacion: string;

  /**
   * Tipo específico del requerimiento (por ejemplo, técnico, documental, etc.).
   */
  tipoDeRequerimiento: string;

  /**
   * Identificador numérico del tipo de documento seleccionado.
   *
   * Este valor se utiliza para asociar un documento con su tipo correspondiente
   * dentro del catálogo de tipos de documentos.
   */
  tipoDeDocumento: string | number;

  /**
   * Lista de documentos adicionales asociados.
   */
  documentoAdicional: DocumentoAdicional[];
}

/**
 * Representa un documento adicional relacionado con una solicitud o trámite.
 */
export interface DocumentoAdicional {
  /**
   * Identificador único del documento.
   */
  id?: number;

  /**
   * Tipo de documento asociado (por ejemplo, PDF, JPG, etc.).
   */
  tipoDeDocumento: string | number;
}
