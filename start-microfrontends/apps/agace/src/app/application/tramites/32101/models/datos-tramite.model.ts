import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * Representa una lista de trámites.
 * 
 * @interface TramiteList
 * @property {string} descripcion - Descripción del trámite.
 * @property {number} id - Identificador único del trámite.
 */
export interface TramiteList {
  descripcion: string;
  id: number;
}

/**
 * Representa la respuesta de un trámite.
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
 * Representa la estructura de un contenedor.
 * 
 * @property {string} tipo - El tipo de contenedor.
 * @property {string} id - El identificador único del contenedor.
 */
export interface Contenedores {
  tipo: string;
  id: string;
}

/**
 * Representa la respuesta de un contenedor en una operación.
 * 
 * @property success - Indica si la operación fue exitosa.
 * @property datos - Contiene los datos de la tabla relacionados con la operación.
 * @property message - Mensaje descriptivo sobre el resultado de la operación.
 */
export interface RespuestaContenedor {
  success: boolean;
  datos: DatosDeLaTabla
  message: string;
}

/**
 * Representa la respuesta que contiene información sobre los contenedores.
 * 
 * @property {number} code - Código de estado de la respuesta.
 * @property {Contenedores[]} data - Lista de contenedores incluidos en la respuesta.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 */
export interface RespuestaContenedores {
  code: number;
  data: Contenedores[];
  message: string;
}

/**
 * Representa los datos de una tabla relacionados con un trámite específico.
 * 
 * @interface DatosDeLaTabla
 * 
 * @property {number} id - Identificador único del registro.
 * @property {string} tipoDeInversion - Tipo de inversión asociada al trámite.
 * @property {string} descripcionGeneral - Descripción general del registro.
 * @property {string} formaAdquisicion - Forma en que se adquirió el bien o servicio.
 * @property {number} valorEnPesos - Valor del bien o servicio en pesos mexicanos.
 * @property {string} comprobanteDePago - Comprobante de pago asociado al registro.
 */
export interface DatosDeLaTabla {
  id: number;
  tipoDeInversion: string;
  descripcionGeneral: string;
  formaAdquisicion: string;
  valorEnPesos: number;
  comprobante: string;
}

export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos resultantes de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

export interface ConsultaDatos {
  /**
   * Información sobre exención de impuestos.
   * @type {TecnicaForm}
   */
  solicitudFormulario: SolicitudState;
}

export interface SolicitudState {
  tipoDeInversion?: Catalogo[];
  valorEnPesos?: string;
  descripcionGeneral?: string;
  listaDeDocumentos?: string;
  comprobante?: string;
  manifiesto1?: string;
  manifiesto2?: string;
  manifiesto3?: string;
  claveDeReferencia?: string;
  cadenaDeLaDependencia?: string;
  numeroDeOperacion?: string;
  banco?: Catalogo[] | null;
  llaveDePago?: string;
  fechaInicialInput?: string;
  importeDePago?: string;
}