/**
 * Modelos para la bitácora de modificaciones en el sistema PROSEC.
 * @interface Bitacora
 */
export interface Bitacora {
    /**
     * Tipo de modificación realizada.
     * @type {string}
     */
    tipoModificacion: string;

    /**
     * Fecha de modificación.
     * @type {string}
     */
    fechaModificacion: string;

    /**
     * Valores anteriores antes de la modificación.
     * @type {string}
     */
    valoresAnteriores: string;

    /**
     * Valores nuevos después de la modificación.
     * @type {string}
     */
    valoresNuevos: string;
}

/**
 * Respuesta de la API para la bitácora.
 * @interface BitacoraResquesta
 */
export interface BitacoraResquesta {
    /**
     * Código de respuesta de la API.
     * @type {number}
     */
    code: number;

    /**
     * Datos de la bitácora.
     * @type {Bitacora[]}
     */
    data: Bitacora[];

    /**
     * Mensaje de respuesta de la API.
     * @type {string}
     */
    message: string;
}