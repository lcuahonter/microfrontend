import { Catalogo } from "@libs/shared/data-access-user/src";

export interface Solicitud260214Payload {
  solicitud: Solicitud;
  establecimiento: Establecimiento;
  datosSCIAN: DatoSCIAN[];
  mercancias: Mercancia[];
  representanteLegal: RepresentanteLegal;
  gridTerceros_TIPERS_FAB: Tercero[];
  gridTerceros_TIPERS_DES: Tercero[];
  gridTerceros_TIPERS_PVD: Tercero[];
  gridTerceros_TIPERS_FAC: Tercero[];
  pagoDeDerechos: PagoDeDerechos;
}
export interface Solicitud {
  discriminatorValue: number;
  declaracionesSeleccionadas: boolean;
  regimen: string;
  aduanaAIFA: string;
  informacionConfidencial: boolean;
}
export interface Establecimiento {
  rfcResponsableSanitario: string;
  razonSocial: string;
  correoElectronico: string;
  domicilio: DomicilioEstablecimiento;
  original: string;
  avisoFuncionamiento: boolean;
  numeroLicencia: string;
  aduanas: string;
}

export interface DomicilioEstablecimiento {
  codigoPostal: string;
  entidadFederativa: Clave;
  descripcionMunicipio: string;
  informacionExtra: string;
  descripcionColonia: string;
  calle: string;
  lada: string;
  telefono: string;
}
export interface DatoSCIAN {
  cveScian: string;
  descripcion: string;
  selected: boolean;
}
export interface Mercancia {
  idMercancia: string;
  idClasificacionProducto: string;
  nombreClasificacionProducto: string | null;
  ideSubClasificacionProducto: string;
  nombreSubClasificacionProducto: string;
  descDenominacionEspecifica: string;
  descDenominacionDistintiva: string;
  descripcionMercancia: string;
  formaFarmaceuticaDescripcionOtros: string;
  estadoFisicoDescripcionOtros: string;
  fraccionArancelaria: FraccionArancelaria;
  unidadMedidaComercial: Descripcion;
  cantidadUMCConComas: string;
  unidadMedidaTarifa: Descripcion;
  cantidadUMTConComas: string;
  presentacion: string;
  registroSanitarioConComas: string | null;
  nombreCortoPaisOrigen: string[];
  nombreCortoPaisProcedencia: string[];
  tipoProductoDescripcionOtros: string;
  nombreCortoUsoEspecifico: string[];
  fechaCaducidadStr: string;
}

export interface FraccionArancelaria {
  clave: string;
  descripcion: string;
}

export interface Descripcion {
  descripcion: string;
}
export interface RepresentanteLegal {
  rfc: string;
  resultadoIDC: string | null;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}
export interface Tercero {
  idPersonaSolicitud: string;
  ideTipoTercero: string;
  personaMoral: string;
  booleanExtranjero: string;
  booleanFisicaNoContribuyente: string | null;
  denominacion: string;
  razonSocial: string;
  rfc: string;
  curp: string;
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  telefono: string;
  correoElectronico: string;
  actividadProductiva: string;
  actividadProductivaDesc: string;
  descripcionGiro: string;
  numeroRegistro: string;
  domicilio: DomicilioTercero;
  idSolicitud: string;
}

export interface DomicilioTercero {
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  pais: Catalogo;
  colonia: Catalogo;
  delegacionMunicipio: Catalogo;
  localidad: Catalogo;
  entidadFederativa: Catalogo;
  informacionExtra: string;
  codigoPostal: string;
  descripcionColonia: string;
}
export interface PagoDeDerechos {
  claveDeReferencia: string;
  cadenaPagoDependencia: string;
  banco: Banco;
  llaveDePago: string;
  fecPago: string;
  impPago: string;
}

export interface Banco {
  clave: string;
  descripcion: string;
}

export interface Clave {
  clave: string;
}
export interface ApiResponse<T> {
  codigo: string;
  mensaje: string;
  datos: T;
}
export interface PatchDatoScian {
  clave: string;
  descripcion: string;
  selected: boolean;
}
export interface PagoDerechosPatchData {
  claveReferencia: string;
  cadenaDependencia: string;
  banco: string;
  llavePago: string;
  fechaPago: string;
  importePago: string;
}

export interface PatchRepresentanteLegal {
  representanteRfc: string;
  resultadoIDC: string;
  representanteNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}
