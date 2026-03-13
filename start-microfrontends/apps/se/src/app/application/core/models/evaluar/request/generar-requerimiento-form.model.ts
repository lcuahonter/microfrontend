
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

export interface GenerarRequerimientoForm {
  justificacion: string;
  motivo: string;
  fundamento: string;
  siglas_participante_externo: string;
  id_motivo_tipo_tramite: number;
  alcance_requerimiento: string;
}
