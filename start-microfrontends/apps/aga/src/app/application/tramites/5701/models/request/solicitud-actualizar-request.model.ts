/**
 * Modelo de importador/exportador.
 */
export interface ImportadorExportador {
  /** RFC del importador/exportador */
  rfc: string;
  /** Nombre del importador/exportador */
  nombre: string;
  /** Indica si es industria automotriz */
  industria_automotriz: boolean;
  /** Descripción industria automotriz */
  desc_industrial_automotriz: string;
  /** Indica si tiene programa de fomento */
  programa_fomento: boolean;
  /** Descripción programa de fomento */
  desc_programa_fomento: string;
  /** Indica si tiene IMMEX */
  immex: boolean;
  /** Descripción IMMEX */
  desc_inmex: string;
  /** Indica si tiene número de registro */
  numero_registro: boolean;
  /** Descripción número de registro */
  desc_numero_registro: string;
  /** Certificación A */
  certificacion_a: boolean;
  /** Certificación AA */
  certificacion_aa: boolean;
  /** Certificación AAA */
  certificacion_aaa: boolean;
  /** Indica si es socio comercial */
  socio_comercial: boolean;
  /** ID del socio comercial */
  id_socio_comercial: string;
  /** Indica si tiene OEA */
  oea: boolean;
  /** Indica si tiene revisión de origen */
  revision_origen: boolean;
}

/**
 * Modelo de tipo de servicio.
 */
export interface TipoServicio {
  /** ID del tipo de servicio */
  id_tipo_servicio: number;
  /** ID de la solicitud */
  id_solicitud: number;
  /** Indica si está activo */
  bln_activo: boolean;
  /** Clave del tipo de servicio */
  cve_tipo_servicio: number;
  /** Descripción del tipo de servicio */
  desc_tipo_servicio: string;
  /** Número SVEX */
  numero_svex: string;
  /** Indica si es RNI */
  rni: boolean;
  /** Fecha de inicio del servicio */
  fecha_inicio_servicio: string;
  /** Fecha de fin del servicio */
  fecha_fin_servicio: string;
  /** Hora de inicio del servicio */
  hora_inicio_servicio: string;
  /** Hora de fin del servicio */
  hora_fin_servicio: string;
  /** Patente */
  patente: number;
  /** ID de patentes aduanales */
  id_patentes_aduanales: number;
}

/**
 * Modelo de despacho aduanal.
 */
export interface Despacho {
  /** Aduana de despacho */
  aduana_despacho: string;
  /** ID de la aduana de despacho */
  id_aduana_despacho: string;
  /** ID de sección de despacho */
  id_seccion_despacho: number;
  /** Indica si es LDA */
  bln_lda: boolean;
  /** RFC del despacho */
  rfc_despacho: string;
  /** Indica si es DD */
  bln_dd: boolean;
  /** Folio DDEX */
  folio_ddex: string;
  /** Tipo de despacho */
  tipo_despacho: string;
  /** Nombre del recinto */
  nombre_recinto: string;
  /** Domicilio */
  domicilio: string;
  /** Especifique */
  especifique: string;
  /** Fecha de inicio */
  fecha_inicio: string;
  /** Hora de inicio */
  hora_inicio: string;
  /** Fecha final */
  fecha_final: string;
  /** Hora final */
  hora_fin: string;
  /** Tipo de operación */
  tipo_operacion: string;
  /** Encargo conferido */
  encargo_conferido: boolean;
  /** Relación */
  relacion: boolean;
  /** Indica si es despacho */
  bln_despacho: boolean;
}

/**
 * Modelo de pedimento aduanal.
 */
export interface Pedimento {
  /** ID del pedimento */
  id_pedimento: number;
  /** ID de la solicitud */
  id_solicitud: number;
  /** Número de pedimento */
  numero_pedimento: number;
  /** Patente */
  patente: number;
  /** Pedimento */
  pedimento: string;
  /** Aduana */
  aduana: string;
  /** Tipo de pedimento */
  tipo_pedimento: string;
  /** Números */
  numeros: string;
  /** COVE */
  cove: string;
  /** Indica si está activo */
  bln_activo: boolean;
  /** Fecha de estado WS pedimento */
  fecha_edo_ws_pedimento: string;
  /** Estado del pedimento */
  estado_pedimento: number;
  /** Subestado del pedimento */
  sub_estado_pedimento: number;
  /** Indica si es válido */
  bln_valido_pedimento: boolean;
}

/**
 * Modelo de mercancías.
 */
export interface Mercancias {
  /** País de origen */
  pais_origen: string;
  /** Descripción genérica */
  descripcion_generica: string;
  /** Justificación */
  justificacion: string;
  /** País de procedencia */
  pais_procedencia: string;
}

/**
 * Modelo de transporte de despacho.
 */
export interface TransporteDespacho {
  /** Tipo de transporte */
  tipo_transporte: string;
  /** Empresa transportista */
  emp_transportista: string;
  /** Número de porte */
  numero_porte: string;
  /** Fecha de porte */
  fecha_porte: string;
  /** Marca del transporte */
  marca_transporte: string;
  /** Modelo del transporte */
  modelo_transporte: string;
  /** Placas del transporte */
  placas_transporte: string;
  /** Contenedor del transporte */
  contenedor_transporte: string;
  /** Observaciones */
  observaciones: string;
  /** Número BL */
  numero_bl: string;
  /** Tipo de equipo */
  tipo_equipo: string;
  /** Iniciales del equipo */
  iniciales_equipo: string;
  /** Número de equipo */
  numero_equipo: string;
  /** RFC de la empresa */
  rfc_empresa: string;
  /** Nombre del transportista */
  nombre_transportista: string;
  /** Número de gafete */
  num_gafete: string;
  /** Tipo de transporte destino */
  tipo_transporte_des: string;
  /** Datos de transporte */
  datos_transporte: string;
  /** Descripción del equipo */
  descripcion_equipo: string;
}

/**
 * Modelo de unidad de arribo.
 */
export interface UnidadArribo {
  /** Tipo de transporte */
  tipo_transporte: string;
  /** Empresa transportista */
  emp_transportista: string;
  /** Número de porte */
  numero_porte: string;
  /** Fecha de porte */
  fecha_porte: string;
  /** Marca del transporte */
  marca_transporte: string;
  /** Modelo del transporte */
  modelo_transporte: string;
  /** Placas del transporte */
  placas_transporte: string;
  /** Contenedor del transporte */
  contenedor_transporte: string;
  /** Número BL */
  numero_bl: string;
  /** Tipo de equipo */
  tipo_equipo: string;
  /** Descripción del equipo */
  descripcion_equipo: string;
  /** Iniciales del equipo */
  iniciales_equipo: string;
  /** Número de equipo */
  numero_equipo: string;
  /** Indica si el arribo aéreo está pendiente */
  arribo_pendiente_aereo: boolean;
  /** Guía master aéreo */
  guia_master_aereo: string;
  /** Guía house aéreo */
  guia_house_aereo: string;
  /** Fecha de arribo aéreo */
  fecha_arribo_aereo: string;
  /** Hora de arribo aéreo */
  hora_arribo_aereo: string;
  /** Indica si la guía es válida */
  guia_valida: boolean;
  /** Indica si la guía house es válida */
  guia_house_valida: boolean;
  /** Indica si la guía master es válida */
  guia_master_valida: boolean;
  /** Guía BL marítimo */
  guia_bl_Maritimo: string;
  /** Guía house marítimo */
  guia_house_maritimo: string;
  /** Nombre del buque marítimo */
  nombre_buque_maritimo: string;
  /** Contenedor marítimo */
  contenedor_maritimo: string;
  /** Datos de transporte */
  datos_transporte: string;
  /** Observaciones */
  observaciones: string;
  /** Indica si usa los mismos datos de transporte */
  mismosDatosTransporte: boolean;
  /** Descripción del tipo de transporte */
  tipo_transporte_des: string;
}

/**
 * Modelo de persona responsable.
 */
export interface PersonaResponsable {
  /** ID de la persona */
  id_persona: number;
  /** ID de la solicitud */
  id_solicitud: number;
  /** Gafete */
  gafete: string;
  /** Correo electrónico */
  correo_electronico: string;
  /** Nombre */
  nombre: string;
  /** Apellido paterno */
  apellido_paterno: string;
  /** Apellido materno */
  apellido_materno: string;
}

/**
 * Modelo de fecha SEVEX.
 */
export interface FechaSevex {
  /** ID de la fecha */
  id_fecha: number;
  /** ID de la solicitud */
  id_solicitud: number;
  /** Fecha */
  fecha: string;
  /** Descripción de la fecha */
  fecha_desc: string;
  /** Hora de inicio SVEX */
  hora_inicio_svex: string;
  /** Hora final SVEX */
  hora_final_svex: string;
  /** Hora de inicio RNI */
  hora_inicio_rni: string;
  /** Hora final RNI */
  hora_fin_rni: string;
  /** Indica si está fuera de horario */
  fuera_horario: boolean;
  /** Indica si es el mismo horario */
  mismo_horario: boolean;
}

/**
 * Modelo de persona para notificación.
 */
export interface PersonaNoti {
  /** ID de la persona */
  id_persona: number;
  /** ID de la solicitud */
  id_solicitud: number;
  /** Gafete */
  gafete: string;
  /** Correo electrónico */
  correo_electronico: string;
  /** Nombre */
  nombre: string;
  /** Apellido paterno */
  apellido_paterno: string;
  /** Apellido materno */
  apellido_materno: string;
}

/**
 * Modelo de pago.
 */
export interface Pago {
  /** ID del pago */
  id_pago: number;
  /** ID de la solicitud */
  id_solicitud: number;
  /** Línea de captura */
  linea_captura: string;
  /** Monto */
  monto: number;
  /** Indica si está activo */
  bln_activo: boolean;
  /** ID del módulo */
  id_modulo: number;
  /** Clave del módulo */
  cve_modulo: string;
}

/**
 * Modelo de respuesta para solicitud actualizar.
 */
export interface SolicitudActualizarResponseModel {
  /** Importador/exportador */
  importador_exportador: ImportadorExportador;
  /** Tipo de servicio */
  tipo_servicio: TipoServicio;
  /** Despacho */
  despacho: Despacho;
  /** Pedimentos */
  pedimentos: Pedimento[];
  /** Mercancías */
  mercancias: Mercancias;
  /** Transporte de despacho */
  transporte_despacho: TransporteDespacho;
  /** Unidad de arribo */
  unidad_arribo: UnidadArribo;
  /** Lista de transportes de despacho */
  list_transporte_despacho: TransporteDespacho[];
  /** Lista de unidades de arribo */
  list_unidad_arribo: UnidadArribo[];
  /** Personas responsables */
  persona_responsable: PersonaResponsable[];
  /** Lista de fechas SEVEX */
  list_fechas_sevex: FechaSevex[];
  /** Lista de personas para notificación */
  list_persona_noti: PersonaNoti[];
  /** Lista de pagos */
  lista_pagos: Pago[];
}

/** Modelo de solicitud para actualizar.
 */

export interface ImportadorExportador {
  rfc: string;
  nombre: string;
  industria_automotriz: boolean;
  desc_industrial_automotriz: string;
  programa_fomento: boolean;
  desc_programa_fomento: string;
  immex: boolean;
  desc_inmex: string;
  numero_registro: boolean;
  desc_numero_registro: string;
  certificacion_a: boolean;
  certificacion_aa: boolean;
  certificacion_aaa: boolean;
  socio_comercial: boolean;
  id_socio_comercial: string;
  oea: boolean;
  revision_origen: boolean;
}

/**
 * Modelo de tipo de servicio.
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
 * Modelo de despacho aduanal.
 */
export interface Despacho {
  aduana_despacho: string;
  id_aduana_despacho: string;
  id_seccion_despacho: number;
  bln_lda: boolean;
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
  encargo_conferido: boolean;
  relacion: boolean;
  bln_despacho: boolean;
}

/**
 * Modelo de pedimento aduanal.
 * 
 */
export interface Pedimento {
  id_pedimento: number;
  id_solicitud: number;
  numero_pedimento: number;
  patente: number;
  pedimento: string;
  aduana: string;
  tipo_pedimento: string;
  numeros: string;
  cove: string;
  bln_activo: boolean;
  fecha_edo_ws_pedimento: string;
  estado_pedimento: number;
  sub_estado_pedimento: number;
  bln_valido_pedimento: boolean;
}

/**
 * Modelo de mercancías.
 */
export interface Mercancias {
  pais_origen: string;
  descripcion_generica: string;
  justificacion: string;
  pais_procedencia: string;
}


/**
 * Modelo de transporte de despacho.
 */
export interface TransporteDespacho {
  tipo_transporte: string;
  emp_transportista: string;
  numero_porte: string;
  fecha_porte: string;
  marca_transporte: string;
  modelo_transporte: string;
  placas_transporte: string;
  contenedor_transporte: string;
  observaciones: string;
  numero_bl: string;
  tipo_equipo: string;
  iniciales_equipo: string;
  numero_equipo: string;
  rfc_empresa: string;
  nombre_transportista: string;
  num_gafete: string;
  tipo_transporte_des: string;
  datos_transporte: string;
  descripcion_equipo: string;
}


/**
 * Modelo de unidad de arribo.
 */
export interface UnidadArribo {
  tipo_transporte: string;
  emp_transportista: string;
  numero_porte: string;
  fecha_porte: string;
  marca_transporte: string;
  modelo_transporte: string;
  placas_transporte: string;
  contenedor_transporte: string;
  numero_bl: string;
  tipo_equipo: string;
  descripcion_equipo: string;
  iniciales_equipo: string;
  numero_equipo: string;
  arribo_pendiente_aereo: boolean;
  guia_master_aereo: string;
  guia_house_aereo: string;
  fecha_arribo_aereo: string;
  hora_arribo_aereo: string;
  guia_valida: boolean;
  guia_house_valida: boolean;
  guia_master_valida: boolean;
  guia_bl_Maritimo: string;
  guia_house_maritimo: string;
  nombre_buque_maritimo: string;
  contenedor_maritimo: string;
  datos_transporte: string;
  observaciones: string;
  mismosDatosTransporte: boolean;
  tipo_transporte_des: string
}


/**
 * Modelo de persona responsable.
 */
export interface PersonaResponsable {
  id_persona: number;
  id_solicitud: number;
  gafete: string;
  correo_electronico: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}


/**
 * Modelo de fecha SEVEX.
 */
export interface FechaSevex {
  id_fecha: number;
  id_solicitud: number;
  fecha: string;
  fecha_desc: string;
  hora_inicio_svex: string;
  hora_final_svex: string;
  hora_inicio_rni: string;
  hora_fin_rni: string;
  fuera_horario: boolean;
  mismo_horario: boolean;
}

/**
 * Modelo de persona para notificación.
 */
export interface PersonaNoti {
  id_persona: number;
  id_solicitud: number;
  gafete: string;
  correo_electronico: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

/***
 * Modelo de pago.
 */
export interface Pago {
  linea_captura: string;
  monto: number;
  bln_activo: boolean;
  id_modulo: number;
  cve_modulo: string;
}

/**
 * Modelo de solicitud para actualizar.
 */
export interface SolicitudActualizarRequestModel {
  importador_exportador: ImportadorExportador;
  tipo_servicio: TipoServicio;
  despacho: Despacho;
  pedimentos: Pedimento[];
  mercancias: Mercancias;
  transporte_despacho: TransporteDespacho;
  list_transporte_despacho: TransporteDespacho[];
  list_unidad_arribo: UnidadArribo[];
  persona_responsable: PersonaResponsable[];
  list_fechas_sevex: FechaSevex[];
  list_persona_noti: PersonaNoti[];
  lista_pagos: Pago[];
}