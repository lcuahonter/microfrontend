/**
 * Arreglo constante que define los pasos del proceso para la gestión de permisos.
 * Cada objeto representa un paso específico con su índice, título, y los estados de activo y completado.
 *
 * @property {number} indice - El número de orden del paso dentro del proceso.
 * @property {string} titulo - El nombre descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está actualmente activo para el usuario.
 * @property {boolean} completado - Indica si el paso ya ha sido completado.
 *
 * Ejemplo de uso:
 * - Para mostrar el flujo de pasos en un formulario de solicitud.
 * - Para controlar la navegación entre pasos según el estado de cada uno.
 */
export const PASOS = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Anexar requisitos',
        activo: false,
        completado: false,
    },
    {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    }
];

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
export const SECCIONES_TRAMITE_260102 = {
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
/**
 * Lista de elementos requeridos para el trámite de importación o retorno sanitario.
 * 
 * Contiene los nombres de los campos obligatorios que deben ser proporcionados:
 * - 'denominacionRazon': Denominación o razón social de la empresa.
 * - 'scian': Código SCIAN correspondiente a la actividad económica.
 * - 'correoElectronico': Correo electrónico de contacto.
 */
export const ELEMENTOS_REQUERIDOS = [
  'denominacionRazon',
  'scian',
  'correoElectronico',
];

export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * @constant ERROR_FORMA_ALERT
 * @type {string}
 * @description
 * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede,
 * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro!</strong> Faltan campos por capturar.
    </div>
  </div>
</div>
`;