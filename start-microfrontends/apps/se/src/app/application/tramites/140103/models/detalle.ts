/**
 * Interfaz que representa la estructura de un cupo, incluyendo detalles del producto, mecanismo y tipo.
 */
export interface Cupos {
  /** Cantidad asignada del cupo */
  cupo: number;
  /** Nombre del producto asociado al cupo */
  nombreProducto: string;
  /** Nombre del subproducto asociado al cupo */
  nombreSubproducto: string;
  /** Mecanismo utilizado para la asignación del cupo */
  mecanismoAsignacion: string;
  /** Tipo de cupo asignado */
  tipoCupo: string;
}
/**
 * Representa la configuración de un cupo con datos como folio, razón social,
 * estado, fabricante, importador, unidades y montos económicos asociados.
 * Funciona como contrato de datos para validar y gestionar la información.
 */
export interface ConfiguracionCertificados {
  idExpedicion: number;
  numCertificado: number;
  rfc: string;
  denominacion: string;
  numFolioOficio: string;
  numFolioTramite: string | null;
  estado: string;
  estadoCancelacion: number;
  montoAsignado: number;
  montoDisponible: number;
  montoExpedido: number;
  montoCancelado: number;
  representacionFederal: string;
  claveRepresentacionFederal: string;
  factorConversion: number;
  estadoTransmision: string | null;
  montoEjercidoCBP: number;
  fabricante: string;
  importador: string;
}

/**
 * Representa la estructura de un cupo con detalles adicionales como vigencia,
 * fundamentos, régimen, unidad de medida, producto asociado, entre otros.
 */
export interface CupoDetalle {
  idCupo: number;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  fundamentos: string;
  regimen: string;
  unidadMedidaComercializacion: boolean;
  ideClasifSubproducto: string | null;
  descSubProductoOtro: string | null;
  ideTipoCupo: string;
  cveUsuario: string;
  cveProducto: string;
  idTratadoAcuerdo: number;
  cveUnidadMedidaOficialCupo: string;
  idCupoR: number | null;
  producto: ProductoDetalle;
}

/**
 * Representa los detalles de un producto asociado a un cupo.
 */
export interface ProductoDetalle {
  clave: string;
  sigla: string;
  nombre: string;
  descripcion: string;
  fechaCaptura: string;
  fechaInicioVigencia: string;
  fechaFinVigencia: string | null;
  blnActivo: boolean;
}