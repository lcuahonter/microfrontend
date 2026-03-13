/**
 * Modelo de respuesta para los datos de exportador autorizado.
 */
export interface ExportadorAutorizadoResponse {
  /** Indica si se solicita exportador autorizado */
  solicita_exportador_aut: boolean;

  /** Clave de la condición del exportador autorizado */
  clave_condicion_exportador: string;

  /** Descripción de la condición del exportador autorizado */
  condicion_exportador: string;

  /** Calificación automática del exportador autorizado por el sistema */
  calificacion_exp_aut_sistema: boolean;

  /** Indica si se solicita exportador autorizado para Japón */
  solicita_exportador_aut_jpn: boolean;

  /** Clave de la condición del exportador autorizado para Japón */
  clave_condicion_exportador_jpn: string;

  /** Descripción de la condición del exportador autorizado para Japón */
  condicion_exportador_jpn: string;

  /** Calificación automática del exportador autorizado para Japón por el sistema */
  calificacion_exp_aut_sistema_jpn: boolean;

  /** Indica si el dictaminador puede calificar el exportador autorizado */
  dictaminador_puede_calificar: boolean;

  /** Indica si el dictaminador puede calificar el exportador autorizado para Japón */
  dictaminador_puede_calificar_jpn: boolean;
}

export interface DatosExportadorAutorizadoResponse {
  /** Indica si se debe mostrar la sección de exportador UE */
  mostrar_exportador_ue: boolean;

  /** Indica si se debe mostrar la sección de exportador JPN */
  mostrar_exportador_jpn: boolean;

  /** Indica si el solicitante aplica */
  solicitante: boolean;

  /** Indica si la mercancía aplica */
  mercancia: boolean;

  /** Indica si los tratados aplican */
  tratados: boolean;
}
