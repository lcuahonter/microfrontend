/**
 * @interface Aduanas
 * @description Representa la información de una aduana.
 * 
 * @property {string} descripcion - Descripción de la aduana.
 * @property {number} id - Identificador único de la aduana.
 */
export interface Aduanas {
  descripcion: string;
  id: number;
}

/**
 * @interface Contenedores
 * @description Representa la información de un contenedor.
 */
export interface Contenedores {
  tipo: string;
  id: string;
}

/**
 * @interface DatosDelContenedor
 * @description Representa los datos detallados de un contenedor.
 * 
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
  numeroManifiesto: string;
  idSolicitud: string;
  fechaInicio: string;
}

/**
 * @interface GridContenedores
 * @description Representa los datos de un contenedor en formato de tabla.
 * 
 */
export interface GridContenedores {
  id?: number;
  iniciales_contenedor: string;
  numero_contenedor: number;
  digito_verificador?: string;
  digito: number;
  tipo_contenedor: string;
  estado_constancia?: string;
  aduana: number;
  existe_en_vucem?: string;
  puede_registrar?: string;
}

/**
 * @interface RespuestaContenedor
 * @description Representa la respuesta de una consulta sobre un contenedor.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {GridContenedores} datos - Datos del contenedor.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaContenedor {
  success: boolean;
  datos: GridContenedores;
  message: string;
}

/**
 * @interface RespuestaApi
 * @description Representa una respuesta genérica de la API.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaApi {
  success: boolean;
  message: string;
}

/**
 * @interface RespuestaContenedores
 * @description Representa la respuesta de una consulta sobre múltiples contenedores.
 * 
 * @property {number} code - Código de la respuesta.
 * @property {Contenedores[]} data - Lista de contenedores.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaContenedores {
  code: number;
  data: Contenedores[];
  message: string;
}

/**
 * @interface RespuestaAduanas
 * @description Representa la respuesta de una consulta sobre aduanas.
 * 
 * @property {number} code - Código de la respuesta.
 * @property {Aduanas[]} data - Lista de aduanas.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaAduanas {
  code: number;
  data: Aduanas[];
  message: string;
}

/**
 * @interface DatosSolicitante
 * @description Representa los datos del solicitante.
 * 
 * @property {string} rfc - RFC del solicitante.
 * @property {string} denominacion - Denominación del solicitante.
 * @property {string} actividadEconomica - Actividad económica del solicitante.
 * @property {string} correoElectronico - Correo electrónico del solicitante.
 */
export interface DatosSolicitante {
  rfc: string;
  denominacion: string;
  actividadEconomica: string;
  correoElectronico: string;
}

/**
 * @interface RespuestaConsulta
 * @description Representa la respuesta de una consulta realizada en el trámite.
 * 
 * @property {boolean} success - Indica si la consulta fue exitosa.
 * @property {ConsultaDatos} datos - Contiene los datos obtenidos de la consulta.
 * @property {string} message - Mensaje asociado a la respuesta de la consulta.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}

/**
 * @interface ConsultaDatos
 * @description Representa los datos obtenidos de una consulta en el trámite.
 * 
 * @property {string} tipoBusqueda - Tipo de búsqueda realizada.
 * @property {string} aduana - Aduana asociada.
 * @property {string} fechaIngreso - Fecha de ingreso.
 * @property {string} inicialesContenedor - Iniciales del contenedor.
 * @property {string} numeroContenedor - Número del contenedor.
 * @property {string} tipoContenedor - Tipo del contenedor.
 * @property {GridContenedores[]} datosDelContenedor - Lista de datos detallados de los contenedores.
 */
export interface ConsultaDatos {
  tipoBusqueda: string;
  aduana: string;
  fechaIngreso: string;
  inicialesContenedor: string;
  numeroContenedor: string;
  tipoContenedor: string;
  datosDelContenedor: GridContenedores[];
}

/**
 * Interfaz que representa los datos de un csv.
 * Utilizamos esta interfaz para definir la estructura de los datos detallados de un contenedor.
 */
export interface DatosDelCsvArchivo {
  id?: number;
  iniciales_contenedor: string;
  numero_contenedor: number;
  digito_verificador?: string;
  digito: number;
  tipo_contenedor: string;
  estado_constancia?: string;
  aduana: number;
  existe_en_vucem?: string;
  puede_registrar?: string;
}