export interface Tabla {
  tableHeader: string[];
  tableBody: TableBody[];
}

export interface TableBody {
  tbodyData: string[];
  lastColumnSelected?: boolean;
}

export interface ControlInventariosItem {
  id: string;
  nombreSistema: string;
  lugarRadicacion: string;
  anexo24: boolean;
}