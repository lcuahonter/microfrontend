/**
 * Modelo que representa los datos de un importador o exportador.
 * 
 */
export interface ImportadorExportador {
  rfc: string;
  nombre: string;
  industria_automotriz: boolean;
  desc_industrial_automotriz: string;
  programa_fomento: boolean;
  desc_programa_fomento: string;
  immex: boolean;
  desc_immex: string;
  numero_registro: boolean;
  desc_numero_registro: string;
  certificacion_a: boolean;
  certificacion_aa: boolean;
  certificacion_aaa: boolean;
  socio_comercial: boolean;
  id_socio_comercial: string;
  oea: boolean;
  revisionOrigen: boolean;
}

/**
 * Modelo que representa los datos de despacho.
 */
export interface Despacho {
  aduana_despacho: string;
  id_seccion_despacho: number;
  bln_lda: boolean | null;
  rfc_despacho: string;
  bln_dd: boolean;
  folio_ddex: string;
  tipo_despacho: string;
  nombre_recinto: string;
  domicilio: string;
  especifique: string;
  fecha_inicio: string;
  hora_inicio: string;
  fecha_final: string;
  hora_fin: string;
  tipo_operacion: string;
  encargo_conferido: string | null;
  relacion: string | null;
  bln_despacho: boolean;
}

/**
 * Modelo que representa los datos de transporte de despacho.
 */
export interface TransporteDespacho {
  id_transporte: number | null;
  id_solicitud: number;
  tipo_transporte: string;
  empresa_transportista: string | null;
  num_porte: string | null;
  fecha_carta_porte: string | null;
  marca: string | null;
  modelo: string | null;
  placas: string | null;
  contenedor: string | null;
  observaciones: string;
  num_bl: string | null;
  tipo_equipo: string;
  iniciales_equipo: string;
  numero_equipo: string;
  rfc_empresa_responsable: string | null;
  nombre_transportista: string;
  gafete_transportista: string | null;
  descripcion_tipo_transporte: string | null;
  datos_transporte: string;
}

/**
 * Modelo que representa los datos de unidad de arribo.
 */
export interface UnidadArribo {
  tipo_transporte: string;
  emp_transportista: string | null;
  numero_porte: string | null;
  fecha_porte: string | null;
  marca_transporte: string | null;
  modelo_transporte: string | null;
  placas_transporte: string | null;
  contenedor_transporte: string | null;
  numero_bl: string | null;
  tipo_equipo: string;
  descripcion_equipo: string | null;
  iniciales_equipo: string;
  numero_equipo: string;
  arribo_pendiente_aereo: boolean | null;
  guia_master_aereo: string;
  guia_house_aereo: string;
  fecha_arribo_aereo: string;
  hora_arribo_aereo: string;
  guia_valida: boolean | null;
  guia_house_valida: boolean | null;
  guia_master_valida: boolean | null;
  guia_bl_maritimo: string | null;
  guia_house_maritimo: string;
  nombre_buque_maritimo: string | null;
  contenedor_maritimo: string | null;
  datos_transporte: string;
  observaciones: string;
  mismosDatosTransporte: boolean | null;
}

/**
 * Modelo que representa los datos de mercancía.
 */
export interface Mercancia {
  pais_origen: string;
  descripcion_generica: string;
  justificacion: string;
  pais_procedencia: string;
}


/**
 * Modelo que representa los datos de pedimento.
 */
export interface Pedimento {
  id_pedimento: number;
  numero_pedimento: string;
  patente: number;
  pedimento: string;
  aduana: string;
  numeros: string;
  cove: string;
  estado_pedimento: string;
  sub_estado_pedimento: string;
  pedimento_valido: string;
  tipo_de_pedimento: string;
}

/**
 * Modelo que representa los datos de transporte de despacho.
 */
export interface ListTransporteDespacho {
  id_transporte?: number | null;
  id_solicitud?: number | null;
  tipo_transporte?: string | null;
  emp_transportista?: string | null;
  numero_porte?: string | null;
  fecha_porte?: string | null;
  marca_transporte?: string | null;
  modelo_transporte?: string | null;
  placas_transporte?: string | null;
  contenedor_transporte?: string | null;
  observaciones?: string | null;
  numero_bl?: string | null;
  tipo_equipo: string | null;
  iniciales_equipo?: string | null;
  numero_equipo?: string | null;
  rfc_empresa?: string | null;
  nombre_transportista?: string | null;
  num_gafete?: string | null;
  tipo_transporte_des?: string | null;
  datos_transporte?: string | null;
}


/**
 * Modelo que representa los datos de unidad de arribo.
 */
export interface ListUnidadArribo {
  tipo_transporte?: string | null;
  emp_transportista?: string | null;
  numero_porte?: string | null;
  fecha_porte?: string | null;
  marca_transporte?: string | null;
  modelo_transporte?: string | null;
  placas_transporte?: string | null;
  contenedor_transporte?: string | null;
  numero_bl?: string | null;
  tipo_equipo?: string | null;
  descripcion_equipo?: string | null;
  iniciales_equipo?: string | null;
  numero_equipo?: string | null;
  arribo_pendiente_aereo?: string | null;
  guia_master_aereo?: string | null;
  guia_house_aereo?: string | null;
  fecha_arribo_aereo?: string | null;
  hora_arribo_aereo?: string | null;
  guia_valida?: string | null;
  guia_house_valida?: string | null;
  guia_master_valida?: string | null;
  guia_bl_maritimo?: string | null;
  guia_house_maritimo?: string | null;
  nombre_buque_maritimo?: string | null;
  contenedor_maritimo?: string | null;
  datos_transporte?: string | null;
  observaciones?: string | null;
  mismosDatosTransporte?: string | null;
  tipo_transporte_des?: string | null;
}

/**
 * Modelo que representa los datos de persona responsable.
 */
export interface PersonaResponsable {
  id_persona: number | null;
  id_solicitud: number | null;
  gafete: string;
  correo_electronico: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

/**
 * Modelo que representa los datos de fechas Sevex.
 */
export interface ListFechasSevex {
  id_fecha: number | null;
  id_solicitud: number;
  fecha: string;
  fecha_desc: string | null;
  hora_inicio_svex: string | null;
  hora_final_svex: string | null;
  hora_inicio_rni: string;
  hora_fin_rni: string;
  fuera_horario: boolean;
  mismo_horario: boolean;
}

/**
 * Modelo que representa los datos de tipo de servicio.
 */
export interface TipoServicio {
  id_tipo_servicio: number;
  id_solicitud: number;
  bln_activo: boolean;
  cve_tipo_servicio: number;
  desc_tipo_servicio: string;
  numero_svex: string;
  rni: boolean;
  fecha_inicio_servicio: string;
  fecha_fin_servicio: string;
  hora_inicio_servicio: string;
  hora_fin_servicio: string;
  patente: number;
  id_patentes_aduanales: number;
}

/**
 * Modelo que representa los datos de persona de notificación.
 */
export interface ListPersonaNoti {
  id_persona: number | null;
  id_solicitud: number | null;
  gafete: string | null;
  correo_electronico: string | null;
  nombre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
}

/**
 * Modelo que representa los datos de pago.
 */
export interface ListPagos {
  id_pago: number;
  id_solicitud: number;
  linea_captura: string;
  monto: number;
  bln_activo: boolean;
  id_modulo: number;
  cve_modulo: string;
}

/**
 * Modelo que representa los detalles de una solicitud.
 */
export interface SolicitudDetalleModel {
  patente: string | null;
  id_patentes_aduanales: number | null;
  rni: boolean | null;
  importador_exportador: ImportadorExportador;
  despacho: Despacho;
  transporte_despacho: TransporteDespacho;
  unidad_arribo: UnidadArribo;
  mercancia: Mercancia;
  pedimentos: Pedimento[];
  list_transporte_despacho: ListTransporteDespacho[];
  list_unidad_arribo: ListUnidadArribo[];
  persona_responsable: PersonaResponsable[];
  list_fechas_sevex: ListFechasSevex[];
  tipo_servicio: TipoServicio;
  list_persona_noti: ListPersonaNoti[];
  list_pagos: ListPagos[];
}