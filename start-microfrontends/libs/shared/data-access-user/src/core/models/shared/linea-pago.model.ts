/**
 * Modelo para almacenar la respuesta de la API de validación de línea de pago
 * @see API_GET_LINEA_PAGO
 */
export interface LineaPagoResponse {
    codigo: string;
    mensaje: string;
    datos: LineaPago;
}

/**
 * Modelo para almacenar la información específica de la línea de pago
 */
export interface LineaPago {
    id_Solicitud: number;
    id_Pago: number;
    linea_Captura: string;
    monto: number;
    bln_Activo: boolean;
    id_Modulo: number;
    cve_Modulo: string;
}
