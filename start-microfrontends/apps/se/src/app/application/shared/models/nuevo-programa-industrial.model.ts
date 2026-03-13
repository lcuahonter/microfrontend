import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';

export interface Anexo1y3Configuartion<T> {
  anexoDosTablaSeleccionCheckbox: TablaSeleccion;
  anexoDosEncabezadoDeTabla: ConfiguracionColumna<T>[];
  anexoTresTablaSeleccionCheckbox: TablaSeleccion;
  anexoTresEncabezadoDeTabla: ConfiguracionColumna<T>[];
}

export interface AnexoEncabezado {
  encabezadoFraccion: string;
  encabezadoDescripcion: string;
  estatus: boolean;
}

export interface AnexoUnoConfiguartion<T> {
  anexoUnoTablaSeleccionRadio: TablaSeleccion;
  anexoUnoEncabezadoDeTabla: ConfiguracionColumna<T>[];
}
export interface AnexoDosConfiguartion<T> {
  anexoDosTablaSeleccionRadio: TablaSeleccion;
  anexoDosEncabezadoDeTabla: ConfiguracionColumna<T>[];
}
export interface ProyectoImmexConfiguartion<T> {
  proyectoImmexSeleccionCheckBox: TablaSeleccion;
  proyectoImmexTabla: ConfiguracionColumna<T>[];
}

export interface AnexoUnoEncabezado {
  encabezadoFraccion: string;
  encabezadoFraccionArancelaria: string;
  encabezadoDescripcionComercial: string;
  encabezadoAnexoII: string;
  encabezadoTipo: string;
  encabezadoUmt: string;
  encabezadoCategoria: string;
  encabezadoValorEnMonedaMensual?: number;
  encabezadoValorEnMonedaAnual?: number;
  encabezadoVolumenMensual?: number;
  encabezadoVolumenAnual?: number;
  encabezadoValorEnMercado?: string;
  estatus: boolean;
}

export interface AnexoDosEncabezado {
  encabezadoFraccion: string;
  encabezadoFraccionExportacion: string;
  encabezadoDescripcionComercial: string;
  encabezadoFraccionImportacion: string;
  encabezadoDescripcionComercialImportacion: string;
  encabezadoAnexoII?: string;
  encabezadoTipo?: string;
  encabezadoUmt?: string;
  encabezadoCategoria?: string;
  encabezadoValorEnMonedaMensual?: number;
  encabezadoValorEnMonedaAnual?: number;
  encabezadoVolumenMensual?: number;
  encabezadoVolumenAnual?: number;
  estatus: boolean;
}

export interface ProyectoImmexEncabezado {
  encabezadoFraccion: string;
  encabezadoTipoDocument: string;
  encabezadoDescripcionOtro: string;
  encabezadoFechaFirma: string;
  encabezadoFechaVigencia: string;
  encabezadoRfc: string;
  encabezadoRazonFirmante: string;
  estatus: boolean;
}

export interface Catalogo {
  id: number;
  descripcion: string;
  clave?: string;
  tam?: string;
  dpi?: string;
}

export interface ComplimentarFraccion {
  fraccionArancelaria: string;
  anexoDos: string;
  tipo: string;
  umt: string;
  catagoria: string;
  descripcion: string;
  monedaNacionalMensual: number | string;
  monedaNacionalDeDosPeriodos: number | string;
  volumenMensual: number | string;
  twoPeriodVolume: number | string;
}

export interface ComplimentarFraccionResoponse {
  catagoria: string;
  descripcion: string;
  monedaNacionalMensual: number;
  monedaNacionalDeDosPeriodos: number;
  volumenMensual: number;
  twoPeriodVolume: number;
}

export interface PoryectoDatos {
  fraccionArancelaria: string;
  anexoDos: string;
  tipo: string;
  umt: string;
  descripcion: string;
  tipoDeDocumente: string;
  fechaDeFirma: string;
  fechaDeVigencia: string;
  rfcTaxId: number;
  razonSocial: string;
}

export interface RutaNombre {
  catagoria: string;
  id: string;
  datos: AnexoUnoEncabezado | AnexoDosEncabezado;
}

export interface ProveedorClienteTabla {
  fraccion?: string;
  paisDeOrigin?: number;
  proveedor?: string;
  razonSocialProveedor?: string;
  paisDestino: string;
  rfcClinte: string;
  razonSocial: string;
  rfcProveedor?: string;
}

export interface DatosComplimento {
  fraccionArancelaria: string;
  descripcion: string;
}

export interface DatosAnexotressUno {
  fraccionArancelaria: string;
  descripcion: string;
}
export interface DatosAnexotressDos {
  fraccionArancelariaDos: string;
  descripcionDos: string;
}