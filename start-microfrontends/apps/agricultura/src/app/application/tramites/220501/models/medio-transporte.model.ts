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
 * Representa un registro de mercancía utilizado principalmente en tablas
 * locales dentro de la aplicación. Esta interfaz mezcla datos capturados
 * por el usuario, información calculada y datos provenientes de la API.
 * 
 * Contiene atributos relacionados con fracciones arancelarias, cantidades,
 * unidades de medida, saldos pendientes y metadatos adicionales de la mercancía.
 */
export interface MercanciaTabla {
  /**
   * Identificador opcional para distinguir cada registro dentro del conjunto
   * de mercancías manipuladas por el usuario.
   */
  id?: number;

  /** Fracción arancelaria asignada a la mercancía. */
  fraccionArancelaria: string;

  /** Descripción oficial correspondiente a la fracción arancelaria. */
  descripcionFraccion: string;

  /** Código NICO asociado a la mercancía. */
  nico: string;

  /** Descripción detallada o específica de la mercancía. */
  descripcion: string;

  /** Cantidad pendiente por capturar para completar la solicitud. */
  saldoACapturar?: string;

  /** Unidad de medida en UMT asignada a la mercancía. */
  unidaddeMedidaDeUMT: string;

  /** Cantidad total registrada en unidades de medida de transporte (UMT). */
  cantidadTotalUMT: string | number;

  /** Saldo pendiente de la mercancía. */
  saldoPendiente?: string | number;

  /** Identificador de la solicitud a la que pertenece la mercancía. */
  id_solicitud?: number;

  /** Fracción arancelaria según estructura de respuesta de API. */
  fraccion_arancelaria?: string;

  /** Descripción de la fracción arancelaria recibida desde la API. */
  descripcion_de_la_fraccion?: string;

  /** Descripción del código NICO recibida desde la API. */
  descripcion_nico?: string;

  /** Cantidad solicitada en UMT proveniente de la API. */
  cant_soli_umt?: number;

  /** Unidad de medida tarifaria (UMT) proporcionada por la API. */
  uni_medida_tar?: string;

  /** Cantidad total en UMT proveniente de la API. */
  cant_total_umt?: number;

  /** Número de permiso de importación asociado. */
  num_permiso_importacion?: string;

  /** Identificador de mercancía en sistemas gubernamentales. */
  id_mercancia_gob?: number;

  /** Número de partida asignado a la mercancía. */
  numero_partida?: number;

  /** Saldo pendiente registrado en la API. */
  saldo_pendiente?: number;
}

/**
 * Representa un conjunto de datos estructurados sobre una mercancía
 * utilizados comúnmente para desplegar, validar o transformar información
 * antes de enviarla a la API. Incluye detalles de fracción arancelaria,
 * cantidades, unidades de medida y saldo pendiente.
 */
export interface DatosDeMercancias {
  /** Fracción arancelaria aduanera asociada a la mercancía. */
  fraccionArancelaria: string;

  /** Descripción de la fracción arancelaria. */
  descripcionFraccion: string;

  /** Código NICO correspondiente a la mercancía. */
  nico: string;

  /** Descripción detallada del código NICO. */
  nicoDescripcion: string;

  /** Cantidad solicitada en UMT (Unidad de Medida de Transporte). */
  cantidadSolicitadaUMT: number;

  /** Unidad de medida utilizada en la solicitud. */
  unidadMedidaUMT: string;

  /** Cantidad total registrada en UMT. */
  cantidadTotalUMT: number;

  /** Saldo pendiente de la mercancía. */
  saldoPendiente: number;

  /** Indica si la mercancía se encuentra seleccionada. */
  selected?: boolean;
}