/**
 * Interfaz que representa la configuración de una columna en una tabla.
 * 
 * @template T - Tipo de los datos de la fila.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Título de la columna que se muestra en el encabezado de la tabla.
   */
  encabezado: string;

  /**
   * Función que recibe un elemento de tipo T (fila) y retorna el valor
   * que será mostrado en la celda correspondiente a esta columna.
   * Puede devolver un string, número, booleano o undefined.
   */
  clave: (ele: T) => string | number | undefined | boolean;

  /**
   * Número que indica el orden en que se mostrará la columna en la tabla.
   * Las columnas con valores de orden menores se muestran antes.
   */
  orden: number;
}

/**
 * Interfaz que representa los datos de la mercancía.
 */
export interface DatosMercancia {
  /** Descripción detallada de la mercancía. */
  descripcion: string;

  /** Marca de la mercancía. */
  marca: string;

  /** Tipo de entrada de la mercancía. */
  tipoEntrada: string;

  /** Fracción arancelaria asociada a la mercancía. */
  fraccion: string;

  /** Número de Identificación Comercial (NICO). */
  nico: string;

  /** Unidad de medida tarifaria (UMT). */
  umt: string;

  /** Número de la factura asociada. */
  facturaNumero: string;

  /** Fecha en que fue emitida la factura. */
  facturaFecha: string;

  /** Unidad de medida comercial (UMC). */
  umc: string;

  /** Otro tipo de unidad de medida comercial, si aplica. */
  otroUmc: string;

  /** Cantidad en unidades comerciales (UMC). */
  cantidadUmc: string;

  /** Factor de conversión entre unidades comerciales y tarifarias. */
  factorConversion: string;

  /** Cantidad en unidades tarifarias (UMT). */
  cantidadUmt: string;

  /** Valor total de la factura. */
  valorFactura: string;

  /** Moneda en la que se comercializa la mercancía. */
  monedaComercializacion: string;

  /** Valor total de la factura expresado en dólares estadounidenses (USD). */
  valorFacturaUsd: string;

  /** Precio unitario en dólares estadounidenses (USD). */
  precioUnitarioUsd: string;

  /** País exportador de la mercancía. */
  paisExportador: string;

  /** País de origen de la mercancía. */
  paisOrigen: string;

  /** Valor total de la factura en moneda local. */
  valorTotalFactura: string;

  /** Valor total de la factura en dólares estadounidenses (USD). */
  valorTotalFacturaUsd: string;

    /** Fracción Naladi vigente. */
  fraccionNaladi: string;

  /** Fracción Naladi versión SA 1993. */
  fraccionNaladiSa93: string;

  /** Fracción Naladi versión SA 1996. */
  fraccionNaladiSa96: string;

  /** Fracción Naladi versión SA 2002. */
  fraccionNaladiSa02: string;

  /** Código Nalad asociado a la mercancía (opcional). */
  nalad?: string;
}

/**
 * Interfaz que representa la información de una mercancía.
 */
export interface Mercancia {
  id?: string | number;
  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;

  /** Número de registro de productos asociado. */
  numeroDeRegistrodeProductos: string;

  /** Fecha de expedición del registro o documento relacionado. */
  fechaExpedicion: string;

  /** Fecha de vencimiento del registro o documento relacionado. */
  fechaVencimiento: string;

  /** Nombre técnico de la mercancía. */
  nombreTecnico: string;

  /** Nombre comercial de la mercancía. */
  nombreComercial: string;

  /** Norma de origen de la mercancía (opcional). */
  normaOrigen?: string;

  /** Cantidad de mercancía (opcional). */
  cantidad?: string;

  /** Unidad de medida comercial (opcional). */
  umc?: string;

  /** Tipo de factura asociado (opcional). */
  tipoFactura?: string;

  /** Valor total de la mercancía (opcional). */
  valorMercancia?: string;

  /** Fecha final de entrada o registro (opcional). */
  fechaFinalInput?: string;

  /** Número de factura (opcional). */
  numeroFactura?: string;

  /** Código Nalad (opcional). */
  nalad?: string;

  /** Nombre en inglés de la mercancía (opcional). */
  nombreIngles?: string;

  /** Criterio de clasificación aplicable (opcional). */
  criterioClasificacion?: string;

  /** Marca de la mercancía (opcional). */
  marca?: string;

  /** Masa bruta de la mercancía (opcional). */
  masaBruta?: string;

  /** Unidad de medida para la masa bruta (opcional). */
  unidadMedidaMasaBruta?: string;

  /** Complemento para la clasificación arancelaria (opcional). */
  complementoClasificacion?: string;
}
/**
 * Modelo que representa los datos de una mercancía.
 * Utilizado para formularios, tablas y sincronización con el store.
 * Contiene información básica como cantidad, valor y clasificación.
 */
export interface Mercancias {
  unidadDeMedida: string;
  cantidad: string;
  fraccionArancelaria: string;
  valorMercancia: string;
  tipoDeFactura: string;
}
