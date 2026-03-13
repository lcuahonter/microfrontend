import { Catalogo, CatalogoPaises } from './catalogos.model';

export interface DatosInput {
  lbl_name: string;
  id: string;
  tooltip: boolean;
  title_tooltip?: string;
  disabled: boolean;
}

export interface CatalogosSelect {
  labelNombre: string;
  required: boolean;
  primerOpcion: string;
  catalogos: Catalogo[];
}

export interface CatalogosSelectPaises {
  labelNombre: string;
  required: boolean;
  primerOpcion: string;
  catalogos: CatalogoPaises[];
}

export interface DatosPasos {
  txtBtnSig: string;
  txtBtnAnt: string;
  indice: number;
  nroPasos: number;
}

export interface DatosIndice {
  indice: number;
  estatus: boolean;
}

export interface DocumentosCargados {
  tipoDocumento: Catalogo;
  nombreArchivo: string;
}

export interface DatosArchivo {
  tamRequerido: number;
  tam: number;
  unidad: string;
}

export interface InputCheck {
  labelNombre: string;
  maxlength: number;
  minlenght: number;
  required: boolean;
  alfanumerico: boolean;
}

export interface DatosInputCheck {
  check: boolean;
  valor: string;
}

export interface InputHora {
  labelNombre: string;
  required: boolean;
}

export interface InputFecha {
  labelNombre: string;
  required: boolean;
  habilitado: boolean;
}

export type ConfiguracionTabla = Record<
  string,
  string | number | boolean | null
>;

export interface EncabezadosTabla {
  key: string;
  valor: string;
}

export interface AccionesTabla {
  tipo: string;
  label: string;
  icono: string;
}



export interface DatosRfcResponse {
  rfc: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
}
export interface DatosRepresentanteLegal {
  rfc: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  correo: string;
}

export interface TableData {
  tableHeader: string[];
  tableBody: TableBodyData[];
}

export interface TableBodyData {
  tbodyData: string[];
  selected?: boolean;
}

export interface DatosPageAcuse {
  txtAlerta: string;
  tituloSeccionAcuse: string;
  encabezadoTablaAcuse: EncabezadosTabla[];
  datosTablaAcuse: ConfiguracionTabla[];
  accionesTablaAcuse: AccionesTabla[];
}
