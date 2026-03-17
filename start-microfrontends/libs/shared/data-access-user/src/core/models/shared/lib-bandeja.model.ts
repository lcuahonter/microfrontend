/**
 * Representa una bandeja de solicitudes con información relevante sobre cada solicitud.
 *
 * @property id Identificador único de la bandeja de solicitudes.
 * @property id_solicitud Identificador único de la solicitud.
 * @property tipoDeTramite Tipo de trámite asociado a la solicitud.
 * @property fecha Fecha de creación de la solicitud (formato ISO 8601).
 * @property fechaActualizacion Fecha de la última actualización de la solicitud (formato ISO 8601).
 * @property diasTranscurridos Número de días transcurridos desde la creación de la solicitud.
 * @property departamento Departamento responsable de la solicitud.
 * @property numeroDeProcedimiento Número de procedimiento relacionado con la solicitud.
 */
export interface BandejaDeSolicitudes {
  id: number;
  id_solicitud: string;
  tipoDeTramite: string;
  fecha: string;
  fechaActualizacion: string;
  diasTranscurridos: string;
  departamento: string;
  numeroDeProcedimiento: string;
}

/**
 * Representa la respuesta de la API para la bandeja de solicitudes.
 * @property id_solicitud Identificador único de la solicitud.
 * @property dependencia Nombre del departamento o dependencia responsable de la solicitud.
 * @property dias_transcurridos Número de días transcurridos desde la creación de la solicitud.
 * @property estado_solicitud Estado actual de la solicitud.
 * @property id_tipoTramite Identificador del tipo de trámite asociado a la solicitud.
 * @property fecha_creacion Fecha de creación de la solicitud (formato ISO 8601).
 * @property fecha_actualizacion Fecha de la última actualización de la solicitud (formato ISO 8601).
 * @property nombre_tramite Nombre del trámite asociado a la solicitud.  
*/
export interface BandejaDeSolicitudesResponse {
  id_solicitud: string;
  dependencia: string;
  dias_transcurridos: string;
  estado_solicitud: string;
  id_tipoTramite: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre_tramite: string;
}

/**
* Modelo de datos para la solicitud de solicitudes pendientes.
* Representa la estructura de los datos necesarios para realizar una solicitud de solicitudes pendientes.
*/
export interface SolicitudesPendientesRequest {
  rfc: string,
  rol_actual: string,
  rfc_Solicitante: string,
  id_solicitud: string,
  fecha_inicio: string,
  fecha_fin: string,
  certificado: {
    cert_serial_number: string,
    tipo_certificado: string
  }
}