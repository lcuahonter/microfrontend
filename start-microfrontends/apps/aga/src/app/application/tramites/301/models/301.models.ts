/**
 * @interface PagoDeDerechosTabla
 * @description
 * Define la estructura de los datos para cada registro de la tabla de pago de derechos.
 * Incluye la línea de captura y el monto correspondiente al pago.
 *
 * @property {string} lineaDeCaptura - Identificador único de la línea de captura para el pago.
 * @property {number} monto - Monto asociado al pago de derechos.
 */
export interface PagoDeDerechosTabla {
    lineaDeCaptura: string;
    monto: number;
}