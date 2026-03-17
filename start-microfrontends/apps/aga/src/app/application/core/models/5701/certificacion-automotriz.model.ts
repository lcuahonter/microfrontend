/**
 * Modelo para almacenar la respuesta del API `programa-se/cert-automotriz/`
 *
 * @see API_GET_INDUSTRIA_AUTOMOTRIZ
 */
export interface IndustriaAutomotrizResponse {
    codigo: string;
    mensaje: string;
    datos: IndustriaAutomotriz;
}

/**
 * Modelo para cada una de los atributos regresadas por el API `programa-se/cert-automotriz/`
 *
 * @see API_GET_INDUSTRIA_AUTOMOTRIZ
 */
export interface IndustriaAutomotriz {
    industrial_automotriz: boolean;
    des_industrial_automotriz: string;
}