import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosSelect } from '@ng-mf/data-access-user';

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
  idMercancioGob?:number;
  numPermisoImportacion?:string;
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
}

/** Información histórica relacionada con carros ferroviarios de una solicitud. */
export interface HistorialCarrosFerroResponse {
  idSolicitud: number;
  numTotalCarros: number;
  numeroPartidaMercancia: number;
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


/**
 * Interfaz que representa una solicitud u orden.
 */
export interface Solicitud {
   id_solicitud:string|number
  /** Fecha de creación */
  fechaCreacion: string;

  /** Nombre o identificador de la mercancía */
  mercancia: string;

  /** Cantidad solicitada */
  cantidad: string;

  /** Proveedor de la mercancia */
  proovedor: string;
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
/**
 * Definición de la interfaz `TipoContenedor`.
 * Representa un objeto que contiene información sobre un tipo de contenedor.
 */
export interface TipoContenedor {
  /**
   * Propiedad que almacena el tipo de contenedor utilizando la estructura `CatalogosSelect`.
   */
  tipoContenedor: CatalogosSelect;
}

/**
 * Estructura de la respuesta del API para el detalle de la solicitud.
 */
export interface DetalleSolicitudResponse {
id_solicitud: number;
  certificado: string;
  hora_inspeccion: string;
  fecha_inspeccion: string;
  clave_contendor: string;
  datos_certificado: {
    aduana_de_ingreso: string;
    punto_de_inspeccion: string;
    ofic_de_insp_agro: string;
    medio_de_transporte: string | null;
    ident_de_transporte: string | null;
  };
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
  tipoPersona: string | null; // Indica si es persona física o moral
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

export interface MercanciaTablePayload {
  cve_fraccion_arancelaria: string;
  cve_subdivision: string;
  descripcion: string;
  cve_unidad_medida_tarifaria: string;
  cve_pais_origen: string;
  cve_pais_destino: string;
  cantidad_tarifaria: number;
  valor_factura_usd: number;
  precio_unitario: number;
  lote: string;
  fecha_salida: string; // ISO date: YYYY-MM-DD
  observaciones: string;
}


// Payload completo de inspección física
export interface InspeccionFisicaPayload {
  id_solcitud: string | null; // Identificador de la solicitud
  cve_regimen: string | null; // Clave del régimen aplicable
  cve_clasificacion_regimen: string; // Clave de clasificación del régimen
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
    // mercancia: MercanciaTablePayload; // Listado de mercancías validadas 
  cveUCON: string | null; // Clave UCON asociada
  infAdicional: string | null; // Información adicional relevante a la inspección
  bln_generico1:boolean |null
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

