/**
 * Interfaz que representa los trámites asociados.
 */
export interface TramitesAsociados {
  /**
   * Razón social legal del destinatario.
   */
  legalRazonSocial: string;

  /**
   * Apellido paterno del destinatario.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del destinatario.
   */
  apellidoMaterno: string;
  /**
   * Folio del trámite asociado.
   */
  foliodletramite: number;
  /** Número del trámite asociado. */
  No: number;

  /** Folio del trámite asociado. */
  folioTramite: number;

  /** Tipo de trámite asociado. */
  tipoTramite: string;

  /** Estatus del trámite asociado. */
  estatus: string;

  /** Fecha de alta del registro del trámite asociado. */
  fechaaltaderegistro: number;
}
