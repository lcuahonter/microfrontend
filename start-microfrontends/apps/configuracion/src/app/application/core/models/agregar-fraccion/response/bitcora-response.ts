/**
 * Representa la información de un registro dentro de la bitácora del sistema.
 *
 * @interface Bitacora
 * 
 * @property {string | number} id - Identificador único del registro en la bitácora, puede ser numérico o alfanumérico.
 * @property {string} fraccion - Fracción asociada al registro de la bitácora.
 * @property {string} fecha_modificacion - Fecha en la que se realizó la modificación del registro.
 * @property {boolean} activo - Indica si el registro se encuentra activo.
 */

export interface Bitacora {
    id: string | number
    fraccion: string
    fecha_modificacion: string
    activo: boolean
}