/**
 * Representa una aduana disponible para el trámite.
 * @interface Aduanas
 */
export interface Aduanas {
  /** Descripción de la aduana */
  descripcion: string;
  /** Identificador único de la aduana */
  id: number;
}
/**
 * Representa un contenedor con tipo e identificador.
 * @interface Contenedores
 */
export interface Contenedores {
  /** Tipo de contenedor */
  tipo: string;
  /** Identificador del contenedor */
  id: string;
}

/**
 * Representa los datos de un contenedor registrado.
 * @interface DatosDelContenedor
 */
export interface DatosDelContenedor {
  /** Identificador único del contenedor */
  id: number;
  /** Iniciales del equipo */
  inicialesEquipo: string;
  /** Número del equipo */
  numeroEquipo: number;
  /** Dígito verificador */
  digitoVerificador: number;
  /** Tipo de equipo */
  tipoEquipo: string;
  /** Identificador de la aduana */
  aduana: number;
  /** Fecha de ingreso */
  fechaIngreso: string;
  /** Vigencia */
  vigencia: string;
  /** Estado de la constancia */
  estadoConstancia: string;
  /** Indica si existe en VUCEM */
  existeEnVUCEM: string;
  /** Identificador de la constancia */
  idConstancia: string;
  /** Número de manifiesto */
  numeroManifiesto: string;
  /** Identificador de la solicitud */
  idSolicitud: string;
  /** Fecha de inicio */
  fechaInicio: string;
}
/**
 * Respuesta de la API para la consulta de un contenedor.
 * @interface RespuestaContenedor
 */
export interface RespuestaContenedor {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Datos del contenedor */
  datos: DatosDelContenedor
  /** Mensaje de la respuesta */
  message: string;
}
/**
 * Respuesta genérica de la API.
 * @interface RespuestaApi
 */
export interface RespuestaApi {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje de la respuesta */
  message: string;
}
/**
 * Respuesta de la API para la consulta de múltiples contenedores.
 * @interface RespuestaContenedores
 */
export interface RespuestaContenedores {
  /** Código de respuesta */
  code: number;
  /** Lista de contenedores */
  data: Contenedores[]
  /** Mensaje de la respuesta */
  message: string;
}
/**
 * Respuesta de la API para la consulta de aduanas.
 * @interface RespuestaAduanas
 */
export interface RespuestaAduanas {
  /** Código de respuesta */
  code: number;
  /** Lista de aduanas */
  data: Aduanas[]
  /** Mensaje de la respuesta */
  message: string;
}

/**
 * Representa los datos del solicitante del trámite.
 * @interface DatosSolicitante
 */
export interface DatosSolicitante {
  /** RFC del solicitante */
  rfc: string;
  /** Denominación o razón social */
  denominacion: string;
  /** Actividad económica */
  actividadEconomica: string;
  /** Correo electrónico */
  correoElectronico: string;
}

/**
 * Representa los datos de modificación de un trámite o contenedor.
 * @interface DatosModificacion
 */
export interface DatosModificacion {
  /** RFC del solicitante */
  rfc: string;
  /** Federal asociado */
  federal: string;
  /** Tipo de trámite o modificación */
  tipo: string;
  /** Programa asociado */
  programa: string;
}

/**
 * Representa los datos de modificación específicos de un servicio o entidad.
 * @interface DatosDelModificacion
 */
export interface DatosDelModificacion {
  /** Identificador único */
  id?: number;
  /** Estado o estatus */
  desEstatus?: string;
  /** Descripción */
  descripcion?: string;
  /** Tipo de servicio */
  tipoDeServicio?: string;
}

/**
 * Representa los datos de un servicio asociado a la modificación.
 * @interface DatosDelServicios
 */
export interface DatosDelServicios {
  /** Identificador único */
  id?: number;
  /** Estado o estatus */
  desEstatus?: string;
  /** Descripción */
  descripcion?: string;
  /** Tipo de servicio */
  tipoDeServicio?: string;
  /** Indicador de testado */
  testado?: string;
}