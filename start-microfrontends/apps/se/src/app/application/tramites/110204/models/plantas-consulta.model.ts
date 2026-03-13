/**
 * Interfaz que representa la información detallada de una mercancía.
 */
export interface Mercancias {
  /** 
   * Fracción arancelaria Naladi asignada a la mercancía.
   */
  fraccionNaladi: string;

  /**
   * Fracción arancelaria Naladi SA 93 correspondiente.
   */
  fraccionNaladiSa93: string;

  /**
   * Fracción arancelaria Naladi SA 96 correspondiente.
   */
  fraccionNaladiSa96: string;

  /**
   * Fracción arancelaria Naladi SA 02 correspondiente.
   */
  fraccionNaladiSa02: string;

  /**
   * Nombre técnico descriptivo de la mercancía.
   */
  nombreTecnico: string;

  /**
   * Nombre comercial utilizado para la mercancía.
   */
  nombreComercial: string;

  /**
   * Norma de origen aplicable a la mercancía.
   * @optional
   */
  normaOrigen?: string;

  /**
   * Identificador único de la mercancía.
   * @optional
   */
  id?: string;

  /**
   * Cantidad total de la mercancía.
   * @optional
   */
  cantidad?: string;

  /**
   * Unidad de medida comercial para la cantidad.
   * @optional
   */
  umc?: string;

  /**
   * Tipo de factura asociada a la mercancía.
   * @optional
   */
  tipoFactura?: string;

  /**
   * Valor económico total de la mercancía.
   * @optional
   */
  valorMercancia?: string;

  /**
   * Fecha final relacionada con la entrada o registro de la mercancía.
   * @optional
   */
  fechaFinalInput?: string;

  /**
   * Número de la factura asociada.
   * @optional
   */
  numeroFactura?: string;

  /**
   * Código Nalad relacionado con la mercancía.
   * @optional
   */
  nalad?: string;

  /**
   * Complemento adicional para la clasificación arancelaria.
   * @optional
   */
  complementoClasificacion?: string;
}
