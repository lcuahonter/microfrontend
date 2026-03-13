/**
 * Modelo para los datos de pago de derechos
 */
export interface PagoDerechos {
    // Clave de referencia del pago
    claveReferencia: string;
    // Cadena de dependencia del pago
    cadenaDependencia: string;
    // Banco donde se realiza el pago
    banco: string;
    // Llave del pago
    llavePago: string;
    // Importe del pago
    importePago: string;
}
