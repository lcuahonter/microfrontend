// HOUSE: TIMPV.HS
// MASTER: TIMPV.MS
// MANIFEST: TIMPV.MN
export enum TypeDocument {
  house = 'TIMPV.HS',
  master = 'TIMPV.MS',
  manifest = 'TIMPV.MN',
}

export enum TypeCode {
  caat = 'CAAT',
  iata = 'IATA',
}

export type TypeDocumentState = 'ESTMPV.ER' | 'ESTMPV.VL' | 'ESTMPV.BJ' | 'ESTMPV.MN';

export enum SearchBy {
  date = 'date',
  document = 'document',
}

export interface AirConsultsResponse {
  codigo: string;
  mensaje: string;
  datos: Data;
}

export interface Data {
  page: number;
  totalPage: number;
  totalRecords: number;
  totalToLoad: number;
  consultaMensajeGrids: MessageConsultGrid[];
}

export interface MessageConsultGrid {
  tipoDocumentoTransporte: string;
  tipoMovimiento: string;
  tipoOperacion: string;
  estadoMensaje: string;
  caat: string;
  nombreCaat: string;
  idReferencia: string;
  numDocumentoTransporte: string;
  estatus: string;
  fechaMensaje: string;
  fechaValidacion: string;
  aduanaDespacho: string;
  aduanaTransbordo: string;
  idHeader: string;
}

export interface DetailMessageResponse {
  codigo: string;
  mensaje: string;
  datos: DetailMessage;
}

export interface DetailMessage {
  datosGeneralesDocumento: GeneralDataDocument;
  detalleDocumento: DocumentDetail;
  detalleGuiaAerea: string;
  totales: Totals;
  informacionDocumentoTranspote: string;
  manifiestoAereo: string;
}

export interface GeneralDataDocument {
  nombreMensaje: string;
  tipoMovimiento: string;
  fechaHoraMensaje: string;
  idReferencia: string;
  caat: string;
  nombreCaat: string;
  fechaHoraValidacion: string;
}

export interface DocumentDetail {
  documentoTransporte: string;
  documentoGuiaMaster: string;
  codigoLugarOrigen: string;
  lugarOrigen: string;
  codigoLugarDestino: string;
  lugarDestino: string;
  detalleTercerosRelacionados: string;
  detalleMedioTransporte: string;
  informacionManiobras: string;
  informacionComplementaria: string;
  monedaOrigen: string;
  monedaDestino: string;
}

export interface Totals {
  numTotalPiezas: string;
  descripcionMercancia: string;
  pesoTotalBruto: string;
  totalVolumen: string;
  sinValorDeclaradoTransporte: string;
  valorDeclaradoTransporte: string;
  sinValorDeclaradoAduana: string;
  valorDeclaradoAduana: string;
  sinValorDeclaradoSeguro: string;
  importeSeguro: string;
  cargosPeso: string;
  valorCarga: string;
  importeImpuestos: string;
  totalOtrosCargosAgente: string;
  totalOtrosCargosTransporte: string;
  cargosTotales: string;
  fechaContrato: string;
  lugarContrato: string;
  firmaTransportista: string;
}

export interface ThirdPartyDetailsReponse {
  codigo: string;
  mensaje: string;
  datos: Person[];
}

export interface Person {
  idPersona: number;
  descripcion: string;
  nombre: string;
  apartado: string;
  calle: string;
  numero: string;
  codigoPostal: string;
  nombreCiudad: string;
  nombrePais: string;
  rfc: string;
  caat: string;
}

export interface MeansTransportationResponse {
  codigo: string;
  mensaje: string;
  datos: Transportation[];
}

export interface Transportation {
  numeroVuelo: string;
  nombreLugarProgramadoDespegue: string;
  fechaHoraSalida: string;
  nombreLugarProgramadoArribo: string;
  fechaHoraProgramadaArribo: string;
}

export interface MovementsResponse {
  codigo: string;
  mensaje: string;
  datos: Move[];
}

export interface Move {
  codigoServicio: string;
  descripcionServicio: string;
}
export interface ComplementInfoResponse {
  codigo: string;
  mensaje: string;
  datos: Info[];
}

export interface Info {
  regimen: string;
  tipo: string;
  descripcion: string;
}

export interface GuidesResponse {
  codigo: string;
  mensaje: string;
  datos: Guides[];
}

export interface Guides {
  idHeader: string;
  noDocumentoTransporte: string;
  codigoTipoEnvio: string;
  numeroPiezas: string;
  pesoBruto: string;
  volumen: string;
  lugarOrigenCodigo: string;
  lugarOrigen: string;
  lugarDestinoCodgio: string;
  lugarDestino: string;
  descripcionMercancia: string;
}

export interface ContactsResponse {
  codigo: string;
  mensaje: string;
  datos: Contact[];
}

export interface Contact {
  nombreContacto: string;
  telefono: string;
  fax: string;
  correoElectronico: string;
  telex: string;
}

export interface ParamsMessages {
  aduanaDespacho: string;
  aduanaTransbordo: string;
  buscarPor: string;
  cveCodigo: string;
  estadoDocumento: string;
  fecha: string;
  numeroManifiestoGuia: string;
  otroCodigo: string;
  rfc: string;
  rol: string;
  tipoCodigo: string;
  tipoDocumentoTransporte: string;
  filtroConsulta: boolean;
}

export interface TransportCompanyCAATResponse {
  codigo: string;
  mensaje: string;
  datos: TransportCompanyCAAT;
}

export interface TransportCompanyCAAT {
  iata: string;
  nombre: string;
  label: string;
  indice: number;
}

export interface TransportCompanyIATAResponse {
  codigo: string;
  mensaje: string;
  datos: TransportCompanyIATA;
}

export interface TransportCompanyIATA {
  iata: string;
  nombre: string;
  label: string;
  indice: number;
}

export interface GenerarReporteCompletoResponse {
  codigo: string;
  mensaje: string;
  datos: string;
}

export interface DimensionsResponse {
  codigo: string;
  mensaje: string;
  datos: Dimension[];
}

export interface Dimension {
  largoProducto: string;
  anchoProducto: string;
  alturaProducto: string;
  numeroPiezas: string;
  peso: string;
}

export interface ShipmentResponse {
  codigo: string;
  mensaje: string;
  datos: Shipment[];
}

export interface Shipment {
  consecutivo: string;
  descripcionMercancia: string;
  numeroPiezas: string;
  pesoBruto: string;
  pesoNeto: string;
  totalCargosDescuentos: string;
  harmonizedCommodityCodeCoded: string;
  harmonizedCommodityCode: string;
}

export interface TransportDocumentInformationDetailsResponse {
  codigo: string;
  mensaje: string;
  datos: TransportDocumentInformationDetails[];
}

export interface TransportDocumentInformationDetails {
  numeroViaje: string;
  caatIataCodigo: string;
  fechaHora: string;
  lugarTransbordoRutaDestinoCodigo: string;
}
