export enum TypeSearch {
  MANIFEST = 'manifest',
  FLIGHT = 'flight',
  MASTER = 'master',
  CAAT = 'caat',
  HOUSE = 'house',
}

export interface ParamsMasterGuides {
  numGuia: string;
  fechaInicio: string;
  fechaFin: string;
  aduana: string;
  rfc: string;
}

export interface ParamsHouseGuides {
  guiaHouse: string;
  fechaInicio: string;
  fechaFin: string;
  aduana: string;
  rfc: string;
  esFuncionario: string;
}

export interface ParamsFlights {
  numVuelo: string;
  fechaIni: string;
  fechaFin: string;
  aduana: string;
  rfc: string;
}

export interface ParamsManifests {
  idManifiesto: string;
  fechaIni: string;
  fechaFin: string;
  aduana: string;
  rfc: string;
}

export interface ParamsCaat {
  fechaIni: string;
  fechaFin: string;
  aduana: string;
  rfc: string;
  caat: string;
}

export interface ManisfestsResponse {
  codigo: string;
  mensaje: string;
  datos: Manisfest[];
}

export interface Manisfest {
  empresaTransportista: string;
  numVuelo: string;
  numManifiesto: string;
  lugarCarga: string;
  lugarDescarga: string;
  fechaHora: string;
  idHead: string;
  rfc: string;
  recinto: string;
}

export interface MasterResponse {
  codigo: string;
  mensaje: string;
  datos: Master[];
}

export interface Master {
  numGuia: string;
  lugarCarga: string;
  lugarDescarga: string;
  fechaTransmision: string;
  numPiezas: string;
  operacion: string;
  caat: string;
  fechaArribo: string;
  idHead: string;
  rfc: string;
  recintoFiscalizado: string;
}

export interface MasterGuidesResponse {
  codigo: string;
  mensaje: string;
  datos: MasterGuide[];
}

export interface MasterGuide {
  numGuia: string;
  lugarCarga: string;
  lugarDescarga: string;
  fechaTransmision: string;
  numPiezas: string;
  operacion: string;
  caat: string;
  fechaArribo: string;
  idHead: string;
  rfc: string;
  recintoFiscalizado: string;
}

export interface HouseGuidesResponse {
  codigo: string;
  mensaje: string;
  datos: HouseGuide[];
}

export interface HouseGuide {
  numGuia: string;
  lugarCarga: string;
  lugarDescarga: string;
  fechaTransmision: string;
  numPiezas: string;
  operacion: string;
  caat: string;
  fechaArribo: string;
  idHead: string;
  rfc: string;
}

export interface FlightsResponse {
  codigo: string;
  mensaje: string;
  datos: Flight[];
}

export interface Flight {
  empresaTransportista: string;
  numVuelo: string;
  numManifiesto: string;
  lugarCarga: string;
  lugarDescarga: string;
  fechaHora: string;
  idHead: string;
  rfc: string;
  recinto: string;
}

export interface HouseDetailsResponse {
  codigo: string;
  mensaje: string;
  datos: HouseDetail[];
}

export interface HouseDetail {
  numGuia: string;
  lugarCarga: string;
  lugarDescarga: string;
  fechaTransmision: string;
  numPiezas: string;
  operacion: string;
  caat: string;
  fechaArribo: string;
  idHead: string;
  rfc: string;
}
export interface PersonsMerchandiseResponse {
  codigo: string;
  mensaje: string;
  datos: PersonsMerchandise;
}

export interface PersonsMerchandise {
  mercancias: Merchandise[];
  personas: Persons[];
}

export interface Merchandise {
  numSecuencia: string;
  articulosITEM: string;
  descripcion: string;
  cantidadPeso: string;
  ump: string;
  total: string;
}

export interface Persons {
  nombre: string;
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  correo: string;
  nombreContacto: string;
  telefonoContacto: string;
  correoContacto: string;
}
