/**
 * Representa un elemento de la lista de pendientes.
 */
export interface ListaPendientes {
  /** Folio único del trámite pendiente. */
  folio: string;
  /** Tipo de trámite asociado al pendiente. */
  tipoTramite: string;
  /** Nombre de la tarea asociada al pendiente. */
  nombreTarea: string;
  /** Fecha en la que se asignó el pendiente. */
  fechaAsignacion: string;
  /** Estado actual del trámite pendiente. */
  estatusTramite: string;
}