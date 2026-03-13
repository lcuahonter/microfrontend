/**
 * Modelos utilizados en el trámite 32503.
 * 
 * Este archivo contiene las interfaces que definen las estructuras de datos utilizadas
 * en el trámite de aviso de traslado, incluyendo catálogos, datos del solicitante,
 * tablas de avisos, tablas de mercancías, formularios y documentos.
 */

/**
 * Representa un elemento de un catálogo.
 */
export interface Catalogo {
  /**
   * Identificador único del elemento del catálogo.
   */
  id: number;

  /**
   * Descripción del elemento del catálogo.
   */
  descripcion: string;
  /**
   * Clave del catalogo
   */
  clave: string;
}

/**
 * Representa una lista de elementos de un catálogo.
 */
export interface CatalogoLista {
  /**
   * Lista de elementos del catálogo.
   */
  datos: Catalogo[];
}

/**
 * Representa una acción de un botón en el wizard.
 */
export interface AccionBoton {
  /**
   * Acción realizada por el botón (e.g., "cont" para continuar, "atras" para retroceder).
   */
  accion: string;

  /**
   * Valor asociado a la acción (e.g., índice del paso en el wizard).
   */
  valor: number;
}

/**
 * Representa la respuesta de un servicio que devuelve un catálogo.
 */
export interface RespuestaCatalogos {
  /**
   * Código de respuesta del servicio.
   */
  code: number;

  /**
   * Lista de elementos del catálogo.
   */
  data: Catalogo[];

  /**
   * Mensaje de respuesta del servicio.
   */
  message: string;
}

/**
 * Representa los datos generales del solicitante.
 */
export interface DatosSolicitante {
  rfc: string;
  denominacion: string;
  actividadEconomica: string;
  correoElectronico: string;
  pais: string;
  codigoPostal: string;
  entidadFederativa: string;
  cveEntidadFederativa: string;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  nExt: string;
  nInt: string;
  lada: string;
  telefono: string;
  adace: string;
  tipoPersona: string;
}

/**
 * Representa un aviso en la tabla de avisos.
 */
export interface AvisoTabla {
  idTransaccionVUCEM: string;
  cantidad: string;
  pesoKg: string;
  cveUnidadMedida: string;
  descripcionUnidadMedida: string;
  descripcion: string;
  siIdTransaccion: string;
}

/**
 * Representa los datos de la tabla de avisos.
 */
export interface AvisoTablaDatos {
  /**
   * Lista de avisos en la tabla.
   */
  datos: AvisoTabla[];
}


/**
 * Representa el formulario de un aviso.
 */
export interface AvisoFormulario {
  idSolicitud: string;
  adace: string;
  cveUnidadAdministrativa: string;
  valorProgramaImmex: string;
  valorAnioProgramaImmex: string;
  tipoBusqueda: string;
  levantaActa: string;
  levantaActaClave: string;
  tipoAviso: string;
  idTransaccion: string;
  motivoProrroga: string;
  fechaTranslado: string;
  nombreComercial: string;
  claveEntidadFederativa: string;
  claveDelegacionMunicipio: string;
  claveColonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  tipoCarga: string;
  siIdTransaccion: string
  transaccionId: string;
  cantidad: string;
  peso: string;
  unidadMedida:string;
  descripcion: string;
  

}

/**
 * @interface RespuestaConsulta
 * @description Representa la respuesta de la API para una consulta.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {ConsultaDatos} datos - Datos de la consulta.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaConsulta {
  codigo: string;
  datos: ConsultaDatos;
  message: string;
}

/**
 * @interface RespuestaCatalogos
 *  @description Representa la respuesta de una consulta a un catálogo.
 *  @property {boolean} success - Indica si la consulta fue exitosa.
 *  @property {CatalogoLista} datos - Datos del catálogo consultado.
 *   @property {string} message - Mensaje de la respuesta.
 */ 
export interface ConsultaDatos {
  cveParametro: string;
  descripcion: string;
  valor: string;
}

/**
 * @interface RespuestaConsulta
 * @description Representa la respuesta de la API para una consulta.
 *
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {ConsultaDatos} datos - Datos de la consulta.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaSolicitud {
  codigo: string;
  datos: ConsultaSolicitud;
  message: string;
}

/**
 * @interface ConsultaSolicitud
 *  @description Representa la respuesta de una consulta a un catálogo.
 *  @property {boolean} success - Indica si la consulta fue exitosa.
 *  @property {CatalogoLista} datos - Datos del catálogo consultado.
 *   @property {string} message - Mensaje de la respuesta.
 */
export interface ConsultaSolicitud {
  valor_programa_immex: string;
  valor_anio_programa_immex: string;
  adace: string;
  tipo_aviso: string;
  levanta_acta: string;
  tipo_busqueda: string;
  mercancias: AvisoTablaResponse[];
}

/**
 * Representa un respuesta de la consulta de aviso.
 */
export interface AvisoTablaResponse {
  id_transaccion_vucem: string;
  cantidad: string;
  peso_kg: string;
  cve_unidad_medida: string;
  descripcion_unidad_medida: string;
  descripcion: string;
  si_id_transaccion: string;
}

export interface RespuestaGuardarSolicitud {
  id_solicitud: string;
  fecha_creacion: string;
}

export interface GuardarSolicitudRequest {
  id_solicitud?: number;
  // TODO ver si los seguimos usando
  // cveRegimen: string;
  // cveClasificacionRegimen: string;
  solicitante: SolicitanteRequest;
  representacion_federal: RepresentacionFederalRequest;
  num_immex: string;
  anio_immex: string;
  adace_solicitante: string;
  acudio_adace: boolean;
  lista_mercancias_entrada: MercanciaSTDTO[];
}

export interface SolicitanteRequest {
  rfc: string;
  nombre: string;
  es_persona_moral: boolean;
  certificado_serial_number?: string;
}

export interface RepresentacionFederalRequest {
  cve_entidad_federativa: string;
  cve_unidad_administrativa: string;
}

export interface MercanciaSTDTO {
  numero_serie?: string;
  cantidad?: number;
  peso?: number;
  cve_unidad_medida?: string;
  desc_unidad_medida?: string;
  descripcion_mercancia?: string;
  id_solicitud?: string;
  id_mercancia_st?: string;
  activo_id_transaccion?: string;
}

export interface DocumentoApiResponse {
  documento_tramite: DocumentoTramite[];
  documento_fraccion: unknown[];
  documento_fraccion_esquema: unknown[];
  documento_mecanismo: unknown[];
  documento_programa: unknown[];
}

export interface DocumentoTramite {
  tipo_documento: TipoDocumento;
  especifico: boolean;
  ide_clasificacion_documento: string;
  ide_tipo_solicitante_rfe: string | null;
  fecha_ini_vigencia: string;
  fecha_fin_vigencia: string | null;
  activo: boolean;
  solo_anexar: boolean | null;
  ide_regla_anexado: string | null;
}

export interface TipoDocumento {
  id_tipo_documento: number;
  tipo_documento: string;
  fecha_captura: string;
  fecha_fin_vigencia: string | null;
  fecha_ini_vigencia: string;
  activo: boolean;
  ide_rango_resolucion_imagen: string;
  tamanio_maximo: number;
}

export interface FirmarSolicitudRequest {
  cadena_original: string;
  cert_serial_number: string;
  clave_usuario: string;
  fecha_firma: string;
  clave_rol: string;
  sello: string;
  fecha_fin_vigencia: string;
  documentos_requeridos?: DocumentoRequerido[];
}

export interface DocumentoRequerido {
  id_documento_seleccionado: number;
  hash_documento?: string;
  sello_documento?: string;
}

/**
 * Interface para la solicitud de generación de cadena original
 */
export interface GeneraCadenaOriginalSolicitudRequest {
  /** Representa el número del folio del tramite */
  num_folio_tramite: string;

  /** Representa si es extranjero */
  boolean_extranjero: boolean;

  /** Representa los documentos requeridos */
  documento_requerido?: DocumentoRequerido[];

  /** Representa los datos del solicitante */
  solicitante: SolicitanteRequest;

  /** Representa la clave del rol capturista */
  cve_rol_capturista: string;

  /** Representa la clave del usuario capturista */
  cve_usuario_capturista: string;

  /** Representa la fecha de la firma (formato: YYYY-MM-DD HH:mm:ss) */
  fecha_firma: string;
}





