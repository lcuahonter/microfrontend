import { Catalogo } from "../state/Tramite32508.store";

/**
 * Interfaz que representa la respuesta de una consulta general.
 */
export interface RespuestaConsulta {
  /**
   * Código de respuesta del servicio.
   */
  codigo: string;

  /**
   * Indica si la operación fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos obtenidos de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

/**
 * Interfaz que representa los datos generales obtenidos de una consulta.
 */
export interface ConsultaDatos {
  /**
   * Clave del fiscalizado.
   * @type {string}
   */
  claveFiscalizado: string;

  /**
   * adace.
   * @type {string}
   */
  adace: string;

  /**
   * Tipo de dictamen.
   * @type {string}
   */
  tipoDictamen: string;

  /**
   * RFC del fiscalizado.
   * @type {string}
   */
  rfc: string;

  /**
   * Nombre del fiscalizado.
   * @type {string}
   */
  nombre: string;

  /**
   * Número de inscripción.
   * @type {string}
   */
  numeroInscripcion: string;

  /**
   * Catálogo de años.
   * @type {Catalogo[] | null}
   */
  ano: Catalogo[] | null;

  /**
   * Catálogo de meses.
   * @type {Catalogo[] | null}
   */
  mes: Catalogo[] | null;

  /**
   * Opción seleccionada en el radio parcial.
   * @type {string}
   */
  radioParcial: string;

  /**
   * Opción seleccionada en el radio total.
   * @type {string}
   */
  radioTotal: string;

  /**
   * Saldo pendiente del dictamen anterior.
   * @type {string}
   */
  saldoPendiente: string;

  /**
   * Aprovechamiento total a cargo.
   * @type {string}
   */
  aprovechamiento: string;

  /**
   * Disminución aplicada.
   * @type {string}
   */
  disminucionAplicada: string;

  /**
   * Compensación aplicada.
   * @type {string}
   */
  compensacionAplicada: string;

  /**
   * Saldo pendiente por disminuir.
   * @type {string}
   */
  saldoPendienteDisminuir: string;

  /**
   * Cantidad pagada.
   * @type {string}
   */
  cantidad: string;

  /**
   * Llave de pago.
   * @type {string}
   */
  llaveDePago: string;

  /**
   * Archivos adjuntos.
   * @type {File[]}
   */
  archivo: File[];

  /**
   * Fecha de pago.
   * @type {string}
   */
  fechaPago: string;

  /**
   * Fecha de elaboración.
   * @type {string}
   */
  fechaElaboracion: string;

  /**
   * Saldo pendiente por compensar.
   * @type {string}
   */
  saldoPendienteCompensar: string;

  /**
   * Lista de datos relacionados con la mercancía.
   * @type {Array<any>}
   */
  datosDelMercancia: [];
}

/**
* @interface RespuestaConsultaAdace
* @description Representa la respuesta de la API para una consulta.
*
* @property {boolean} success - Indica si la operación fue exitosa.
* @property {ConsultaDatosAdace} datos - Datos de la consulta.
* @property {string} message - Mensaje de la respuesta.
*/
export interface RespuestaConsultaAdace {
  codigo: string;
  datos: ConsultaDatosAdace;
  message: string;
}

/**
 * @interface RespuestaCatalogos
 *  @description Representa la respuesta de una consulta a un catálogo.
 *  @property {boolean} success - Indica si la consulta fue exitosa.
 *  @property {CatalogoLista} datos - Datos del catálogo consultado.
 *   @property {string} message - Mensaje de la respuesta.
 */
export interface ConsultaDatosAdace {
  cve_parametro: string;
  descripcion: string;
  valor: string;
}

/**
 * Respuesta de carga de archivo de dictamen
 */
export interface CargaArchivoDictamenResponse {
  error: boolean;
  mensaje: string;
  lista_disminucion: DictamenDisminucionDto[];
  lista_compensacion: DictamenCompensacionDto[];
}

/**
 * DTO de dictamen de disminución
 */
export interface DictamenDisminucionDto {
  /** Identificador de la plantilla de dictamen */
  id_dictamen_plant_dism?: number;

  /** Identificador único de la solicitud */
  id_solicitud: number;

  /** Programa autorizado */
  programa_autorizado: string;

  /** Obra realizada */
  obra_realizada: string;

  /** Etapa de la obra */
  etapa_obra: string;

  /** Periodo de la obra */
  periodo_obra: string;

  /** Valor unitario de la obra */
  valor_unitario: number;

  /** Valor total de la obra */
  valor_total: number;

  /** Remanente de disminución al inicio del periodo */
  remanente_dism_ini_periodo: number;

  /** Monto original de la inversión */
  monto_original_inversion: number;

  /** Cantidad disminuida en el periodo */
  cantidad_disminuida_periodo: number;

  /** Saldo pendiente por disminuir */
  saldo_pendiente_disminuir: number;

  /** Indica si el registro está activo */
  bln_activo: boolean;
}

/**
 * DTO de dictamen de compensación
 */
export interface DictamenCompensacionDto {
  /** Número de conocimiento de embarque */
  num_conocimiento_embarque: string;

  /** Descripción de la mercancía */
  desc_mercancia: string;

  /** Fecha de ingreso */
  fecha_ingreso: string | Date;

  /** Número de oficio de paso de mercancía */
  num_oficio_paso_merca: string;

  /** Fecha de paso de mercancía */
  fecha_paso_merca: string | Date;

  /** Número de oficio de retirada de mercancía */
  num_oficio_retirada_merca: string;

  /** Fecha de retirada */
  fecha_retirada: string | Date;

  /** Número de control */
  num_control: string;

  /** Días de almacenaje */
  dias_almacenaje: number;

  /** Elementos a calcular */
  elementos_calcular: string;

  /** Peso de la mercancía */
  peso_mercancia: number;

  /** Cuota */
  cuota: number;

  /** Espacio volumétrico */
  espacio_volumetrico: number;

  /** Motivo de la cuota */
  motivo_cuota: string;

  /** Importe */
  importe: number;

  /** Indica si el registro está activo */
  bln_activo: boolean;
}

export interface GuardarSolicitudRequest {
  id_solicitud?: number;
  solicitante: SolicitanteRequest;
  representacion_federal: RepresentacionFederalRequest;
  lista_disminucion: DictamenDisminucionDto[];
  lista_compensacion: DictamenCompensacionDto[];
  dictamen: DictamenRequest;
}

export interface RespuestaGuardarSolicitud {
  id_solicitud: string;
  fecha_creacion: string;
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

/**
 * Request para dictamen
 */
export interface DictamenRequest {
  /** Clave del recinto */
  clave_recinto: string;

  /** RFC del contribuyente */
  rfc: string;

  /** Nombre del contribuyente */
  nombre: string;

  /** Número de inscripción */
  numero_inscripcion: string;

  /** Año del periodo */
  anio_periodo: string;

  /** Mes del periodo */
  mes_periodo: string;

  /** Fecha de elaboración */
  fec_elaboracion: string;

  /** Saldo a compensar anterior */
  saldo_compensar_anterior: string;

  /** Saldo a disminuir anterior */
  saldo_disminuir_anterior: string;

  /** Aprovechamiento total */
  aprovechamiento_total: string;

  /** Compensación aplicada */
  compensacion_aplicada: string;

  /** Disminución aplicada */
  disminucion_aplicada: string;

  /** Saldo a compensar */
  saldo_compensar: string;

  /** Saldo a disminuir */
  saldo_disminuir: string;

  /** Cantidad pagada */
  cantidad_pagada: string;

  /** Llave de pago */
  llave_de_pago: string;

  /** Fecha de pago */
  fecha_pago: string;

  /** Tipo de dictamen */
  tipo_dictamen: string;

  /** Pago del aprovechamiento */
  pago_aprovechamiento: string;

  /** Aprovechamiento */
  aprovechamiento: string;

  /** Total de ingresos por prestación */
  total_ingresos_prestracion: string;

  /** Cantidad dictaminada */
  cantidad_dictaminada: string;

  /** Indica si se requiere plantilla de disminución */
  plantilla_disminucion: boolean;

  /** Indica si se requiere plantilla de compensación */
  plantilla_compensacion: boolean;
}

/**
 * Interface para la consulta del dictamen
 */
export interface ConsultaDictamen {
  /** Representa la clave del recinto. */
  clave_recinto: string;

  /** Representa el RFC del contribuyente. */
  rfc: string;

  /** Representa el nombre del contribuyente. */
  nombre: string;

  /** Representa el número de inscripción. */
  numero_inscripcion: string;

  /** Representa el año del periodo. */
  anio_periodo: string;

  /** Representa el mes del periodo. */
  mes_periodo: string;

  /** Representa la fecha de elaboración. */
  fec_elaboracion: string;

  /** Representa el saldo a compensar anterior. */
  saldo_compensar_anterior: string;

  /** Representa el saldo a disminuir anterior. */
  saldo_disminuir_anterior: string;

  /** Representa el aprovechamiento total. */
  aprovechamiento_total: string;

  /** Representa la compensación aplicada. */
  compensacion_aplicada: string;

  /** Representa la disminución aplicada. */
  disminucion_aplicada: string;

  /** Representa el saldo a compensar. */
  saldo_compensar: string;

  /** Representa el saldo a disminuir. */
  saldo_disminuir: string;

  /** Representa la cantidad pagada. */
  cantidad_pagada: string;

  /** Representa la llave de pago. */
  llave_de_pago: string;

  /** Representa la fecha de pago. */
  fecha_pago: string;

  /** Representa el tipo de dictamen. */
  tipo_dictamen: string;

  /** Representa el pago del aprovechamiento. */
  pago_aprovechamiento: string;

  /** Representa el aprovechamiento. */
  aprovechamiento: string;

  /** Representa el total de ingresos por prestación. */
  total_ingresos_prestracion: string;

  /** Representa la cantidad dictaminada. */
  cantidad_dictaminada: string;

  /** Representa si se requiere plantilla de disminución. */
  plantilla_disminucion: boolean;

  /** Representa si se requiere plantilla de compensación. */
  plantilla_compensacion: boolean;
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

/**
 * Request para firmar la solicitud del trámite 32508
 */
export interface FirmarSolicitudRequest {
  /** Cadena original en formato hexadecimal */
  cadena_original: string;

  /** Número de serie del certificado */
  cert_serial_number: string;

  /** Clave del usuario que firma */
  clave_usuario: string;

  /** Fecha de la firma */
  fecha_firma: string;

  /** Clave del rol del usuario */
  clave_rol: string;

  /** Sello digital en formato hexadecimal */
  sello: string;

  /** Fecha de fin de vigencia del certificado */
  fecha_fin_vigencia: string;

  /** Array de documentos requeridos para la firma */
  documentos_requeridos?: DocumentoRequerido[];
}

/**
 * Documento requerido para firmar
 */
export interface DocumentoRequerido {
  /** ID del documento seleccionado */
  id_documento_seleccionado: number;

  /** Hash del documento */
  hash_documento?: string;

  /** Sello del documento */
  sello_documento?: string;
}