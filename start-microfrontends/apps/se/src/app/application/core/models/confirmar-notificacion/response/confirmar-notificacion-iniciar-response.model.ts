/**
 * Modelo de respuesta para iniciar la confirmación de notificación.
 * Este modelo define la estructura de la respuesta que se espera al iniciar el proceso de confirmación
 */
export interface ConfirmarNotificacionIniciarResponse {
  /** Identificador único de la notificación */
  id_notificacion: number;

  /** Fecha en que se envió la notificación */
  fecha_envio_notificacion: string;

  /** Número de folio del trámite asociado */
  num_folio_tramite: string;

  /** Descripción de la modalidad del trámite */
  desc_modalidad: string;

  /** Nombre del destinatario */
  nombre: string;

  /** Apellido paterno del destinatario */
  apellido_paterno: string;

  /** Apellido materno del destinatario */
  apellido_materno: string;

  /** Razón social (en caso de persona moral) */
  razon_social: string;

  /** RFC del destinatario o empresa */
  rfc: string;

  /** Nombre completo del destinatario (nombre + apellidos) */
  nombre_completo: string;

  /** Tipo de notificación (ej. electrónica, física, etc.) */
  tipo_notificacion: string;
}
