/**
 * Representa un trámite individual con su descripción e identificador.
 */
export interface TramiteList {
  /** Descripción del trámite */
  descripcion: string;

  /** Identificador único del trámite */
  id: number;
}

/**
 * Estructura de respuesta de un servicio que devuelve una lista de trámites.
 */
export interface RespuestaTramite {
  /** Código de respuesta del backend */
  code: number;

  /** Arreglo de trámites devueltos */
  data: TramiteList[];

  /** Mensaje descriptivo de la respuesta */
  message: string;
}

/**
 * Representa un contenedor con su tipo e identificador.
 */
export interface Contenedores {
  /** Tipo del contenedor */
  tipo: string;

  /** Identificador único del contenedor */
  id: string;
}

/**
 * Estructura de respuesta al solicitar un único contenedor con datos de tabla.
 */
export interface RespuestaContenedor {
  /** Indica si la operación fue exitosa */
  success: boolean;

  /** Datos asociados al contenedor */
  datos: DatosDeLaTabla;

  /** Mensaje de respuesta */
  message: string;
}

/**
 * Estructura de respuesta al solicitar múltiples contenedores.
 */
export interface RespuestaContenedores {
  /** Código de respuesta del backend */
  code: number;

  /** Lista de contenedores */
  data: Contenedores[];

  /** Mensaje descriptivo de la respuesta */
  message: string;
}

/**
 * Representa una fila de datos mostrada en la tabla de trámites.
 */
export interface DatosDeLaTabla {
  /** Identificador del registro */
  id: number;

  /** Folio del trámite */
  folioTramite: string;

  /** Tipo de trámite */
  tipoTramite: string;

  /** RFC del contribuyente */
  rfc: string;

  /** Razón social del contribuyente */
  razonSocial: string;

  /** Estado actual del trámite (numérico) */
  estadoDelTramite: number;
}

/**
 * Modelo utilizado para representar un requerimiento o cancelación de trámite.
 */
export interface FormaRequerimiento {
  /** Folio del trámite */
  folioTramite: string;

  /** Tipo de trámite */
  tipoTramite: string;

  /** Motivo de la cancelación */
  motivoCancelacion: string;

  /** Tipo de requerimiento (por ejemplo, 'documento', 'información', etc.) */
  tipoDeRequerimiento: string;
}


export interface FolioTramite {
  /** Folio único del trámite. */
  folioTramite: string;

  /** Tipo de trámite realizado. */
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
 * Representa las opciones asociadas a un requerimiento específico.
 */
export interface RequerimientoOpciones {
  /**
   * Estado actual del trámite.
   */
  estadoDelTramite: number;

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