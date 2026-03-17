/**
 * Representa un tipo de persona propietario.
 */
export interface PropietarioTipoPersona {
  /**
   * Etiqueta que describe el tipo de persona propietario.
   */
  label: string;

  /**
   * Valor asociado al tipo de persona propietario.
   */
  value: string;
}

/**
 * Representa las opciones de acuerdo para publicar información confidencial.
 */
export interface PcuerdoPublicar {
  /**
   * Etiqueta que describe el acuerdo de publicación.
   */
  label: string;

  /**
   * Valor asociado al acuerdo de publicación.
   */
  value: string;
}
