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

/**
 * Interfaz para definir la estructura de las filas.
 */
export interface Row {
  /**
   * Nombre de la persona.
   * @type {string}
   */
  nombre: string;

  /**
   * Número de teléfono de la persona.
   * @type {string}
   */
  telefono: string;

  /**
   * Correo electrónico de la persona.
   * @type {string}
   */
  correo: string;

  /**
   * Domicilio de la persona.
   * @type {string}
   */
  domicilio: string;

  /**
   * País de residencia de la persona.
   * @type {string}
   */
  pais: string;
}

/**
 * Interfaz para definir la estructura de las filas con detalles adicionales.
 */
export interface Rows {
  /**
   * Nombre de la persona.
   * @type {string}
   */
  nombre: string;

  /**
   * Número de teléfono de la persona.
   * @type {string}
   */
  telefono: string;

  /**
   * Correo electrónico de la persona.
   * @type {string}
   */
  correo: string;

  /**
   * Calle donde reside la persona.
   * @type {string}
   */
  calle: string;

  /**
   * Número exterior del domicilio de la persona.
   * @type {number}
   */
  exterior: number;

  /**
   * Número interior del domicilio de la persona.
   * @type {number}
   */
  interior: number;

  /**
   * País de residencia de la persona.
   * @type {string}
   */
  pais: string;
}
/**
 * Interfaz para definir la estructura de las filas.
 */
export interface Tabla {
  /**
   * Partida arancelaria de la mercancía.
   * @type {string}
   */
  Partida: string;

  /**
   * Tipo de requisito asociado a la mercancía.
   * @type {string}
   */
  Tiporequisito: string;

  /**
   * Requisito específico para la mercancía.
   * @type {string}
   */
  Requisito: string;

  /**
   * Certificado asociado a la mercancía.
   * @type {number}
   */
  Certificado: number;

  /**
   * Fracción arancelaria de la mercancía.
   * @type {string}
   */
  Fraccion: string;

  /**
   * Descripción de la mercancía.
   * @type {string}
   */
  FraccionDescripcion: string;

  /**
   * Nico del responsable de la mercancía.
   * @type {string}
   */
  Nico: string;

  /**
   * Descripción del Nico.
   * @type {string}
   */
  NicoDescripcion: string;

  /**
   * Descripción adicional de la mercancía.
   * @type {string}
   */
  Descripcion: string;

  /**
   * Unidad de medida del tipo de mercancía.
   * @type {string}
   */
  Umt: string;

  /**
   * Cantidad en UMT de la mercancía.
   * @type {number}
   */
  CantidadUMT: number;

  /**
   * Unidad de medida comercial de la mercancía.
   * @type {string}
   */
  Umc: string;

  /**
   * Cantidad en UMC de la mercancía.
   * @type {number}
   */
  CantidadUMC: number;

  /**
   * Especie de la mercancía.
   * @type {string}
   */
  Especie: string;

  /**
   * Uso de la mercancía.
   * @type {string}
   */
  Uso: string;

  /**
   * País de origen de la mercancía.
   * @type {string}
   */
  PaisOrigen: string;

  /**
   * País de procedencia de la mercancía.
   * @type {string}
   */
  PaisProcedencia: string;

  /**
   * Presentación de la mercancía.
   * @type {string}
   */
  Presentacion?: string;

  /**
   * Cantidad de presentación de la mercancía.
   * @type {number}
   */
  CantidadPresentacion?: number;

  /**
   * Tipo de presentación de la mercancía.
   * @type {string}
   */
  TipoPresentacion?: string;

  /**
   * Tipo de planta de la mercancía.
   * @type {string}
   */
  TipoPlanta?: string;

  /**
   * Planta autorizada de origen de la mercancía.
   * @type {string}
   */
  PlantaAutorizadaOrigen?: string;

  /**
   * Certificado internacional electrónico asociado a la mercancía.
   * @type {string}
   */
  CertificadoInternacionalElectronico: string;
}
/**
 * Interfaz que define la estructura de un destinatario.
 */
export interface Exportador {
  /** Nombre o razón social del destinatario. */
  nombre_razon_social: string;
  /** Teléfono del destinatario. */
  telefono: string;
  /** Correo electrónico del destinatario. */
  correo_electronico: string;
  /** domoicilio del destinatario. */
  domicilio: string;
  /** País del destinatario. */
  pais: string;
  
}
/**
 * Interfaz que define la estructura de un destinatario.
 */
export interface Destinatario {
  /** Nombre o razón social del destinatario. */
  nombre_razon_social: string;
  /** Teléfono del destinatario. */
  telefono: string;
  /** Correo electrónico del destinatario. */
  correo_electronico: string;
   /** Calle del destinatario. */
  calle: string;
  /** Número exterior del destinatario. */
  numero_exterior: string;
  /** Número interior del destinatario. */
  numero_interior: string;
  /** País del destinatario. */
  pais: string;
  /** Colonia del destinatario. */
  colonia: string;
  /** Municipio o alcaldía del destinatario. */
  municipio_alcaldia: string;
  /** Entidad federativa del destinatario. */
  entidad_federativa: string;
  /** Código postal del destinatario. */
  codigo_postal: string;
}
export interface DatosGeneralesRevision {
  /** Identificador de la solicitud asociada. */
  id_solicitud: number;

  /** Folio del trámite. */
  folio_tramite: string;

  /** Información del trámite asociado. */
  tramite: {
    /** Clave de la aduana. */
    aduana: string;

    /** Clave de la oficina de inspección. */
    oficina_inspeccion: string;

    /** Clave del punto de inspección. */
    punto_inspeccion: string;

    /** Régimen aplicable. */
    regimen: string;

    /** Número de guía de la mercancía. */
    numero_de_guia: string;

    /** Número del carro de ferrocarril. */
    numero_carro_ferrocarril: string;
    cve_ucon:string
    nom_establecimiento_tif:string;
    nombre_veterinario:string
    coordenadas_geograficas:string
    tipo_mercancia:string
    

  };

  /** Información del transporte asociado. */
  transporte: {
    /** Medio de transporte. */
    medio_transporte: string;

    /** Identificación del transporte. */
    identificacion_transporte: string;

    /** Punto de verificación (puede ser nulo). */
    punto_verificacion: string | null;

    /** Razón social del transportista. */
    razon_social: string;
  };

  
}
 /**
 * Representa la información de una mercancía incluida en la solicitud.
 */
export interface MercanciasLista {
 Partida: string;
  Tiporequisito: string;
  Requisito: string;
  Certificado: number;

  Fraccion: string;
  FraccionDescripcion: string;

  Nico: string;
  NicoDescripcion: string;
  Descripcion: string;

  Umt: string;
  CantidadUMT: number;

  Umc: string;
  CantidadUMC: number;

  Especie: string;
  Uso: string;

  PaisOrigen: string;
  PaisProcedencia: string;

  Presentacion: string;
  CantidadPresentacion: number;
  TipoPresentacion: string;

  TipoPlanta: string;
  PlantaAutorizadaOrigen: string;

  CertificadoInternacionalElectronico: string;
}
export interface MercanciaRevisionApiResponse {
  /** Identificador interno de la mercancía. */
  id_mercancia: number;

  /** Identificador de la solicitud asociada. */
  id_solicitud: number;

  /** Número de partida arancelaria. */
  numero_partida: number;

  /** Tipo de requisito aplicable. */
  tipo_requisito: string;

  /** Descripción del requisito. */
  requisito: string;

  /** Número de certificado internacional electrónico. */
  num_cert_intern: string;

  /** Código de fracción arancelaria. */
  fraccion_arancelaria: string;

  /** Descripción de la fracción arancelaria. */
  desc_de_la_frac: string;

  /** Código NICOD / NICO. */
  nico: string;

  /** Descripción asociada al NICO. */
  descripcion_nico: string;

  /** Descripción adicional (si la API la envía). */
  descripcion?: string;

  /** Unidad de medida tarifaria. */
  unidad_medida_tarifa?: string;

  /** Cantidad en unidad de medida tarifaria. */
  cantidad_umt?: number;

  /** Unidad de medida comercial. */
  unidad_medida_comercial?: string;

  /** Cantidad en unidad de medida comercial. */
  cantidad_umc?: number;

  /** Uso de la mercancía. */
  uso?: string;

  /** Número de lote del producto (si aplica). */
  numero_lote?: string;

  /** País de origen. */
  pais_origen?: string;

  /** País de procedencia. */
  pais_procedencia?: string;
  especie:string
}
export interface PagoDerechosResponse {
  codigo: string;
  mensaje: string;
  datos: PagoDerechos;
}
export interface PagoDerechos {
  /** Indica si el trámite está exento de pago. */
  exento_pago: boolean;

  /** Clave de referencia del pago. */
  clave_de_referencia: string;

  /** Cadena de dependencia asociada al pago. */
  cadena_dependencia: string;

  /** Identificador del banco utilizado para el pago. */
  banco: string;

  /** Llave única generada para el pago. */
  llave_de_pago: string;

  /** Fecha en la que se realizó el pago. */
  fecha_pago: string;

  /** Importe total pagado. */
  imp_pago: number | string;
}
/**
 * Interfaz que representa los datos de la mercancía en la tabla.
 * @interface MercanciaTabla
 */
/**
 * Representa un registro de mercancía utilizado en tablas locales
 * para mostrar o manipular información relacionada con fracciones,
 * descripciones, cantidades y unidades.
 */
export interface MercanciaTabla {
  /**
   * Identificador opcional para diferenciar cada elemento dentro
   * de la lista de mercancías o registros similares.
   */
  id?: number;

  /** Fracción arancelaria correspondiente a la mercancía. */
  fraccionArancelaria: string;

  /** Descripción correspondiente a la fracción arancelaria. */
  descripcionFraccion: string;

  /** Clave NICO asociada a la mercancía. */
  nico: string;

  /** Descripción adicional específica de la mercancía. */
  descripcion: string;

  /** Cantidad de mercancía que falta por capturar. */
  saldoACapturar?: string;

  /** Unidad de medida asignada por la UMT. */
  unidaddeMedidaDeUMT: string;

  /** Cantidad total en unidades de medida de transporte (UMT). */
  cantidadTotalUMT: string |number;

  /** Saldo pendiente de mercancía por revisar o capturar. */
  saldoPendiente?: string|number;

  /** Número de permiso de importación asociado a la mercancía. */
  num_permiso_importacion?: string;
}

/**
 * Representa la estructura de respuesta proveniente de la API
 * cuando se consultan mercancías asociadas a una solicitud,
 * incluyendo cantidades, fracciones y descripciones oficiales.
 */
export interface MercanciaApiResponse {
  /** Identificador de la solicitud a la que pertenece la mercancía. */
  id_solicitud: number;

  /** Número de permiso de importación emitido por la autoridad. */
  num_permiso_importacion: string;

  /** Identificador de mercancía en el sistema gubernamental. */
  id_mercancia_gob: number;

  /** Cantidad total en UMT dada de alta para la mercancía. */
  cant_total_umt: string;

  /** Número de partida correspondiente a la mercancía. */
  numero_partida: number;

  /** Fracción arancelaria oficial. */
  fraccion_arancelaria: string;

  /** Descripción oficial de la fracción arancelaria. */
  descripcion_de_la_fraccion: string;

  /** Unidad de medida de tarifa (UMT). */
  uni_medida_tar: string;

  /** Cantidad solicitada en UMT. */
  cant_soli_umt: number | string;

  /** Clave NICO asignada. */
  nico: string;

  /** Descripción específica del NICO. */
  descripcion_nico: string;

  /** Saldo pendiente registrado para esta mercancía. */
  saldo_pendiente: string;
}

/**
 * Representa la estructura de respuesta relacionada con el historial
 * de carros ferroviarios registrados para una solicitud específica.
 */
export interface HistorialCarrosFerroResponse {
  /** Identificador de la solicitud asociada. */
  idSolicitud: number;

  /** Número total de carros ferroviarios registrados. */
  numTotalCarros: number;

  /** Número de partida asociado a la mercancía transportada. */
  numeroPartidaMercancia: number;
}

/**
 * Representa una entrada del historial de inspecciones físicas realizadas
 * sobre una mercancía, incluyendo cantidades, fechas y saldos.
 */
export interface HistorialInspeccionFisica {
  /** Número de partida de la mercancía inspeccionada. */
  numeroPartidaMercancia: string;

  /** Fracción arancelaria asociada a la mercancía. */
  fraccionArancelaria: string;

  /** Clave NICO. */
  nico: string;

  /** Cantidad registrada en UMT. */
  cantidadUmt: string;

  /** Cantidad inspeccionada físicamente. */
  cantidadInspeccion: string;

  /** Saldo pendiente tras la inspección. */
  saldoPendiente: string;

  /** Fecha de inspección en formato de cadena. */
  fechaInspeccionString: string;

  /** Datos representados en el cuerpo de tabla (opcional). */
  tbodyData?: string[];
}

/**
 * Representa la estructura de respuesta de API correspondiente al historial
 * de inspecciones físicas registradas en el sistema, incluyendo identificadores,
 * cantidades, fechas y claves arancelarias.
 */
export interface HistorialInspeccionFisicaApiResponse {
  /** Identificador de la inspección física. */
  id_inspeccion_fisica: number;

  /** Número de autorización asignado a la inspección. */
  numero_autorizacion: string;

  /** Identificador de la mercancía inspeccionada. */
  id_mercancia: number;

  /** Número de partida dentro de la mercancía. */
  numero_partida_mercancia: number;

  /** Fracción arancelaria registrada. */
  fraccion_arancelaria: number;

  /** Cantidad total en UMT registrada para la inspección. */
  cantidad_umt: number;

  /** Cantidad inspeccionada físicamente. */
  cantidad_inspeccion: number;

  /** Fecha de inspección registrada. */
  fecha_inspeccion: string;

  /** Identificador de la solicitud asociada. */
  id_solicitud: number;

  /** Código NICO correspondiente. */
  clave_nico: string;

  /** Fecha de inspección en formato legible. */
  fecha_inspeccion_string: string;

  /** Saldo pendiente después de la inspección. */
  saldo_pendiente: number | string;
}
