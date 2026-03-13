/**
 * Constante que representa los pasos del proceso de registro de cuentas bancarias.
 * 
 * @export
 * @const {Array<Object>}
 */
export const PANTA_PASOS = [
  {
    /**
     * Índice del paso.
     * 
     * @type {number}
     * @memberof Paso
     */
    indice: 1,

    /**
     * Título del paso.
     * 
     * @type {string}
     * @memberof Paso
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el paso está activo.
     * 
     * @type {boolean}
     * @memberof Paso
     */
    activo: true,

    /**
     * Indica si el paso está completado.
     * 
     * @type {boolean}
     * @memberof Paso
     */
    completado: false,
  },
  {
    /**
     * Índice del paso.
     * 
     * @type {number}
     * @memberof Paso
     */
    indice: 2,

    /**
     * Título del paso.
     * 
     * @type {string}
     * @memberof Paso
     */
    titulo: 'Firmar solicitud',

    /**
     * Indica si el paso está activo.
     * 
     * @type {boolean}
     * @memberof Paso
     */
    activo: false,

    /**
     * Indica si el paso está completado.
     * 
     * @type {boolean}
     * @memberof Paso
     */
    completado: false,
  }
];