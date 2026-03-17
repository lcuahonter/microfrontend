/**
 * Interfaz que representa una lista de pasos en un asistente.
 * 
 */
export interface ListaPasosWizard {
  /**
 * @property {number} indice - El índice del paso en el asistente.
 */
  indice: number;
  /**
 * @property {string} titulo - El título del paso.
 */
  titulo: string;
  /**
 * @property {boolean} activo - Indica si el paso está activo.
 */
  activo: boolean;
  /**
 * Interfaz que representa una lista de pasos en un asistente.
 * 
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */
  completado: boolean;
}
/**
 * Representa los datos generales de una mercancía.
 * 
 * Contiene información detallada como la fracción arancelaria, descripción, cantidades, unidades de medida,
 * nombres comunes y científicos, uso, país de origen, marcas distintivas, número y empaques.
 */
export interface DatosGenerales {
  id: number;
  fraccionArancelaria: string;
  descdelaFraccion: string;
  entidadFederativadeOrigen:string
  cantidadUMT: string;
  UMT: string;
  cantidadUMC: string;
  UMC: string;
  UMCLabel: string;
  descripcionProducto: string;
  nombreComun: string;
  nombreComunLabel: string;
  nombreCientifico: string;
  nombreCientificoLabel: string;
  USO: string;
  USOlabel: string;
  paisdeOrigen: string;
  paisdeOrigenLabel: string;
  marcasDistintivas: string;
  numero: string;
  empaques: string;
  empaquesLabel: string;
origenes?: TablaMercancia[];
}
/**
 * Representa la información de un destinatario.
 * 
 * Contiene los datos básicos de un destinatario, como su identificación, nombre o razón social,
 * teléfono, correo electrónico, domicilio y país.
 */
export interface Destinatario {
  id: number;
  nombreDenominacionORazonSocial: string;
  telefono: string;
  correoElectronico: string;
  domicilio: string | undefined;
  pais: string | undefined;
  paisLabel: string | undefined;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  lada?: string;
}

/**
 * Representa la respuesta de una consulta de destinatarios.
 * 
 * Contiene una lista de destinatarios obtenidos como resultado de una consulta.
 */
export interface DestinatarioRespuesta {
  datos: Destinatario[];
}
/**
 * Representa la información de una mercancía en la tabla.
 * 
 * Contiene datos básicos como el identificador, la entidad federativa de origen y el municipio de origen.
 */
export interface TablaMercancia {
  id: number;
  federativaOrigen: string;
  federativaOrigenLabel: string
  origen: string;
  origenLabel: string;
}

/**
 * Respuesta del servicio de fracción arancelaria.
 * Contiene el estado de la operación y los datos asociados.
 */
export interface FraccionResponse {
   codigo: string;
  mensaje: string;
  datos: DatosFraccion;
}

export interface CommonGet<T> {
  codigo: string;
  mensaje: string;
  datos: T;
}

export interface DatosDeChoresIniciarData {
  clave_referencia: string;
  importe_pago:number ;
}

/**
 * Información detallada de la fracción arancelaria.
 */
export interface DatosFraccion {
  valida: boolean;
  id_fraccion_gubernamental: number;
  descripcion: string;
  umt_clave: string;
  umt_descripcion: string;
}

