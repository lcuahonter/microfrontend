export interface GuidesResponse {
  codigo: string;
  mensaje: string;
  datos: Guide[];
}

export interface Guide {
  numeroGuia: string;
  estado: string;
  fecha: string;
  tipoOperacion: string;
  replica: string;
}
