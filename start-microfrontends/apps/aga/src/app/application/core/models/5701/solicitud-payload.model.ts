import { TransporteDespacho } from '@libs/shared/data-access-user/src';

/**
 * Modelo que representa la carga útil (payload) de una solicitud.
 *
 * @property id_solicitud Identificador único de la solicitud. Puede ser nulo si la solicitud aún no ha sido creada.
 * @property id_tipo_tramite Identificador del tipo de trámite asociado a la solicitud.
 * @property costo_total Costo total del trámite, representado como una cadena.
 * @property rfc RFC del solicitante.
 * @property representante_legal Información del representante legal asociado a la solicitud.
 * @property datos_tramite Datos específicos del trámite solicitado.
 */
export interface SolicitudPayload {
  id_solicitud: number | null;
  id_tipo_tramite: number;
  cve_unidad_administrativa: string;
  costo_total: string;
  rfc: string;
  representante_legal: RepresentanteLegal;
  datos_tramite: DatosTramite;
}

/**
 * Representa la información de un representante legal.
 *
 * @property rfc - RFC del representante legal.
 * @property telefono - Número de teléfono de contacto.
 * @property nombre - Nombre(s) del representante legal.
 * @property ap_paterno - Apellido paterno del representante legal.
 * @property ap_materno - Apellido materno del representante legal.
 */
/**
 * Representa los datos de un representante legal.
 *
 * @property rfc - Registro Federal de Contribuyentes del representante legal.
 * @property telefono - Número de teléfono de contacto del representante legal.
 * @property nombre - Nombre(s) del representante legal.
 * @property ap_paterno - Apellido paterno del representante legal.
 * @property ap_materno - Apellido materno del representante legal.
 */
export interface RepresentanteLegal {
  rfc: string;
  telefono: string;
  nombre: string;
  ap_paterno: string;
  ap_materno: string;
}

/**
 * Representa los datos principales de un trámite.
 *
 * @property importador_exportador Información del importador o exportador.
 * @property despacho Detalles del despacho aduanal.
 * @property pedimentos Lista opcional de pedimentos asociados al trámite.
 * @property tipo_servicio Tipo de servicio solicitado.
 * @property lista_pagos Lista de pagos realizados o requeridos.
 * @property mercancias Información de las mercancías involucradas en el trámite.
 * @property tipo_transporte_despacho (Opcional) Tipo de transporte utilizado para el despacho.
 * @property list_transporte_despacho (Opcional) Lista de transportes utilizados para el despacho, puede ser ferroviario, carretero, peatonal u otro.
 * @property tipo_transporte_arribo (Opcional) Tipo de transporte utilizado para el arribo.
 * @property list_unidad_arribo (Opcional) Lista de unidades de transporte utilizadas para el arribo, puede ser carretero, ferroviario, aéreo, marítimo u otro.
 * @property persona_responsable (Opcional) Lista de personas responsables del despacho.
 * @property list_fechas_sevex (Opcional) Lista de fechas relevantes para SEVEX.
 * @property list_persona_noti (Opcional) Lista de personas notificadas en el trámite.
 */
export interface DatosTramite {
  importador_exportador: ImportadorExportador;
  despacho: Despacho;
  pedimentos?: Pedimento[];
  tipo_servicio: TipoServicio;
  lista_pagos: ListaPago[];
  mercancias: Mercancias;
  tipo_transporte_despacho?: string;
  list_transporte_despacho?: TransporteDespacho[];
  tipo_transporte_arribo?: string;
  list_unidad_arribo?: TransporteDespacho[];
  persona_responsable?: PersonaResponsableDespacho[];
  list_fechas_sevex?: FechasSevexItem[];
  list_persona_noti?: ListPersonaNoti[];
}

/**
 * Representa la información de un importador o exportador.
 *
 * @property rfc - RFC del importador/exportador.
 * @property nombre - Nombre del importador/exportador.
 * @property industria_automotriz - Indica si pertenece a la industria automotriz.
 * @property desc_industrial_automotriz - Descripción de la industria automotriz, si aplica.
 * @property programa_fomento - Indica si cuenta con un programa de fomento.
 * @property desc_programa_fomento - Descripción del programa de fomento, si aplica.
 * @property immex - Indica si cuenta con programa IMMEX.
 * @property desc_inmex - Descripción del programa IMMEX, si aplica.
 * @property numero_registro - Indica si tiene número de registro.
 * @property desc_numero_registro - Descripción del número de registro, si aplica.
 * @property certificacion_a - Indica si cuenta con certificación tipo A.
 * @property certificacion_aa - Indica si cuenta con certificación tipo AA.
 * @property certificacion_aaa - Indica si cuenta con certificación tipo AAA.
 * @property socio_comercial - Indica si es socio comercial.
 * @property id_socio_comercial - Identificador del socio comercial, si aplica.
 * @property oea - Indica si cuenta con certificación OEA.
 * @property revision_origen - Indica si está sujeto a revisión de origen.
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
 * Representa la información relacionada con el despacho aduanero.
 *
 * @property aduana_despacho - Nombre o código de la aduana donde se realiza el despacho.
 * @property id_seccion_despacho - Identificador numérico de la sección de despacho.
 * @property bln_lda - Indica si aplica la figura de LDA (true/false).
 * @property rfc_despacho_lda - RFC del despacho bajo la figura de LDA.
 * @property bln_dd - Indica si aplica la figura de DD (true/false).
 * @property folio_ddex - Folio del documento DDEx.
 * @property tipo_despacho - Tipo de despacho realizado.
 * @property nombre_recinto - Nombre del recinto donde se realiza el despacho.
 * @property domicilio - Domicilio del recinto o lugar de despacho.
 * @property especifique - Campo para especificar información adicional relevante.
 * @property fecha_inicio - Fecha de inicio del despacho (formato ISO string).
 * @property hora_inicio - Hora de inicio del despacho (formato HH:mm).
 * @property fecha_final - Fecha de finalización del despacho (formato ISO string).
 * @property hora_fin - Hora de finalización del despacho (formato HH:mm).
 * @property tipo_operacion - Tipo de operación aduanera.
 * @property encargo_conferido - Indica si existe encargo conferido (true/false).
 * @property relacion - Indica si existe relación entre las partes (true/false).
 * @property bln_despacho - Indica si se realiza el despacho (true/false).
 */
export interface Despacho {
  aduana_despacho: string;
  id_seccion_despacho: number;
  bln_lda: boolean;
  rfc_despacho_lda: string;
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
 * Representa la información de un pedimento aduanal.
 *
 * @property id_pedimento Identificador único del pedimento.
 * @property patente Número de patente asociada al pedimento.
 * @property pedimento Número de pedimento en formato string.
 * @property aduana Nombre o código de la aduana correspondiente.
 * @property tipo_pedimento Tipo de pedimento (por ejemplo, importación, exportación).
 * @property numeros Números relacionados al pedimento (puede incluir referencias adicionales).
 * @property cove Clave o referencia COVE asociada al pedimento.
 * @property estado_pedimento Estado actual del pedimento (valor numérico).
 * @property sub_estado_pedimento Subestado específico del pedimento (valor numérico).
 * @property numero_pedimento Número secuencial del pedimento.
 * @property tipo_pedimento_por_evaluacion Tipo de pedimento determinado por evaluación.
 * @property bln_valido_pedimento Indica si el pedimento es válido.
 * @property fecha_edo_ws_pedimento Fecha del último estado del pedimento en el sistema (opcional).
 * @property bln_activo Indica si el pedimento está activo (opcional).
 */
export interface Pedimento {
  id_pedimento: number;
  patente: string;
  pedimento: string;
  aduana: string;
  tipo_pedimento: string;
  numeros: string;
  cove: string;
  estado_pedimento: number;
  sub_estado_pedimento: number;
  numero_pedimento: number;
  tipo_pedimento_por_evaluacion: string;
  bln_valido_pedimento: boolean;
  fecha_edo_ws_pedimento?: string;
  bln_activo?: boolean;
}
/**
 * Representa un tipo de servicio dentro del sistema.
 *
 * @property bln_activo Indica si el tipo de servicio está activo.
 * @property cve_tipo_servicio Clave única que identifica el tipo de servicio.
 * @property desc_tipo_servicio Descripción del tipo de servicio.
 * @property numero_svex Número SVEX asociado al servicio.
 * @property rni Número de Registro Nacional de Importadores.
 * @property fecha_inicio_servicio Fecha de inicio del servicio (formato string).
 * @property fecha_fin_servicio Fecha de fin del servicio (formato string).
 * @property hora_inicio_servicio Hora de inicio del servicio (formato string).
 * @property hora_fin_servicio Hora de fin del servicio (formato string).
 * @property patente Número de patente asociado al servicio.
 * @property id_patentes_aduanales Identificador de la patente aduanal relacionada.
 */
export interface TipoServicio {
  bln_activo: boolean;
  cve_tipo_servicio: number;
  desc_tipo_servicio: string;
  numero_svex: string;
  rni: boolean;
  fecha_inicio_servicio: string;
  fecha_fin_servicio: string;
  hora_inicio_servicio: string;
  hora_fin_servicio: string;
  patente: string;
  id_patentes_aduanales: number;
}
/**
 * Representa una lista de pagos asociados a una solicitud.
 *
 * @property linea_captura - Línea de captura para el pago.
 * @property monto - Monto del pago.
 * @property bln_activo - Indica si el pago está activo.
 * @property id_modulo - Identificador del módulo relacionado con el pago.
 * @property cve_modulo - Clave del módulo relacionado con el pago.
 */
export interface ListaPago {
  linea_captura: string;
  monto: number;
  bln_activo: boolean;
  id_modulo: number;
  cve_modulo: string;
}
/**
 * Representa la información de las mercancías involucradas en la solicitud.
 *
 * @property pais_origen - País donde se originó la mercancía.
 * @property descripcion_generica - Descripción general de la mercancía.
 * @property justificacion - Justificación para la inclusión de la mercancía en la solicitud.
 * @property pais_procedencia - País desde el cual procede la mercancía.
 */
export interface Mercancias {
  pais_origen: string;
  descripcion_generica: string;
  justificacion: string;
  pais_procedencia: string;
}
/**
 * Representa la información de una persona responsable de despacho.
 *
 * @property {string} gafete - Identificador o número de gafete de la persona.
 * @property {string} nombre - Nombre de la persona responsable.
 * @property {string} apellido_paterno - Apellido paterno de la persona responsable.
 * @property {string} apellido_materno - Apellido materno de la persona responsable.
 */
export interface PersonaResponsableDespacho {
  gafete: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}
/**
 * Representa una persona para notificación.
 *
 * @property correo_electronico - Correo electrónico de la persona a notificar.
 * @property nombreTercero - Nombre del tercero que recibirá la notificación.
 */
export interface ListPersonaNoti {
  correo_electronico: string;
  nombreTercero: string;
}

/**
 * Representa una lista de fechas y horarios relacionados con SEVEX y RNI.
 *
 * @property {Date} fecha - Fecha principal del evento.
 * @property {Date} fecha_desc - Fecha de descripción o detalle del evento.
 * @property {string} hora_inicio_svex - Hora de inicio para SEVEX (formato HH:mm).
 * @property {string} hora_final_svex - Hora de finalización para SEVEX (formato HH:mm).
 * @property {string} hora_inicio_rni - Hora de inicio para RNI (formato HH:mm).
 * @property {string} hora_fin_rni - Hora de finalización para RNI (formato HH:mm).
 * @property {number} fuera_horario - Indicador si está fuera del horario permitido (1 = sí, 0 = no).
 * @property {number} mismo_horario - Indicador si coincide el mismo horario (1 = sí, 0 = no).
 */
export interface ListFechasSevex {
  fecha: string;
  fecha_desc: string;
  hora_inicio_svex: string;
  hora_final_svex: string;
  hora_inicio_rni?: string;
  hora_fin_rni?: string;
  fuera_horario?: number;
  mismo_horario?: number;
}
 
/**
 * Representa un ítem de fechas SEVEX asociado a una solicitud.
 *
 * @property id_solicitud - Identificador de la solicitud.
 * @property fecha - Fecha asociada al ítem SEVEX.
 */
export interface FechasSevexItem {
    id_solicitud: string | null;
    fecha: string;
}