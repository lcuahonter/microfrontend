/**
 * Representa un programa PROSEC en una lista o tabla.
 * Contiene información básica del programa.
 * @interface ProgramaLista
 */
export interface ProgramaLista {
  /**
   * Identificador único del programa autorizado.
   */
  idProgramaAutorizado?: string;

  /**
   * Folio único del programa PROSEC.
   */
  folioPrograma?: string;

  /**
   * Tipo de programa PROSEC.
   */
  tipoPrograma: string;

  /**
   * RFC asociado al programa PROSEC.
   */
  rfc?: string;

  /**
   * Identificador compuesto del programa PROSEC.
   */
  idProgramaCompuesto: string;
}