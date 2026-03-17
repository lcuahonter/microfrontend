/**
 * Representa un elemento de la lista de dictaminaciones.
 */
export interface ListaDictaminacion {
  /** Folio único de la dictaminación. */
  folio: string;
  /** Folio del trámite asociado a la dictaminación. */
  folioTramite: string;
  /** Fecha en la que se creó la dictaminación. */
  fechaCreación: string;
  /** Nombre del capturista que registró la dictaminación. */
  capturista: string;
  /** Número de días transcurridos desde la creación de la dictaminación. */
  diasTrascurridos: string;
}