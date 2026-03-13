import { Catalogo } from "@libs/shared/data-access-user/src";

export interface Mercancia {
  descripcion?(descripcion: any): unknown;
  fraccionArancelaria: string;
  numeroRegistroProducto?: string;
  numeroDeRegistrodeProductos?: string;
  fechaExpedicion?: string;
  fechaVencimiento?: string;
  nombreTecnico: string;
  nombreComercial: string;
  normaOrigen?: string;
  id?: number;
  cantidad?: string;
  umc?: string;
  umcDescription?:string;
  umcId?: number;
  tipoFactura?: string;
  tipoDeFacturaDescription?:string;
  valorMercancia?: string;
  fechaFinalInput?: string;
  numeroFactura?: string;
  unidadMedidaMasaBruta?: string;
  complementoClasificacion?: string;
  complementoDescripcion?: string;
  fraccionNaladi?: string;
  fraccionNaladiSa93?: string;
  fraccionNaladiSa96?: string;
  fraccionNaladiSa02?: string;
  nalad?: string;
  fechaFactura?: string;
  marca?: string;
  marcaBruta?: string;
  umcMarcaBruta?: string;
  nombreIngles?: string;
  otrasInstancias?: string;
  criterioParaConferirOrigen?: string;
  criterioParaTratoPreferencial?: string;
  criterioParaClasificacion?: string;
  fechaDePago?: string;
  valorDeContenidoRegional?: string;
  numeroDeSerie?: string;
  rfcProductor1?: string; 
  rfcProductor?: string;
}

export interface ConfiguracionColumna<T> {
  encabezado: string; // Título de la columna
  clave: (ele: T) => string | number | undefined | boolean; // Función que devuelve el valor de la columna para cada fila
  orden: number; // Orden de la columna en la tabla
}




export interface MenusDesplegables {
  formControllName: string;
  data: Catalogo[];
  required: boolean;
}

/**
 * Insumos disponibles para agregar a la mercancía
 * @interface InsumosDisponibles
 */
export interface InsumosDisponibles {
  id?:number;
  nombre: string;
  fraccionArancelaria: string;
  originario: string;
  cantidad: string;
  idInsumo?: string;
  numeroRegistro?: string;
  idSolicitudInsumo?: string;
}