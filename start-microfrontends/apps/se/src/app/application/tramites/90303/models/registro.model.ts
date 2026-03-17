/**
 * Representa un registro de la tabla de sectores activos.
 */
export interface ListaSectoresTabla {
  /**
   * Estado actual del sector (e.g., "Activado").
   */
  descripcionTestado: string;

  /**
   * Clave única que identifica al sector.
   */
  cvSectorCatalogo: string;

  /**
   * Nombre o descripción del sector.
   */
  sector: string;

  /**
   * Clave del sector en el catálogo.
   */
  cveSector?: string;

  /**
   * Indica si el sector es visible o no.
   */
  visible?: boolean;
}

/**
 * Interfaz que representa un registro de bitácora que contiene información sobre modificaciones realizadas.
 * @export
 * @interface Bitacora
 */
export interface Bitacora {
  /**
   * Tipo de modificación realizada.
   * @property {string} tipoModificacion
   */
  tipoModificacion: string;

  /**
   * Fecha en la que se realizó la modificación.
   * @property {string} fechaModificacion
   */
  fechaModificacion: string;

  /**
   * Valores anteriores antes de la modificación.
   * @property {string} valoresAnteriores
   */
  valoresAnteriores: string;

  /**
   * Nuevos valores después de la modificación.
   * @property {string} valoresNuevos
   */
  valoresNuevos: string;
}

/**
 * Interfaz que representa la respuesta de una consulta de bitácora.
 * @export
 * @interface BitacoraRespuesta
 */
export interface BitacoraRespuesta {
  /**
   * Código de estado de la respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de objetos de tipo Bitacora que contiene los datos de la respuesta.
   * @property {Bitacora[]} data
   */
  data: Bitacora[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

/**
 * Interfaz que representa el payload necesario para obtener la lista de sectores activos.
 * @export
 * @interface ListaSectoresRespuesta
 */
export interface ListaSectoresRespuesta {
  /**
   * Identificador de la solicitud.
   * @type {string | number}
   */
  idSolicitud: string | number;

  /**
   * Discriminador del tipo de solicitud.
   * @type {string}
   */
  discriminatorValue: string;

  /** 
   * Registro Federal de Contribuyentes (RFC).
   * @type {string}
   */
  rfc: string;

  /**
   * Folio del programa PROSEC.
   * @type {string}
   */
  folioPrograma: string;

  /** 
   * Tipo de programa PROSEC.
   * @type {string}
   */
  tipoPrograma: string;

  /** 
   * Identificador del programa PROSEC.
   * @type {string}
   */
  idPrograma: string;
}

/**
 * Interfaz que representa el payload necesario para obtener la lista de plantas.
 * @export
 * @interface PlantasRespuesta
 */
export interface PlantasRespuesta {
  /**
   * Identificador de la solicitud.
   * @type {string}
   */
  idSolicitud: string,

  /**
   * Identificador del programa autorizado.
   * @type {string}
   */
  idProgramaAutorizado: string,

  /**
   * Discriminador del tipo de solicitud.
   * @type {string} 
   */
  discriminador: string,

  /**
   * Fecha de PROSEC.
   * @type {number}
   */
  fechaProsec: number,

  /**
   * Identificador de la nueva solicitud.
   * @type {string}
   */
  idSolicitudNueva: string
}

