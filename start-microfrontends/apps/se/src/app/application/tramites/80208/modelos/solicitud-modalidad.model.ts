/**
 * @module SharedModule
 * @description
 * Módulo compartido que contiene interfaces y modelos utilizados en el trámite.
 */

/**
 * @interface ListaPasosWizard
 * @description
 * Interfaz para representar un paso en un asistente (wizard).
 *
 */
export interface ListaPasosWizard {
    /**
     * El índice del paso.
     * @property {number} indice - El índice del paso.
     */
    indice: number;
    /**
     * El título del paso.
     * @property {string} titulo - El título del paso.
     */
    titulo: string;
    /**
     * Indica si el paso está activo.
     * @property {boolean} activo - Indica si el paso está activo.
     */
    activo: boolean;
    /**
     * Indica si el paso se ha completado.
     * @property {boolean} completado - Indica si el paso se ha completado.
     */
    completado: boolean;
}

/**
 * @interface RespuestaAPI
 * @description
 * Interfaz genérica para representar la respuesta de una API.
 *
 * @template T - El tipo de datos que se esperan en la respuesta.
 */
export interface RespuestaAPI<T> {
    /** El código de respuesta de la API
     * @property {number} code - El código de respuesta de la API.
     */
    code: number;
    /** Los datos de la respuesta
     * @property {T} data - Los datos de la respuesta.
     */
    data: T;
    /** Un mensaje descriptivo de la respuesta
     * @property {string} message - Un mensaje descriptivo de la respuesta.
     */
    message: string;
}

/**
 * @interface Banco
 * @description
 * Interfaz para representar un banco.
 *
 */
export interface Banco {
    /** El identificador único del banco.
     * @property {number} id - El identificador único del banco.
     */
    id: number;
    /** El nombre o valor del banco.
     * @property {string} value - El nombre o valor del banco.
     */
    value: string;
}

/**
 * @interface AccionBoton
 * @description
 * Interfaz para definir la acción y el valor del botón.
 *
 */
export interface AccionBoton {
    /** La acción del botón ('cont' o 'atras').
     * @property {string} accion - La acción del botón ('cont' o 'atras').
     */
    accion: string;
    /** El índice del paso al que se navega.
     * @property {number} valor - El índice del paso al que se navega.
     */
    valor: number;
}

/**
 * Interfaz que define la estructura del resultado de una solicitud.
 */
export interface ResultadoSolicitud {
  /**
   * Indica si la solicitud fue exitosa.
   */
  exito: boolean;

  /**
   * Mensaje de error o éxito de la solicitud.
   */
  mensaje?: string;

  /**
   * Errores del modelo, si los hay.
   */
  erroresModelo?: { campo: string; errores: string[] }[];
}