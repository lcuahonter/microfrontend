/**
 * Modelo para almacenar la respuesta del api `pantente/busca?rfc`
 * 
 * @see API_GET_PATENTE
 */
export interface PatenteResponse {
    codigo: string;
    mensaje: string;
    datos: Patente;
}

/**
 * Modelo para almacenar la respuesta del api `pantente/{RFC_QUERY}/apoderado`
 * 
 * @see API_GET_PATENTE_APODERADO
 */
export interface PatenteApoderadoResponse {
    codigo: string;
    mensaje: string;
    datos: Patente[];
}

/**
 * Modelo para cada una de las patentes regresadas por el API `pantente/busca?rfc`
 *
 * @see API_GET_PATENTE
 */
export interface Patente {
    patente: string;
    tipo_patente: string;
    rfc_solicitante: string;
    id_patentes_aduanales: number;
}