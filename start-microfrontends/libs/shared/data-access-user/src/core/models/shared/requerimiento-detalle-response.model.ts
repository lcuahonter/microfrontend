import { Observacion } from "./Iniciar-requerimiento-response.model";

/**
 * Modelo que representa el estado de un requerimiento
 */
export interface RequerimientoDetalleResponse {
  /** Identificador único del requerimiento */
  id_requerimiento: number;
  
  /** Identificador del estado del requerimiento (código) */
  id_est_requerimiento: string;
  
  /** Descripción del estado del requerimiento */
  estado_requerimiento: string;
  
  /** Fecha de creación del requerimiento */
  fecha_creacion: string;
  
  /** Fecha de emisión del requerimiento */
  fecha_emision: string;
  
  /** Fecha de verificación del requerimiento (puede ser nula) */
  fecha_verificacion: string | null;
  
  /** Fecha de autorización del requerimiento */
  fecha_autorizacion: string;
  
  /** Fecha de atención del requerimiento */
  fecha_atencion: string;
  
  /** Justificación del requerimiento */
  justificacion: string;
  
  /** Fundamento legal o técnico del requerimiento (puede ser nulo) */
  fundamento: string | null;
  
  /** Nombre del dictaminador del requerimiento */
  dictaminador: string;
  
  /** Nombre del verificador del requerimiento (puede ser nulo) */
  verificador: string | null;
  
  /** Nombre del autorizador del requerimiento */
  autorizador: string;

  observaciones?: Observacion[];

  documentos_especificos?: DocumentosEspecificosResponse[];

  motivo?: string;

  siglas_participante_externo?: string;

  alcance_requerimiento?: string;

  desc_atencion_requerimiento?: string;

  documentos: DocumentosEspecificosResponse[]
}

export interface DocumentosEspecificosResponse {
  id_documento_solicitud?: number;
  id_documento?: number;
  nombre?: string;
  id_tipo_documento?: number;
  tipo_documento?: string;
  estado_documento_solicitud?: string | null;
  id_documento_requerimiento?: number;
  id?: string;
  documento_uuid?: string | null;
}

/**
 * Modelo que representa la configuración de detalle de requerimiento
 */
export interface DetalleRequerimiento {
  /**
   * Indica si la atención del requerimiento es requerida.
   */
  atencionRequerimiento?: boolean;
  /**
   * Indica si se debe mostrar la tabla de documentos en el detalle del requerimiento.
   */
  detalleTableRequerimiento?: boolean;
}
