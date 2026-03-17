/**
 * Modelo para almacenar la respuesta del api `pantente/busca?rfc`
 *
 * @see API_GET_EMPRESA
 */
export interface EmpresaResponse {
    codigo: string;
    mensaje: string;
    datos: string[];
}