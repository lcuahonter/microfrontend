/**
 * Modelo para almacenar la respuesta del API `gafete/responsable/`
 *
 * @see API_GET_CONSULTA_RESPONSABLE
 */
export interface ResponsableGafeteResponse {
    codigo: string;
    mensaje: string;
    datos: ResponsableGafete;
}

/**
 * Modelo para cada una de los atributos regresadas por el API `gafete/responsable/`
 *
 * @see API_GET_CONSULTA_RESPONSABLE
 */
export interface ResponsableGafete {
    gafete: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string
}