/**
 * Interfaz para el modelo de solicitud de guardar dictamen.
 * Contiene los campos necesarios para enviar la solicitud de dictamen.
 */
export interface GuardarDictamenRequest {
     /** ID de la acción a realizar */
    id_accion: string;
    /** Clave del usuario */
    cve_usuario: string;
    /** ID del sentido del dictamen */
    ide_sentido_dictamen: string;
    /** Justificación del dictamen */
    justificacion_dictamen: string;
    /** Fecha de inicio de vigencia autorizada */
    fecha_inicio_vigencia: string;
    /** Fecha de fin de vigencia autorizada */
    fecha_fin_vigencia: string;
    /** Texto del dictamen */
    texto_dictamen: string;
    /** Criterios de dictaminación */
    criterios_dictaminacion?: string;
    /** Id solicitud en algunos tramites */
    id_solicitud?: number;
    /** Lista de criterios asociados a tratados */
    criterios_tratados?: CriterioTratado[];
    /** Indica si el dictaminador califica como exportador */
    calificacion_dictaminador_exportador?: boolean | null;
    /** Indica si el dictaminador califica como exportador JPN */
    calificacion_dictaminador_exportador_jpn?: boolean | null;
    /** Indica si la descripción ALADI es correcta */
    calificacion_descripcion_aladi?: boolean | null;
}

export interface CriterioTratado {
  /** ID del criterio del tratado */
  id_criterio_tratado?: number;
  /** Indica si la calificación fue aprobada por el dictaminador */
  calificacion_aprobada_dictaminador?: boolean;
  /** ID del tratado o acuerdo relacionado */
  id_tratado_acuerdo?: number;
  /** Clave del tratado o acuerdo */
  cve_tratado_acuerdo?: string;
}
