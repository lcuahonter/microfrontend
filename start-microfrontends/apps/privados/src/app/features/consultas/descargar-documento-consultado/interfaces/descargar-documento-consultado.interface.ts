export interface FullReportsResponse {
  codigo: string;
  mensaje: string;
  datos: FullReport[];
}

export interface FullReport {
  idFolio: string;
  fecha: string;
  estatus: string;
  rfcSolicitante: string;
  nombreArchivo: string;
}
