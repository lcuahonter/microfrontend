export enum TransferTypeSearch {
  DATE_TRANSFER = 'dateTransfer',
  MANIFEST_NUMBER = 'manifestNumber',
}

export interface ManifestResponse {
  codigo: string;
  mensaje: string;
  datos: Manifest;
}

export interface Manifest {
  numManifiesto: string;
  rfcTransmisor: string;
  tipoOperacion: string;
  empresaTransportista: string;
  fechaHoraTransmision: string;
  fechaHoraArribo: string;
  origenCarga: string;
  numVuelo: string;
  destinoCarga: string;
  caat: string;
  idHead: string;
}

export interface MasterResponse {
  codigo: string;
  mensaje: string;
  datos: Master[];
}

export interface Master {
  numMaster: string;
  tipoOperacion: string;
  recintoIATA: string;
  numpiezas: string;
  idHead: string;
}

export interface MasterDetailResponse {
  codigo: string;
  mensaje: string;
  datos: MasterDetail[];
}

export interface MasterDetail {
  numMaster: string;
  secuencia: string;
  articulo: string;
  descripcion: string;
  cantidadPeso: string;
  ump: string;
  idHead: string;
}

export interface HouseResponse {
  codigo: string;
  mensaje: string;
  datos: House[];
}

export interface House {
  numMaster: string;
  numHouse: string;
  caat: string;
  lugarCarga: string;
  lugarDescarga: string;
  fechaHora: string;
  numpiezas: string;
  tipoOperacion: string;
  rfc: string;
}
