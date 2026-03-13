/**
 * @interface AcusesYResoluciones
 * @description
 * Representa la estructura de datos para acuses y resoluciones.
 */
export interface AcusesYResoluciones {
  /** Folio del trámite. */
  folio: string;

  /** Fecha inicial asociada al trámite. */
  fechaInicial: string;

  /** Fecha final asociada al trámite. */
  fechaFinal: string;

  /** Dependencia responsable del trámite. */
  dependencia: string;

  /** Unidad administrativa o representación federal. */
  unidadAdministrativaORepresentacionFederal: string;

  /** Tipo de solicitud realizada. */
  tipoDeSolicitud: string;

  /** Estatus actual de la solicitud. */
  estatusDeLaSolicitud: string;

  /** Días hábiles transcurridos desde la solicitud. */
  diasHabilesTranscurridos: string;
}

/**
 * @interface BotonDeAccion
 * @description
 * Representa un botón de acción con etiqueta, clase, método y URL de acción.
 */
export interface BotonDeAccion {
  /** Etiqueta visible del botón. */
  etiqueta: string;

  /** Clases CSS aplicadas al botón. */
  clase: string;

  /** Método que se invocará al presionar el botón. */
  metodo: string;

  /** URL de acción asociada al botón. */
  urlAccion: string;
}
