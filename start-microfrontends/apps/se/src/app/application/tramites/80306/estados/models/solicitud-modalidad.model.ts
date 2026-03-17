
/**
 * @module SharedModule
 */

/**
 * Interfaz para representar un paso en un asistente (wizard).
 * @interface ListaPasosWizard
 */
export interface ListaPasosWizard {
    /**
     * El índice del paso dentro del asistente.
     * @type {number}
     */
    indice: number;
    /**
     * El título descriptivo del paso.
     * @type {string}
     */
    titulo: string;
    /**
     * Indica si el paso está activo actualmente.
     * @type {boolean}
     */
    activo: boolean;
    /**
     * Indica si el paso ha sido completado.
     * @type {boolean}
     */
    completado: boolean;
}

/**
 * Interfaz genérica para representar la respuesta de una API.
 * @interface RespuestaAPI
 * @template T - El tipo de datos que se esperan en la respuesta.
 */
export interface RespuestaAPI<T> {
    /**
     * El código de respuesta de la API.
     * @type {number}
     */
    code: number;
    /**
     * Los datos devueltos por la API.
     * @type {T}
     */
    data: T;
    /**
     * Mensaje descriptivo de la respuesta.
     * @type {string}
     */
    message: string;
}

/**
 * Interfaz para representar un banco.
 * @interface Banco
 */
export interface Banco {
    /**
     * El identificador único del banco.
     * @type {number}
     */
    id: number;
    /**
     * El nombre o valor del banco.
     * @type {string}
     */
    value: string;
}

/**
 * Interfaz para definir la acción y el valor del botón.
 * @interface AccionBoton
 */
export interface AccionBoton {
    /**
     * La acción que realiza el botón ('cont' para continuar, 'atras' para retroceder).
     * @type {string}
     */
    accion: string;
    /**
     * El índice del paso al que se navega al presionar el botón.
     * @type {number}
     */
    valor: number;
}