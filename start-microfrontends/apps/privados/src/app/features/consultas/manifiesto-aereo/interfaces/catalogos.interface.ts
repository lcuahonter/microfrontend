export interface CustomResponse {
  codigo: string;
  mensaje: string;
  datos: Custom[];
}

export interface Custom {
  idClave: string;
  aduanaNombre: string;
}

export interface StatusDocumentResponse {
  codigo: string;
  mensaje: string;
  datos: StatusDocument[];
}

export interface StatusDocument {
  idClave: string;
  cveNumeracion: string;
}
