/**
 * Códigos de respuesta para las operaciones de la aplicación.
 */
export enum CodigoRespuesta {
  /** Caso de éxito */
  EXITO = '00',
}

/**
 * Enum que define los diferentes pasos del flujo de notificación.
 */
export enum PasoNotificacion {
  /**
   * Paso 1: Confirmación de la notificación.
   */
  CONFIRMAR_NOTIFICACION = 1,

  /**
   * Paso 2: Firma electrónica del documento/notificación.
   */
  FIRMAR = 2,

  /**
   * Paso 3: Cierre del proceso de notificación.
   */
  ACUSES = 3
}

/**
 * Enum que representa los diferentes procesos de una solicitud.
 * Se usa para generar el parámetro `proceso` en la API de estado de solicitud.
 */
export enum ProcesoSolicitud {

  /** Evaluar solicitud, Generar requerimiento, Generar dictamen */
  EVALUAR_SOLICITUD = 2,

  /** Autorizar requerimiento */
  AUTORIZAR_REQUERIMIENTO = 16,

  /** Atender requerimiento */
  ATENDER_REQUERIMIENTO = 51,

  /** Verificar requerimiento */
  VERIFICAR_REQUERIMIENTO = 14,

  /** Autorizar dictamen */
  AUTORIZAR_DICTAMEN = 12,

  /** Verificar dictamen */
  VERIFICAR_DICTAMEN = 10,

  /** Autorizar opinión */
  AUTORIZAR_OPINION = 28,

  /** Verificar opinión */
  VERIFICAR_OPINION = 26,

  /** Generar opinión */
  GENERAR_OPINION = 24
}


/**
 * Enum que representa los tipos de requerimiento.
 */
export enum TipoRequerimiento {
  /** Requerimiento de datos */
  DATOS = 'INFREQ.D',
  /** Requerimiento tipo documentos y datos */
  DATOS_DOCUMENTOS = 'INFREQ.DR',
  /** Requerimiento tipo documentos */
  DOCUMENTOS = 'INFREQ.R',
}