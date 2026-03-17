export interface IniciarAutorizarRequerimientoResponse {
  id_requerimiento: number;
  estado_requerimiento: string;
  id_est_requerimiento: string;
  id_tipo_requerimiento: string;
  cve_area: string;
  justificacion: string;
  descripcion: string;
  fecha_autorizacion: string;
  fecha_verificacion: string;
  fecha_creacion: string;
  fecha_emision: string;
  fecha_atencion: string;
  desc_atencion_requerimiento: string;
  num_folio_tramite: string;
  id_motivo_rechd_ttra: number;
  fundamento: string;
  motivo: string;
  siglas_participante_externo: string;
  motivo_requerimiento: string;
  alcance_requerimiento: string;
  numero_oficio_requerimiento: string;
  dias_subsanar: number;
  documentos: Documento[];
  observaciones: Observacion[];
}

export interface Persona {
  id_persona: number;
  nombre: string;
  apellido_materno: string;
  apellido_paterno: string;
  rfc: string;
  correo_electronico: string;
  curp: string;
  razon_social: string;
  cve_usuario: string;
  descripcion_giro: string;
  organismo_publico: boolean;
  estatus_registro: string;
  registro_con_fiel: boolean;
  fecha_registro: string;
  fecha_fin_vigencia: string;
  nombre_puesto: string;
  informacion_confidencial: boolean;
  numero_seguridad_social: string;
  numero_identificacion_fiscal: string;
  cve_pais_origen: string;
  desc_carga_inicial: string;
  ide_tipo_rfc: string;
  ide_tipo_persona: string;
}

export interface Observacion {
  id_observacion: number;
  ide_estado_observacion: string;
  estado_observacion: string;
  observacion: string;
  cve_usuario: string;
  fecha_observacion: string;
  fecha_atencion: string;
  id_dictamen: number;
  id_requerimiento: number;
  id_opinion: number;
  persona: Persona;
}

export interface Documento {
  id_documento_solicitud: number;
  id_documento: number;
  nombre: string;
  id_tipo_documento: number;
  tipo_documento: string;
  estado_documento_solicitud: string;
  requerido: boolean;
  id_documento_requerimiento: number;
  id_e_document: string;
}

