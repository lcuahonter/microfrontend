/**
 * Representa los datos de una solicitud.
 */
export interface DatosSolicitud {
  /**
   * Identificador único de la solicitud.
   */
  id: number;

  /**
   * Fracción arancelaria asociada a la solicitud.
   */
  fraccionArancelaria: number;

  /**
   * Cantidad del producto en la solicitud.
   */
  cantidad: number;

  /**
   * Cantidad del producto expresada en palabras.
   */
  cantidadLetra: string;

  /**
   * Descripción del producto en la solicitud.
   */
  descripcion: string;
}

/**
 * Representa la respuesta de una solicitud.
 */
export interface RespuestaSolicitud {
  /**
   * Indica si la solicitud fue procesada con éxito.
   */
  success: boolean;

  /**
   * Datos de la solicitud procesada.
   */
  datos: DatosSolicitud;

  /**
   * Mensaje asociado a la respuesta de la solicitud.
   */
  message: string;
}

/**
 * Representa los detalles de una solicitud.
 */
export interface DatosDetalle {
  /**
   * Identificador único del detalle.
   */
  id: number;

  /**
   * Nombre científico del producto.
   */
  nombreCientifico: string;

  /**
   * Nombre común del producto en el detalle.
   */
  nombreComunDetalle: string;

  /**
   * Descripción del detalle.
   */
  descripcion: string;
}

/**
 * Representa la respuesta de un detalle de solicitud.
 */
export interface RespuestaDetalle {
  /**
   * Indica si el detalle fue procesado con éxito.
   */
  success: boolean;

  /**
   * Datos del detalle procesado.
   */
  datos: DatosDetalle;

  /**
   * Mensaje asociado a la respuesta del detalle.
   */
  message: string;
}

/**
 * Representa la información meta asociada a una solicitud.
 */
export interface MetaInfo {
  /**
   * Nacionalidad del solicitante.
   */
  nacionalidad: string;

  /**
   * Tipo de persona (física o moral).
   */
  tipoPersona: string;

  /**
   * Indicador de nacionalidad nacional.
   */
  nacional: string;

  /**
   * Indicador de nacionalidad extranjera.
   */
  extranjero: string;

  /**
   * Denominación o razón social del solicitante.
   */
  denominacion: string;

  /**
   * Nombre del solicitante.
   */
  nombre: string;

  /**
   * Apellido paterno del solicitante.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del solicitante.
   */
  apellidoMaterno: string;

  /**
   * Código postal del domicilio del solicitante.
   */
  codigoPostal: string;

  /**
   * País del solicitante.
   */
  pais: string;

  /**
   * Ciudad del solicitante.
   */
  ciudad: string;

  /**
   * Domicilio del solicitante.
   */
  domicilio: string;
}

/**
 * Representa una respuesta genérica con datos de tipo `T`.
 */
export interface Respuesta<T> {
  /**
   * Indica si la operación fue procesada con éxito.
   */
  success: boolean;

  /**
   * Datos asociados a la respuesta.
   */
  datos: T;

  /**
   * Mensaje asociado a la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa los datos de pago de derechos.
 * @export
 * @interface PageDeDerechosData
 */
export interface PageDeDerechosData {
  /**
   * Clave de referencia del pago.
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada al pago.
   */
  cadenaPagoDependencia: string;

  /**
   * Importe del pago.
   */
  impPago: string;
}