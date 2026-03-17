/**
 * Interfaz que representa la respuesta de la API.
 * Contiene un arreglo de objetos de tipo `CertificadoData` en la propiedad `datos`.
 */
export interface ApiResponse {
  datos: CertificadoData[];
}

/**
 * Interfaz que define la estructura de los datos de un certificado.
 * Incluye información general, detalles del tratado, país asociado,
 * transporte, puertos, observaciones y las mercancías relacionadas.
 */
export interface CertificadoData {
  numeroCertificado: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  tratadoAsociado: TratadoAsociado;
  paisAsociado: PaisAsociado;
  cvePaisFabricacion: string;
  solicitud: SolicitudData;
  medioTransporte: string;
  rutaCompleta: string,
  puertoEmbarque:string,
  puertoDesembarque: string,
  precisa: string;
  presenta: string;
  observaciones: string;
  mercanciasAsociadas: MercanciaAsociada[];
}

/**
 * Interfaz que representa la información del tratado asociado a un certificado.
 * Contiene el nombre del tratado comercial o acuerdo correspondiente.
 */
export interface TratadoAsociado {
  nombre: string;
}

/**
 * Interfaz que representa la información del país asociado al certificado.
 * Contiene el nombre del país relacionado con el tratado o la exportación.
 */
export interface PaisAsociado {
  nombre: string;
}

/**
 * Interfaz que define los datos de la solicitud asociada al certificado.
 * Incluye el país de destino y la información de la persona que realiza la solicitud.
 */
export interface SolicitudData {
  paisDestino: string;
  personaSolicitud: PersonaSolicitud;
}

/**
 * Interfaz que representa los datos de la persona que realiza la solicitud.
 * Contiene información personal, fiscal, de contacto y domicilio asociado.
 */
export interface PersonaSolicitud {
  nombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  numeroIdentificacionFiscal: string;
  razonSocial: string;
  correoElectronico: string;
  domicilio: Domicilio;
}

/**
 * Interfaz que define la estructura del domicilio de una persona o entidad.
 * Incluye información de dirección, ciudad y medios de contacto.
 */
export interface Domicilio {
  calle: string;
  letra: string;
  ciudad: string;
  fax: string;
  telefono: string;
}

/**
 * Interfaz que representa la información de una mercancía asociada al certificado.
 * Contiene datos técnicos, comerciales, de valor, cantidad, peso y factura.
 */
export interface MercanciaAsociada {
  numeroOrden: string;
  fraccionArancelaria: string;
  nombreTecnico: string;
  nombreComercial: string;
  nombreIngles: string;
  numeroRegistro: string;
  complementoDescripcion: string;
  marca: string;
  valorMercancia: string;
  cantidad: string;
  unidadMedidaComercial: string;
  masaBruta: string;
  unidadMedidaMasaBruta: string;
  numeroFactura: string;
  tipoFactura: string;
  fechaFactura: string;
}

/**
 * Interfaz que define la estructura de una fila de la tabla de certificados.
 * Incluye el número de certificado, la fecha de expedición y la fecha de vencimiento.
 */
export interface TablaRow {
  numeroDeCertificado: string;
  expedicion: string;
  vencimiento: string;
}

/**
 * Interfaz que define la estructura del payload utilizado para realizar una búsqueda.
 * Contiene el número de certificado y el RFC del solicitante como criterios de búsqueda.
 */
export interface BusquedaPayload {
  numeroCertificado: string;
  rfcSolicitante: string;
}