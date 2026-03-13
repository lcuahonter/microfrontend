import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * Representa una lista de trámites.
 */
export interface TramiteList {
  /**
   * Descripción del trámite.
   */
  descripcion: string;

  /**
   * Identificador único del trámite.
   */
  id: number;
}

/**
 * @interface RespuestaTramite
 * @description Representa la respuesta de un trámite en el sistema.
 * 
 * @property {number} code - Código de estado de la respuesta.
 * @property {TramiteList[]} data - Lista de trámites asociados a la respuesta.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 */
export interface RespuestaTramite {
  code: number;
  data: TramiteList[]
  message: string;
}

/**
 * @interface Contenedores
 * @description Representa un contenedor en el sistema.
 * 
 * @property {string} tipo - Tipo de contenedor.
 * @property {string} id - Identificador único del contenedor.
 */
export interface Contenedores {
  tipo: string;
  id: string;
}

/**
 * @interface RespuestaContenedor
 * @description Representa la respuesta de un contenedor en el sistema.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {DatosDeLaTabla} datos - Datos asociados al contenedor.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 */
export interface RespuestaContenedor {
  success: boolean;
  datos: DatosDeLaTabla;
  message: string;
}

/**
 * @interface RespuestaContenedores
 * @description Representa la respuesta de múltiples contenedores en el sistema.
 * 
 * @property {number} code - Código de estado de la respuesta.
 * @property {Contenedores[]} data - Lista de contenedores asociados a la respuesta.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 */
export interface RespuestaContenedores {
  code: number;
  data: Contenedores[];
  message: string;
}

/**
 * @interface DatosDeLaTabla
 * @description Representa los datos de una tabla en el sistema.
 * 
 * @property {number} id - Identificador único de la tabla.
 * @property {string} folioDePrograma - Folio del programa asociado.
 * @property {string} tipoDePrograma - Tipo de programa asociado.
 */
export interface DatosDeLaTabla {
  id: number;
  folioDePrograma: string;
  tipoDePrograma: string;
}

export interface RespuestTablaDatos {
  code: number;
  data: DatosDeLaTabla[];
  message: string;
}
/**
 * Representa la respuesta de una consulta de datos.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}

/**
 * Representa los datos obtenidos de una consulta.
 */
export interface ConsultaDatos {
  /**
   * Lista de actividades productivas asociadas a la consulta.
   */
  actividadProductiva: Catalogo[] | null;

  /**
   * Fecha de inicio del trámite.
   */
  fechaInicio: string;

  /**
   * Fecha de vigencia del trámite.
   */
  fechaVigencia: string;

  /**
   * Estado de certificación.
   */
  certificion: string;
}

/**
   * Carga los datos de certificación desde el servicio y actualiza el formulario reactivo con los valores obtenidos.
   */
export interface DatosCertificacion {
  certificion: string;
  fechaInicio: string;
  fechaVigencia: string;
}

/**
 * Representa los datos de una fracción sensible.
 */
export interface FraccionSensible {
  id?: number;
  fraccionArancelariaExportacion?: number;
  cantidad?: number;
  valor?: number;
  unidadMedidaTarifaria?: string;
}