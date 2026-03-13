/**
 * Representa un elemento de la tabla de observaciones en un dictamen.
 */
export interface ConsultaObservacionesTabla {
  /** Identificador único de la observación. */
  id: number;
  /** Detalle o descripción de la observación. */
  detalle: string;
  /** Fecha en la que se generó la observación. */
  fechaGeneracion: string;
  /** Fecha en la que se atendió la observación. */
  fechaAtencion: string;
  /** Nombre de la persona o sistema que generó la observación. */
  generadaPor: string;
  /** Estatus actual de la observación (e.g., pendiente, atendida). */
  estatus: string;
}