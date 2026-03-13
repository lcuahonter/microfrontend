/** 
 * Interfaz que representa los datos del pago de derechos. 
 */
export interface PagoDeDerechos {
  /** Indica si el pago no está exento. */
  exentoPagoNo: string | number;

  /** Indica si el pago está exento. */
  exentoPagoSi: string;

  /** Justificación en caso de exención de pago. */
  justificacion: string;

  /** Clave de referencia del pago. */
  claveReferencia: string;

  /** Cadena de dependencia asociada al pago. */
  cadenaDependencia: string;

  /** Nombre del banco donde se realizó el pago. */
  banco: number;

  /** Llave única de identificación del pago. */
  llavePago: string;

  /** Importe total del pago realizado. */
  importePago: string;

  /** Fecha en la que se efectuó el pago. */
  fetchapago: string;
  
}

export interface OpcionDeRadio {
    /**
     * @description Etiqueta o texto visible para la opción de radio.
     */
    label: string;

    /**
     * @description Valor asociado a la opción de radio.
     */
    value: string;
}

