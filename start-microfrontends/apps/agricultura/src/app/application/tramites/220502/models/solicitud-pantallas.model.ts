import { Catalogo, CatalogosSelect} from '@ng-mf/data-access-user';
import { MercanciaTabla } from './medio-transporte.model';

// Representa la estructura de una solicitud obtenida desde la API
export interface SolicitudApi {
  id_solicitud: number;
  fecha_creation: string;
  mercancia: string;
  cantidad: string;
  proveedor: string;
}

export interface PuntoInspeccion {
  aduana_de_ingreso: string;
  punto_de_inspeccion: string;
  ofic_de_insp_agro: string;
}

/**
 * Interfaz que representa los detalles de la mercancía.
 */
export interface DatosDeMercancias {
  /** Fracción arancelaria aduanera*/
  fraccionArancelaria: string;

  /** Descripción de la fracción arancelaria aduanera */
  descripcionFraccion: string;

  /** Código NICO (número de identificación específico) */
  nico: string;

  /** Descripción del código NICO */
  nicoDescripcion: string;

  /** Cantidad solicitada en UMT (Tipo de unidad de medida) */
  cantidadSolicitadaUMT: number;

  /** Tipo de unidad de medida */
  unidadMedidaUMT: string;

  /** Cantidad total en UMT */
  cantidadTotalUMT: number;

  /** Saldo pendiente */
  saldoPendiente: number;

  /** Indica si el elemento está seleccionado. */
  selected?: boolean;
}

/**
 * Interfaz que representa detalles de vagones de ferrocarril.
 */
export interface CarrosDeFerrocarril {
  /** Identificación de inspección física */
  idInspeccionFisica: number;

  /** Número de autorización */
  numeroAutorizacion: string;

  /** Número de artículo de mercancía */
  numeroPartidaMercancia: string;

  /** Número total de vagones de ferrocarril */
  numeroTotalCarros: number;
   tbodyData?: string[];
}

// Información de la mercancía a inspeccionar
export interface MercanciaPayload {
  cve_fraccion_arancelaria: string | null; // Clave correspondiente a la fracción arancelaria
  cve_subdivision: string | null; // Clave de subdivisión dentro de la fracción arancelaria
  descripcion: string | null; // Descripción general de la mercancía
  cve_unidad_medida_tarifaria: string | null; // Unidad de medida tarifaria establecida en aduana
  cve_pais_origen: string | null; // País de origen de la mercancía
  cve_pais_destino: string | null; // País destino de la mercancía
  cantidad_tarifaria: number | null; // Cantidad declarada con base en la unidad de tarifa
  valor_factura_usd: number | null; // Valor de la factura expresado en dólares
  precio_unitario: number | null; // Precio unitario de la mercancía
  lote: string | null; // Número o código de lote
  fecha_salida: string | null; // Fecha de salida de la mercancía desde el país de origen
  observaciones: string | null; // Observaciones adicionales relacionadas con la mercancía
}

// Datos del productor de la mercancía
export interface ProductorPayload {
  tipo_persona: boolean | null; // Indica si es persona física o moral
  nombre: string | null; // Nombre del productor (persona física)
  apellido_materno: string | null; // Apellido materno del productor
  apellido_paterno: string | null; // Apellido paterno del productor
  razon_social: string | null; // Razón social (persona moral)
  descripcion_ubicacion: string | null; // Dirección o ubicación de las instalaciones del productor
  rfc: string | null; // Registro Federal de Contribuyentes
  pais: string | null; // País donde se ubica el productor
}

// Información del solicitante del trámite
export interface SolicitantePayload {
  rfc: string | null; // Registro Federal de Contribuyentes del solicitante
  nombre: string | null; // Nombre del solicitante o representante legal
  es_persona_moral: boolean | null; // Indica si el solicitante es persona moral
  certificado_serial_number: string | null; // Número de serie del certificado digital utilizado
}

// Información referente a la representación federal
export interface RepresentacionFederalPayload {
  cve_entidad_federativa: string | null; // Clave de la entidad federativa
  cve_unidad_administrativa: string | null; // Clave de la unidad administrativa responsable
}

// Datos del responsable que realizará la inspección física
export interface ResponsableInspeccionPayload {
  nombre: string | null; // Nombre del responsable de la inspección
  apellido_paterno: string | null; // Apellido paterno del inspector
  apellido_materno: string | null; // Apellido materno del inspector
  num_total_carros: number | null; // Número total de carros o unidades inspeccionados
  cve_contenedor: string | null; // Clave o identificador del contenedor inspeccionado
}

// Información del pago de derechos
export interface PagoDerechosPayload {
  excento_pago: boolean; // Indica si está exento del pago de derechos
  id_pago: number | null; // Identificador del pago realizado
  id_solicitud: string | null; // Identificador de la solicitud asociada al pago
  clave_banco: string | null; // Clave del banco donde se realizó el pago
  ide_tipo_pago: string | null; // Tipo de pago realizado
  importe_pago: number | null; // Monto del pago realizado
  ref_bancaria: string | null; // Referencia bancaria del pago
  fecha_pago: string | null; // Fecha en que se efectuó el pago
  llave_pago: string | null; // Llave única del pago proporcionada por banco
  clave_referencia: string | null; // Clave de referencia asignada al pago
  cadena_pago_dependencia: string | null; // Cadena de validación de la dependencia
  motivo_excento_pago: string | number | null; // Justificación del motivo de exención de pago (si aplica)
}

// Elementos de mercancía consultados en SAGARPA
export interface MercanciaSagarpaItem {
  id_solicitud: number; // Identificador de la solicitud
  num_permiso_importacion: string; // Número de permiso de importación
  id_mercancia_gob: number; // Identificador único de la mercancía en el sistema gubernamental
  cantidad_umt: number |string; // Cantidad basada en unidad de medida tarifaria
  numero_partida: number; // Número de partida en el documento
  feaccion_arancelaria: string; // Fracción arancelaria oficial
  descripcion_arancelaria: string; // Descripción de la fracción arancelaria
  descripcion_unidad_medida: string; // Descripción de la unidad de medida
  cantidad_inspeccionada: number; // Cantidad total inspeccionada
  clave_nico: string; // Clave NICO correspondiente
  descripcion_nico: string; // Descripción asociada a la clave NICO
}

// Payload completo de inspección física
export interface InspeccionFisicaPayload {
  id_solcitud: string | null; // Identificador de la solicitud
  cve_regimen: string | null; // Clave del régimen aplicable
  cve_clasificacion_regimen: string; // Clave de clasificación del régimen
  mercancia: MercanciaPayload; // Datos de mercancía
  productor: ProductorPayload; // Datos del productor
  solicitante: SolicitantePayload; // Datos del solicitante
  numero_certificado: string | number | null; // Número de certificado asociado
  representacion_federal: RepresentacionFederalPayload; // Detalle de representación federal
  fecha_inspeccion: string | null; // Fecha en que se realizará la inspección
  hora_inspeccion: string | number | null; // Hora programada para la inspección
  clave_aduana_ingreso: string | number | null; // Clave de la aduana de ingreso
  clave_oisa: string | number | null; // Clave de la oficina de inspección sanitaria agropecuaria
  punto_inspeccion: string | number | null; // Punto donde se realizará la inspección
  toat_guias: string | null; // Total de guías asociadas
  responsable_inspeccion: ResponsableInspeccionPayload; // Persona responsable de la inspección
  ide_transporte: string | number | null; // Medio de transporte utilizado
  identificacion_transporte: string | null; // Identificador o placas del transporte
  cve_oficina_inspeccion_agropecuaria: string | number | null; // Clave de la oficina de inspección agropecuaria
  ide_contenedor: string | number | null; // Identificador del contenedor
  pago_derechos: PagoDerechosPayload; // Datos del pago de derechos
  mercancia_sagarpa: MercanciaSagarpaItem[]; // Listado de mercancías validadas en SAGARPA
  cveUCON: string | null; // Clave UCON asociada
  infAdicional: string | null; // Información adicional relevante a la inspección
  bln_generico1:boolean |null
}


/**
 * Interfaz que representa el historial de inspecciones físicas.
 */
export interface HistorialInspeccionFisica {
  /** Número de artículo de mercancía*/
  numeroPartidaMercancia: string;

  /** Fracción arancelaria aduanera */
  fraccionArancelaria: string;

  /** código nico */
  nico: string;

  /** Cantidad en UMT */
  cantidadUmt: string;

  /** Cantidad inspeccionada*/
  cantidadInspeccion: string;

  /** Saldo pendiente */
  saldoPendiente: string;

  /** Fecha de inspección en formato de cadena */
  fechaInspeccionString: string;
   tbodyData?: string[];
}

/**
 * Interfaz que representa una solicitud u orden.
 */
export interface Solicitud {

 /** Identificador de la solicitud */
  id_solicitud?: number;

  /** Fecha de creación */
  fechaCreacion: string;

  /** Nombre o identificador de la mercancía */
  mercancia: string;

  /** Cantidad solicitada */
  cantidad: string;

  /** Proveedor de la mercancia */
  proovedor: string;
}

/**
 * Interfaz que representa la estructura de datos de la tabla para mercancías.
 */
export interface MercanciaTablaData {
  /** Fila de encabezado de la tabla de mercancías. */
  hMercanciaTabla: string[];

  /** Datos del cuerpo para la tabla de mercancías. */
  dMercanciaBody: DatosDeMercancias[];
}

/**
 * Interfaz que representa la estructura de carga de datos inicial.
 */
export interface CargarDatosIniciales {
  /** Encabezados para el historial de inspección */
  hHistorialinspeccion: string[];

  /** Datos del historial de inspección */
  dHistorialInspecciones: HistorialInspeccionFisica[];

  /** Datos de vagones de ferrocarril */
  dCarrosDeFerrocarril: CarrosDeFerrocarril[];

  /** Cabeceras para mesa de vagones de ferrocarril */
  hCarroFerrocarril: string[];

  /** Encabezados para solicitudes */
  hSolicitud: string[];

  /** Solicitar datos */
  dSolicitud: Solicitud[];

  /** Headers for merchandise */
  hMerchandise: string[];

  /** encabezados para mercancia */
  dMercancia: DatosDeMercancias[];

  /** Medio de transporte */
  medioDeTransporte: CatalogosSelect;
  /**
   * @description
   * Lista completa de objetos de tipo `MercanciaTabla` administrados por el componente.
   *
   * Esta colección contiene todas las mercancías registradas o cargadas desde el servicio
   * y sirve como fuente de datos principal para mostrar en la tabla de mercancías.
   *
   * A diferencia de `mercanciaSeleccionLista`, que guarda únicamente las seleccionadas,
   * esta propiedad representa el inventario total disponible.
   */
  mercanciaLista: MercanciaTabla[];
}
/**
 * Interfaz que representa los datos del trámite realizar.
 */
export interface DatosDelTramiteRealizar {
  /** Clave de control */
  pendientesCertificados: Catalogo[];
  /** Certificados autorizados */
  horaInspeccion: Catalogo[];
  /** Hora de inspección */
  aduanaIngreso: Catalogo[];
  /** Aduana de ingreso */
  sanidadAgropecuaria: Catalogo[];
  /** Oficina de inspección de Sanidad Agropecuaria */
  puntoInspeccion: Catalogo[];
}
/**
 * Interfaz que representa un tipo de contenedor dentro del sistema.
 * Contiene un catálogo de opciones disponibles para la selección.
 */
export interface TipoContenedor {
  /**
   * Catálogo del tipo de contenedor disponible para selección.
   */
  tipoContenedor: CatalogosSelect;
}

/**
 * Representa los datos de la solicitud a procesar.
 */
export interface DatosDeLaSolicitud {
  /**
   * Identificador del certificado autorizado.
   */
  certificadosAutorizados: number;

  /**
   * Hora programada para la inspección (formato 24 horas).
   */
  horaDeInspeccion: number;

  /**
   * Identificador de la aduana de ingreso.
   */
  aduanaDeIngreso: number;

  /**
   * Indicador de sanidad agropecuaria requerida.
   */
  sanidadAgropecuaria: number;

  /**
   * Identificador del punto de inspección.
   */
  puntoDeInspeccion: number;

  /**
   * Fecha programada para la inspección (formato YYYY-MM-DD).
   */
  fechaDeInspeccion: string;

  /**
   * Nombre de la persona responsable de la solicitud.
   */
  nombre: string;

  /**
   * Primer apellido de la persona responsable.
   */
  primerapellido: string;

  /**
   * Segundo apellido de la persona responsable.
   */
  segundoapellido: string;

  /**
   * Nombre o descripción de la mercancía.
   */
  mercancia: string;

  /**
   * Tipo de contenedor utilizado.
   */
  tipocontenedor: number;

  /**
   * Medio de transporte (identificador del tipo de transporte).
   */
  transporteIdMedio: number;

  /**
   * Identificación del medio de transporte.
   */
  identificacionTransporte: string;

  /**
   * Indica si es una solicitud ferroviaria.
   * Puede ser un número o texto (por ejemplo: 'sí', 'no').
   */
  esSolicitudFerros: string | number;

  /**
   * Total de guías amparadas por la solicitud.
   */
  totalDeGuiasAmparadas: string;

  /**
   * Indica si está exento de pago.
   */
  exentoPagoNo: number | string;
  /**
   * Justificación del pago.
   */
  justificacion: number | string;
  /**
   * Clave de referencia del pago.
   */
  claveReferencia: string;
  /**
   * Cadena de dependencia.
   */
  cadenaDependencia: string;
  /**
   * Banco asociado al pago.
   */
  banco: number;
  /**
   * Llave de pago.
   */
  llavePago: string;
  /**
   * Importe del pago.
   */
  importePago: string;
  /**
   * Fecha del pago.
   */
  fetchapago: string;

  /**
   * Aduana de ingreso.
   */
  aduanaIngreso: number;
  /**
   * Oficina de inspección.
   */
  oficinaInspeccion: number;
  /**
   * Punto de inspección.
   */
  puntoInspeccion: number;

  /**
   * Nombre o identificador del ferrocarril asociado al trámite.
   */
  ferrocarril: string;

  /**
   * Número de guía.
   */
  numeroguia: string;
  /**
   * Régimen aduanero.
   */
  regimen: number;

  /**
   * Coordenadas de la ubicación.
   */
  coordenadas: string;
  /**
   * Tipo de movilización.
   */
  movilizacion: number;
  /**
   * Tipo de transporte.
   */
  transporte: string;
  /**
   * Punto de inspección.
   */
  punto: number;
  /**
   * Nombre de la empresa.
   */
  nombreEmpresa: number;
  /**
   * Folio de la solicitud.
   */
  foliodel: string;
}
/** Respuesta de la API con información de mercancías asociadas a una solicitud. */
export interface MercanciaApiResponse {
  id_solicitud: number;
  num_permiso_importacion: string;
  id_mercancia_gob: number;
  cant_total_umt: string;
  numero_partida: number;
  fraccion_arancelaria: string;
  descripcion_de_la_fraccion: string;
  uni_medida_tar: string;
  cant_soli_umt: number |string;
  nico: string;
  descripcion_nico: string;
  saldo_pendiente:string 
}

/** Registro detallado del historial de inspecciones físicas realizadas. */
export interface HistorialInspeccionFisicaApiResponse {
  id_inspeccion_fisica: number;
  numero_autorizacion: string;
  id_mercancia: number;
  numero_partida_mercancia: number;
  fraccion_arancelaria: number;
  cantidad_umt: number;
  cantidad_inspeccion: number;
  fecha_inspeccion: string;
  id_solicitud: number;
  clave_nico: string;
  fecha_inspeccion_string: string;
  saldo_pendiente: number |string;
}

/** Información de mercancías obtenida durante el proceso de revisión. */
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
}

/** Datos generales y administrativos asociados a una solicitud en revisión. */
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

/** Respuesta del servicio de pago de derechos. */
export interface PagoDerechosResponse {
  codigo: string;
  mensaje: string;
  datos: PagoDerechos;
}

/** Información detallada del pago de derechos de un trámite. */
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

/** Respuesta del servicio con los datos de una inspección física. */
export interface InspeccionFisicaResponse {
  /** Código de la operación */
  codigo: string;

  /** Mensaje de la operación */
  mensaje: string;

  /** Datos de la inspección física */
  datos: {
    /** Identificador de la solicitud */
    id_solicitud?: string;
    /** Datos del certificado */
    datosCertificado: {
      aduana_de_ingreso: string;
      punto_de_inspeccion: string;
      ofic_de_insp_agro: string;
      medio_de_transporte: string | null;
      ident_de_transporte: string | null;
    };

    /** Número de certificado */
    certificado: string;

    /** Hora de inspección */
    hora_inspeccion: string;

    /** Lista de mercancías en la grid (opcional) */
    grid_vista_mercancias?: Array<{
      id_solicitud: number;
      fraccion_arancelaria: string;
      descripcion_de_la_fraccion: string;
      nico: string;
      descripcion_nico: string;
      cant_soli_umt: number;
      uni_medida_tar: string;
      cant_total_umt: number;
      num_permiso_importacion: string;
      id_mercancia_gob: number;
      numero_partida: number;
      saldo_pendiente: number;
    }>;
  };
}

/** Datos enviados o recibidos para registrar o consultar una solicitud de inspección. */
export interface SolicitudDatos {
  id_solicitud?: number |string;
  certificado: string;
  hora_inspeccion: string;
  cant_de_contenedores?: number;
  clave_contendor?: string;
  fecha_inspeccion?:string,
  persona_inspeccion?: {
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
  };
  datos_certificado?: {
    aduana_de_ingreso: string;
    punto_de_inspeccion: string;
    ofic_de_insp_agro: string;
    medio_de_transporte: string | null;
    ident_de_transporte: string | null;
  };
}

/** Información histórica relacionada con carros ferroviarios de una solicitud. */
export interface HistorialCarrosFerroResponse {
  idSolicitud: number;
  numTotalCarros: number;
  numeroPartidaMercancia: number;
}

/** Respuesta del proceso de inicio de trámite o generación de folio. */
export interface IniciarResponse {
  codigo?: string;
  mensaje?: string;
  datos?: {
    cadena_original?: string;
    id_solicitud?: number;
    cve_folio_caat?: string;
    num_folio_caat?: string;
    fecha_de_vigencia?: string;
    is_extranjero?: boolean;
    mensaje?: string;
    documento_detalle?: {
      llave_archivo?: string;
      nombre_archivo?: string;
      contenido?: string; // base64 if returned
    };
  };
}

/** Solicitud utilizada para generar la cadena original basada en documentos requeridos. */
export interface CadenaOriginalRequest{
  documentos_requeridos: Array<{
    id_documento_seleccionado: number;
  }>;
}

/** Respuesta que contiene la cadena original generada para el trámite. */
export interface CadenaOriginalResponse {
  codigo: string;   
  mensaje: string;   
  datos: string;      
}
