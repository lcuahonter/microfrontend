/**
 * Objeto que agrupa los estados de validación de las secciones correspondientes a los pasos de un trámite de permiso de importación.
 *
 * @property {object} PASO_1 - Contiene los estados de validación de las secciones del primer paso del trámite.
 * @property {boolean} PASO_1.VALIDACION_SECCION_1 - Indica si la Sección 1 del Paso 1 ha sido validada correctamente.
 * @property {boolean} PASO_1.VALIDACION_SECCION_2 - Indica si la Sección 2 del Paso 1 ha sido validada correctamente.
 * @property {boolean} PASO_1.VALIDACION_SECCION_3 - Indica si la Sección 3 del Paso 1 ha sido validada correctamente.
 * @property {object} PASO_2 - Contiene el estado de validación de la sección del segundo paso del trámite.
 * @property {boolean} PASO_2.VALIDACION_SECCION - Indica si la única sección del Paso 2 ha sido validada correctamente.
 */
export const SECCIONES_TRAMITE = {
  /**
   * Agrupa los estados de validación de las secciones del primer paso del trámite.
   */
  PASO_1: {
    /**
     * Indica si la Sección 1 del Paso 1 ha sido validada correctamente.
     */
    VALIDACION_SECCION_1: false,

    /**
     * Indica si la Sección 2 del Paso 1 ha sido validada correctamente.
     */
    VALIDACION_SECCION_2: true,

    /**
     * Indica si la Sección 3 del Paso 1 ha sido validada correctamente.
     */
    VALIDACION_SECCION_3: true,
  },

  /**
   * Agrupa el estado de validación del segundo paso del trámite.
   */
  PASO_2: {
    /**
     * Indica si la única sección del Paso 2 ha sido validada correctamente.
     */
    VALIDACION_SECCION: false,
  }
};
