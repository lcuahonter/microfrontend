/**
 * @description Interfaz que define la estructura de una acción de botón.
 * Se utiliza para representar y transmitir información sobre las acciones
 * realizadas por botones en la interfaz de usuario, especificando tanto
 * el tipo de acción como el valor asociado a dicha acción.
 *
 * @usageNotes
 * Esta interfaz se utiliza comúnmente para comunicar eventos entre componentes,
 * especialmente en sistemas de navegación como wizards o flujos de múltiples pasos.
 *
 * Ejemplo de uso:
 * ```typescript
 * // Definir una acción de botón para avanzar al paso 2
 * const accionSiguiente: AccionBoton = {
 *   accion: 'cont',
 *   valor: 2
 * };
 *
 * // Emitir evento con la acción del botón
 * this.accionRealizada.emit(accionSiguiente);
 * ```
 */
export interface AccionBoton {
  /**
   * @description Cadena que identifica el tipo de acción que se está realizando.
   * Valores comunes incluyen 'cont' para continuar/siguiente o 'prev' para anterior/atrás.
   */
  accion: string;
 
  /**
   * @description Valor numérico asociado con la acción.
   * Suele representar el índice o número de paso al que se desea navegar.
   */
  valor: number;
}

export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
  /** Clave opcional del catálogo. */
  clave?: string;
  /** Tamaño opcional del catálogo. */
  relacionadaUmtId?: number;
  /** Identificador relacionado con acotación opcional. */
  relacionadaAcotacionId?: number;
  /** Decripcion del titulo del select, cuando se requiera. */
  title?: string;
  /** Decripcion del titulo del bloque, cuando se requiera. */
  bloque?: string;
  /** Acotación adicional, cuando se requiera. */
  acotacion?: string;
}
 