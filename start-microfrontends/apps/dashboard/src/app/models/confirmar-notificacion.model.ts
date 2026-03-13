/**
 * @interface AcuseResolucion
 * @description
 * Representa la estructura de datos del Acuse de Resolución.
 * Incluye información del contribuyente, tipo de solicitud, folio del trámite y fecha/hora de notificación.
 */
export interface AcuseResolucion {
  /** RFC del contribuyente. */
  rfc: string;

  /** Nombre, denominación o razón social del contribuyente. */
  nombreDenominacionORazonSocial: string;

  /** Tipo de solicitud realizada. */
  tipoDeSolicitud: string;

  /** Folio del trámite asociado. */
  folioDelTramite: string;

  /** Fecha y hora de la notificación. */
  fechaYHoraDeLaNotificacion: string;
}

/**
 * @interface Documento
 * @description
 * Representa un documento con su número de identificación y descripción.
 */
export interface Documento {
  /** Número de identificación del documento. */
  numero: string;

  /** Descripción o nombre del documento. */
  documento: string;
}
/**
 * @interface DocumentoResponse
 * @description
 * Representa la respuesta de una solicitud de documentos, conteniendo un arreglo de documentos.
 */
export interface Departamento {
  ID_DEPENDENCIA: number;
  NOMBRE: string;
  ACRONIMO: string;
}
/**
 *  @interface DocumentoResponse
 *  @description
 * Representa la respuesta de una solicitud de documentos, conteniendo un arreglo de documentos.
 */
export interface DepartamentoResponse {
  data: Departamento[];
}
/**
 * @interface TramiteItem
 * @description
 * Representa un elemento de trámite con su ID, número de trámite, enlaces a dashboard y departamento, y el nombre del departamento.
 */
export interface TramiteItem {
  id: number;
  tramite: number;
  linkDashboard: string;
  linkDepartment: string;
  department: string;
}