/**
 * Representa el cuerpo de una solicitud para obtener el estado de un pedimento.
 *
 * @property aduana - Número identificador de la aduana.
 * @property patente - Número de la patente aduanal.
 * @property pedimento - Número del pedimento a consultar.
 */
export interface BodyEstadoPedimento {
    aduana: number;
    patente: string;
    pedimento: number;
}

/**
 * Representa la respuesta del estado de un pedimento.
 *
 * @property codigo - Código de respuesta del servicio.
 * @property mensaje - Mensaje descriptivo del resultado.
 * @property datos - Objeto que contiene la información detallada del estado del pedimento.
 */
export interface EstadoPedimentoResponse {
    codigo: string;
    mensaje: string;
    datos: EstadoPedimento;
}

/**
 * Representa el estado de un pedimento aduanal.
 *
 * @property {number} patente - Número de la patente aduanal asociada al pedimento.
 * @property {number} pedimento - Número identificador del pedimento.
 * @property {number} aduana - Código de la aduana correspondiente.
 * @property {string} estado_pedimento - Estado actual del pedimento.
 * @property {string} sub_estado_pedimento - Subestado o detalle adicional del estado del pedimento.
 * @property {string} pedimento_valido - Indica si el pedimento es válido.
 */
export interface EstadoPedimento {
    patente: string;
    pedimento: number;
    aduana: number;
    estado_pedimento: string;
    sub_estado_pedimento: string;
    pedimento_valido: string;
}
