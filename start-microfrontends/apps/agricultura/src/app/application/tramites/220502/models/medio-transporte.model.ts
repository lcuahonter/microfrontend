/**
 * Interfaz que representa los datos del medio de transporte utilizado en la solicitud.
 */
export interface MedioTransporte {
  /** Tipo de medio de transporte (ejemplo: camión, tren, avión, barco). */
  medioDeTransporte: string;

  /** Identificación específica del transporte (ejemplo: número de placa, matrícula, código de unidad). */
  identificacionTransporte: string;

  /** Indica si la solicitud es para transporte ferroviario por partes (1: Sí, 0: No). */
  esSolicitudFerros: number;

  /** Total de guías amparadas en el medio de transporte. */
  totalGuias: string;
}

/**
 * Interfaz que representa los datos de la mercancía en la tabla.
 * @interface MercanciaTabla
 */
export interface MercanciaTabla {
  /**
   * Esta propiedad es opcional y se utiliza para diferenciar
   * cada elemento dentro de la lista de mercancías u otros registros.
   */
  id?: number;
  /** Identificación de la mercancía. */
  fraccionArancelaria: string;
  /** Descripción de la mercancía. */
  descripcionFraccion: string;
  /** Número de identificación de la mercancía (NICO). */
  nico: string;
  /** Descripción adicional de la mercancía. */
  descripcion: string;
  /** Cantidad de mercancía a capturar. */
  saldoACapturar?: string;
  /** Unidad de medida de la mercancía. */
  unidaddeMedidaDeUMT: string;
  /** Cantidad total de mercancía en unidades de medida de transporte (UMT). */
  cantidadTotalUMT: string |number;
  /** Saldo pendiente de la mercancía. */
  saldoPendiente?: string |number;
   id_solicitud?: number;
  fraccion_arancelaria?: string;
  descripcion_de_la_fraccion?: string;
  descripcion_nico?: string;
  cant_soli_umt?: number;
  uni_medida_tar?: string;
  cant_total_umt?: number;
  num_permiso_importacion?: string;
  id_mercancia_gob?: number;
  numero_partida?: number;
  saldo_pendiente?: number;
}
