import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que representa las columnas de la tabla de mercancías disponibles.
 */
export interface ColumnasTabla {
  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;
  /** Nombre técnico de la mercancía. */
  nombreTecnico: string;
  /** Nombre comercial de la mercancía. */
  nombreComercial: string;
  /** Número de registro de productos. */
  numeroRegistroProductos: string;
  /** Fecha de expedición de la mercancía. */
  fechaExpedicion: string;
  /** Fecha de vencimiento de la mercancía. */
  fechaVencimiento: string;
}

/**
 * Interfaz que representa las columnas de la tabla de mercancías seleccionadas.
 */
export interface SeleccionadasTabla {
  /** Fracción arancelaria de la mercancía seleccionada. */
  fraccionArancelaria: string;
  /** Cantidad de mercancía seleccionada. */
  cantidad: string;
  /** Unidad de medida de la mercancía seleccionada. */
  unidadMedida: string;
  /** Valor de la mercancía seleccionada. */
  valorMercancia: string;
  /** Tipo de factura asociada a la mercancía seleccionada. */
  tipoFactura: string;
  /** Número de factura asociada a la mercancía seleccionada. */
  numFactura: string;
  /** Complemento de la descripción de la mercancía seleccionada. */
  complementoDescripcion: string;
  /** Fecha de la factura asociada a la mercancía seleccionada. */
  fechaFactura: string;
}

/**
 * Configuración para la fecha inicial.
 */
export const FECHA_INICIAL = {
  /** Etiqueta para la fecha inicial. */
  labelNombre: 'Fecha inicio:',
  /** Indica si el campo es obligatorio. */
  required: false,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/**
 * Configuración para la fecha final.
 */
export const FECHA_FINAL = {
  /** Etiqueta para la fecha final. */
  labelNombre: 'Fecha fin:',
  /** Indica si el campo es obligatorio. */
  required: false,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/**
 * Configuración para la fecha de la factura.
 */
export const FECHA_FACTURA = {
  /** Etiqueta para la fecha de la factura. */
  labelNombre: 'Fecha de factura',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/**
 * Configuración para el despacho LDA.
 */
export const DESPACHO_LDA = {
  /** Etiqueta para el despacho LDA. */
  labelNombre: 'Sí',
  /** Longitud máxima permitida. */
  maxlength: 10,
  /** Longitud mínima permitida. */
  minlenght: 0,
  /** Indica si el campo es obligatorio. */
  required: false,
  /** Indica si el campo permite caracteres alfanuméricos. */
  alfanumerico: true,
};

/**
 * Configuración de las columnas de la tabla de mercancías disponibles.
 */
export const HEADERS: ConfiguracionColumna<ColumnasTabla>[] = [
  {
    /** Encabezado para la fracción arancelaria. */
    encabezado: 'Fracción arancelaria',
    /** Clave para obtener el valor de la fracción arancelaria. */
    clave: (ele: ColumnasTabla) => ele.fraccionArancelaria,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado para el nombre técnico. */
    encabezado: 'Nombre técnico',
    /** Clave para obtener el valor del nombre técnico. */
    clave: (ele: ColumnasTabla) => ele.nombreTecnico,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado para el nombre comercial. */
    encabezado: 'Nombre comercial',
    /** Clave para obtener el valor del nombre comercial. */
    clave: (ele: ColumnasTabla) => ele.nombreComercial,
    /** Orden de la columna. */
    orden: 3,
  },
  {
    /** Encabezado para el número de registro de productos. */
    encabezado: 'Número de registro de productos',
    /** Clave para obtener el valor del número de registro de productos. */
    clave: (ele: ColumnasTabla) => ele.numeroRegistroProductos,
    /** Orden de la columna. */
    orden: 4,
  },
  {
    /** Encabezado para la fecha de expedición. */
    encabezado: 'Fecha expedición',
    /** Clave para obtener el valor de la fecha de expedición. */
    clave: (ele: ColumnasTabla) => ele.fechaExpedicion,
    /** Orden de la columna. */
    orden: 5,
  },
  {
    /** Encabezado para la fecha de vencimiento. */
    encabezado: 'Fecha vencimíento',
    /** Clave para obtener el valor de la fecha de vencimiento. */
    clave: (ele: ColumnasTabla) => ele.fechaVencimiento,
    /** Orden de la columna. */
    orden: 6,
  },
];

/**
 * Configuración de las columnas de la tabla de mercancías seleccionadas.
 */
export const HEADERS_DATA: ConfiguracionColumna<SeleccionadasTabla>[] = [
  {
    /** Encabezado para la fracción arancelaria. */
    encabezado: 'Fracción arancelaria',
    /** Clave para obtener el valor de la fracción arancelaria. */
    clave: (ele: SeleccionadasTabla) => ele.fraccionArancelaria,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado para la cantidad. */
    encabezado: 'Cantidad',
    /** Clave para obtener el valor de la cantidad. */
    clave: (ele: SeleccionadasTabla) => ele.cantidad,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado para la unidad de medida. */
    encabezado: 'Unidad de medida',
    /** Clave para obtener el valor de la unidad de medida. */
    clave: (ele: SeleccionadasTabla) => ele.unidadMedida,
    /** Orden de la columna. */
    orden: 3,
  },
  {
    /** Encabezado para el valor de la mercancía. */
    encabezado: 'Valor mercancía',
    /** Clave para obtener el valor de la mercancía. */
    clave: (ele: SeleccionadasTabla) => ele.valorMercancia,
    /** Orden de la columna. */
    orden: 4,
  },
  {
    /** Encabezado para el tipo de factura. */
    encabezado: 'Tipo de factura',
    /** Clave para obtener el valor del tipo de factura. */
    clave: (ele: SeleccionadasTabla) => ele.tipoFactura,
    /** Orden de la columna. */
    orden: 5,
  },
  {
    /** Encabezado para el número de factura. */
    encabezado: 'Número factura',
    /** Clave para obtener el valor del número de factura. */
    clave: (ele: SeleccionadasTabla) => ele.numFactura,
    /** Orden de la columna. */
    orden: 6,
  },
  {
    /** Encabezado para el complemento de descripción. */
    encabezado: 'Complemento descripción',
    /** Clave para obtener el valor del complemento de descripción. */
    clave: (ele: SeleccionadasTabla) => ele.complementoDescripcion,
    /** Orden de la columna. */
    orden: 7,
  },
  {
    /** Encabezado para la fecha de la factura. */
    encabezado: 'Fecha factura',
    /** Clave para obtener el valor de la fecha de la factura. */
    clave: (ele: SeleccionadasTabla) => ele.fechaFactura,
    /** Orden de la columna. */
    orden: 8,
  },
];

/**
 * @descripcion
 * Interfaz que representa la información del grupo representativo
 * relacionado con el exportador y su empresa.
 */
export interface GrupoRepresentativo {
  /**
   * @descripcion
   * Lugar asociado al grupo representativo.
   */

  lugar: string;
  /**
   * @descripcion
   * Nombre del exportador perteneciente al grupo representativo.
   */
  nombreExportador: string;
  /**
   * @descripcion
   * Nombre de la empresa del exportador.
   */
  empresa: string;
  /**
   * @descripcion
   * Cargo o puesto del representante dentro de la empresa.
   */
  cargo: string;
  /**
   * @descripcion
   * Número de teléfono de contacto del representante.
   */
  telefono: string;
  /**
   * @descripcion
   * Correo electrónico del representante o exportador.
   */
  correoElectronico: string;
}

/**
 * @descripcion
 * Interfaz que representa los detalles del transporte en el trámite.
 */
export interface DetallesDelTransporte {
  /** @descripcion
   * Medio de transporte utilizado.
   */
  medioDeTransporte: string,
  /** @descripcion
   * Ruta completa del transporte.
   */
  rutaCompleta: string,
  /**
   * @descripcion
   * Puerto de embarque.
   */
  puertoEmbarque: string,
  /**
   * @descripcion
   * Puerto de desembarque.
   */
  puertoDesembarque: string,
  /**
   * @descripcion
   * Puerto de tránsito.
   */
  puertoTransito: string,
  /** @descripcion
   * Nombre de la embarcación.
   */
  nombreEmbarcacion: string,
  /**
   * @descripcion
   * Número de vuelo.
   */
  numeroVuelo: string,
}