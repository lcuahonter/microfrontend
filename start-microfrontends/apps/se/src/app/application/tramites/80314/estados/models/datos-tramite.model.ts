/**
 * Representa una aduana con su descripción y su identificador único.
 *
 * @property {string} descripcion - La descripción de la aduana.
 * @property {number} id - El identificador único de la aduana.
 */
export interface Aduanas {
  descripcion: string;
  id: number;
}
/**
 * Interfaz que representa los datos de un contenedor.
 *
 * @property {string} tipo - El tipo de contenedor.
 * @property {string} id - El identificador único del contenedor.
 */
export interface Contenedores {
  tipo: string;
  id: string;
}

/**
 * Representa los datos de un contenedor en el sistema.
 *
 * @interface DatosDelContenedor
 * @property {number} id - Identificador único del contenedor.
 * @property {string} inicialesEquipo - Iniciales del equipo asociado al contenedor.
 * @property {number} numeroEquipo - Número del equipo asociado al contenedor.
 * @property {number} digitoVerificador - Dígito verificador del equipo.
 * @property {string} tipoEquipo - Tipo de equipo asociado al contenedor.
 * @property {number} aduana - Código de la aduana asociada al contenedor.
 * @property {string} fechaIngreso - Fecha de ingreso del contenedor al sistema (formato ISO 8601).
 * @property {string} vigencia - Vigencia del contenedor (formato ISO 8601).
 * @property {string} estadoConstancia - Estado de la constancia asociada al contenedor.
 * @property {string} existeEnVUCEM - Indica si el contenedor existe en el sistema VUCEM.
 * @property {string} idConstancia - Identificador único de la constancia asociada al contenedor.
 * @property {string} numeroManifiesto - Número del manifiesto asociado al contenedor.
 * @property {string} idSolicitud - Identificador único de la solicitud asociada al contenedor.
 * @property {string} fechaInicio - Fecha de inicio del trámite asociado al contenedor (formato ISO 8601).
 */
export interface DatosDelContenedor {
  id: number;
  inicialesEquipo: string;
  numeroEquipo: number;
  digitoVerificador: number;
  tipoEquipo: string;
  aduana: number;
  fechaIngreso: string;
  vigencia: string;
  estadoConstancia: string;
  existeEnVUCEM: string;
  idConstancia: string;
  numeroManifiesto: string;
  idSolicitud: string;
  fechaInicio: string;
}
/**
 * Representa la respuesta de un contenedor en una operación.
 *
 * @interface RespuestaContenedor
 *
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {DatosDelContenedor} datos - Contiene los datos específicos del contenedor.
 * @property {string} message - Mensaje descriptivo relacionado con el resultado de la operación.
 */
export interface RespuestaContenedor {
  success: boolean;
  datos: DatosDelContenedor;
  message: string;
}
/**
 * Interfaz que representa la estructura de la respuesta de una API.
 *
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 */
export interface RespuestaApi {
  success: boolean;
  message: string;
}
/**
 * Representa la respuesta de la API para contenedores.
 *
 * @property {number} code - Código de respuesta de la API.
 * @property {Contenedores[]} data - Lista de contenedores devueltos por la API.
 * @property {string} message - Mensaje asociado a la respuesta de la API.
 */
export interface RespuestaContenedores {
  code: number;
  data: Contenedores[];
  message: string;
}

/**
 * Representa la respuesta de la API para aduanas.
 *
 * @property {number} code - Código de respuesta de la API.
 * @property {Aduanas[]} data - Lista de aduanas devueltas por la API.
 * @property {string} message - Mensaje asociado a la respuesta de la API.
 */
export interface RespuestaAduanas {
  code: number;
  data: Aduanas[];
  message: string;
}

/**
 * Representa los datos del solicitante en un trámite.
 *
 * @property {string} rfc - Registro Federal de Contribuyentes del solicitante.
 * @property {string} denominacion - Nombre o razón social del solicitante.
 * @property {string} actividadEconomica - Actividad económica principal del solicitante.
 * @property {string} correoElectronico - Dirección de correo electrónico del solicitante.
 */
export interface DatosSolicitante {
  rfc: string;
  denominacion: string;
  actividadEconomica: string;
  correoElectronico: string;
}

/**
 * Representa los datos de modificación de un trámite.
 *
 * @property {string} rfc - El Registro Federal de Contribuyentes asociado al trámite.
 * @property {string} federal - Información federal relacionada con el trámite.
 * @property {string} tipo - El tipo de trámite que se está modificando.
 * @property {string} programa - El programa asociado al trámite.
 * @property {string} actividadProductivaActual - La actividad productiva actual del solicitante.
 */
export interface DatosModificacion {
  rfc: string;
  federal: string;
  tipo: string;
  programa: string;
  actividadProductivaActual: string;
  actividadProductiva?: string;
}

/**
 * Interfaz que representa los datos de la modificación.
 */
export interface DatosDelModificacion {
  /**
   * Identificador único de la modificación.
   */
  id?: number;

  /**
   * Descripción del estatus de la modificación.
   */
  desEstatus?: string;

  /**
   * Descripción general de la modificación.
   */
  descripcion?: string;

  /**
   * Tipo de servicio relacionado con la modificación.
   */
  tipoDeServicio?: string;
}

/**
 * Interfaz que representa los datos de los servicios.
 */
export interface DatosDelServicios {
  /**
   * Identificador único del servicio.
   */
  id?: number;

  /**
   * Descripción del estatus del servicio.
   */
  desEstatus?: string;

  /**
   * Descripción general del servicio.
   */
  descripcion?: string;

  /**
   * Tipo de servicio proporcionado.
   */
  tipoDeServicio?: string;

  /**
   * Estado del servicio.
   */
  testado?: string;
}
