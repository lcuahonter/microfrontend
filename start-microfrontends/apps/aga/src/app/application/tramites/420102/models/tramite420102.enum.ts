/**
 * @interface DatosDelContenedorTabla
 * @description Interfaz que define la estructura de los datos de un contenedor en la tabla.
 *
 * @property {string} rfc - Registro Federal de Contribuyentes del contenedor.
 * @property {string} denominacionORazonSocial - Denominación o razón social del contenedor.
 * @property {string} norma - Norma asociada al contenedor.
 * @property {string} fechainciorelacion - Fecha de inicio de la relación del contenedor.
 */
export interface DatosDelContenedorTabla {
  rfc: string;
  denominacionORazonSocial: string;
  norma: string;
  fechainciorelacion: string;
}

/**
 * @const SECCIONES_TRAMITE_420102
 * @description Constante que define las secciones y pasos del trámite 420102.
 * Contiene las validaciones necesarias para cada sección de los pasos del trámite.
 *
 * @property {Object} PASO_1 - Configuración de las validaciones para el paso 1.
 * @property {boolean} PASO_1.VALIDACION_SECCION_1 - Indica si la primera sección del paso 1 ha sido validada.
 * @property {boolean} PASO_1.VALIDACION_SECCION_2 - Indica si la segunda sección del paso 1 ha sido validada.
 * @property {Object} PASO_2 - Configuración de las validaciones para el paso 2.
 * @property {boolean} PASO_2.VALIDACION_SECCION - Indica si la sección del paso 2 ha sido validada.
 */
export const SECCIONES_TRAMITE_420102 = {
  PASO_1: {
    /**
     * @description Validación de la primera sección del paso 1.
     * @type {boolean}
     */
    VALIDACION_SECCION_1: false,

    /**
     * @description Validación de la segunda sección del paso 1.
     * @type {boolean}
     */
    VALIDACION_SECCION_2: false,
  },
  PASO_2: {
    /**
     * @description Validación de la sección del paso 2.
     * @type {boolean}
     */
    VALIDACION_SECCION: false,
  },
};