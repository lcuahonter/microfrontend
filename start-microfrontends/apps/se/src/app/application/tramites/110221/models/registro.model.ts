import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Interfaz que define la estructura de las columnas de la tabla de mercancías disponibles.
 */
export interface ColumnasTabla {
  fraccionMercanciaArancelaria?: string;
  nombreTecnico?: string;
  nombreComercialDelaMercancia?: string;
  criterioParaConferir?: string;
  nombreEnIngles?: string;
  valordeContenidoRegional?: string;
  cantidad?: string;
  umc?: string;
  valorDelaMercancia?: string;
  complementoDelaDescripcion?: string;
  numeroDeSerie?: string;
  tipoFactura?: string;
  fecha?: string;
  numeroFactura?: string;
  otrasInstancias?: string;
}

/**
 * Interfaz que define la estructura de las columnas de la tabla de mercancías seleccionadas.
 */
export interface SeleccionadasTabla {
  id?: number;
  fraccionMercanciaArancelaria?: string;
  nombreTecnico?: string;
  nombreComercialDelaMercancia?: string;
  criterioParaConferir?: string;
  nombreEnIngles?: string;
  valordeContenidoRegional?: string;
  cantidad: string;
  umc?: string;
  valorDelaMercancia?: string;
  complementoDelaDescripcion?: string;
  numeroDeSerie?: string;
  tipoFactura: string;
  fecha?: string;
  numeroFactura?: string;
  otrasInstancias?: string;
  fraccionArancelaria: string;
  unidadMedida: string;
  valorMercancia: string;
  complementoDescripcion: string;
  fechaFactura: string;
  numFactura: string;
}

/**
 * Configuración para el campo de fecha inicial.
 */
export const FECHA_INICIAL = {
  labelNombre: 'Fecha inicio',
  required: false,
  habilitado: true,
};

/**
 * Configuración para el campo de fecha final.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha fin',
  required: false,
  habilitado: true,
};

/**
 * Configuración para el campo de fecha de factura.
 */
export const FECHA_FACTURA = {
  labelNombre: 'Fecha de factura / Referencia /n Tipo de factura / Referencia: /n Tipo de factura / Referencia',
  required: true,
  habilitado: true,
};

/**
 * Configuración para el campo de despacho LDA.
 */
export const DESPACHO_LDA = {
  labelNombre: 'Sí',
  maxlength: 10,
  minlenght: 0,
  required: false,
  alfanumerico: true,
};

/**
 * Representa la respuesta de una consulta realizada en el trámite.
 */
export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   */
  success: boolean;

  /**
   * Mensaje asociado a la respuesta de la consulta.
   */
  message: string;
}

/**
 * Configuración de las columnas de la tabla de mercancías disponibles.
 */
export const HEADERS: ConfiguracionColumna<ColumnasTabla>[] = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: ColumnasTabla) => ele.fraccionMercanciaArancelaria,
    orden: 1,
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: ColumnasTabla) => ele.nombreTecnico,
    orden: 2,
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: ColumnasTabla) => ele.nombreComercialDelaMercancia,
    orden: 3,
  },
  {
    encabezado: 'Número de registro de productos',
    clave: (ele: ColumnasTabla) => ele.numeroDeSerie,
    orden: 4,
  },
  {
    encabezado: 'Fecha expedición',
    clave: (ele: ColumnasTabla) => ele.fecha,
    orden: 5,
  },
  {
    encabezado: 'Fecha vencimíento',
    clave: (ele: ColumnasTabla) => ele.fraccionMercanciaArancelaria,
    orden: 6,
  },
];

/**
 * Configuración de las columnas de la tabla de mercancías seleccionadas.
 */
export const HEADERS_DATA: ConfiguracionColumna<SeleccionadasTabla>[] = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: SeleccionadasTabla) => ele.fraccionArancelaria,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: SeleccionadasTabla) => ele.cantidad,
    orden: 2,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (ele: SeleccionadasTabla) => ele.unidadMedida,
    orden: 3,
  },
  {
    encabezado: 'Valor mercancía',
    clave: (ele: SeleccionadasTabla) => ele.valorMercancia,
    orden: 4,
  },
  {
    encabezado: 'Tipo de factura',
    clave: (ele: SeleccionadasTabla) => ele.tipoFactura,
    orden: 5,
  },
  {
    encabezado: 'Número factura',
    clave: (ele: SeleccionadasTabla) => ele.numFactura,
    orden: 6,
  },
  {
    encabezado: 'Complemento descripción',
    clave: (ele: SeleccionadasTabla) => ele.complementoDescripcion,
    orden: 7,
  },
  {
    encabezado: 'Fecha factura',
    clave: (ele: SeleccionadasTabla) => ele.fechaFactura,
    orden: 8,
  },
];
