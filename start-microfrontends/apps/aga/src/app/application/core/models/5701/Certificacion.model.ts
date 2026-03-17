/**
 * Representa la respuesta de una petición a la API
 * para validar si existen certificaciones Programa Fomento e IMMEX.
 * 
 * @interface CertificacionResponse
 * 
 * @property {string} codigo - Código que indica el estado o resultado de la operación.
 * @property {string} mensaje - Mensaje descriptivo asociado al código de respuesta.
 * @property {Certificacion} datos - Objeto que contiene los datos específicos de la certificación.
 */
export interface CertificacionResponse {
    codigo: string;
    mensaje: string;
    datos: Certificacion;
}

/**
 * Representa la estructura de una certificación aduanal.
 * 
 * @interface Certificacion
 * 
 * @property {string} patente - Número de patente aduanal asociada.
 * @property {number} id_patentes_aduanales - Identificador único de las patentes aduanales.
 * @property {string} rfc_solicitante - Registro Federal de Contribuyentes (RFC) del solicitante.
 * @property {string} tipo_patente - Tipo de patente aduanal.
 */
export interface Certificacion {
    programa_fomento: boolean,
    immex: boolean,
    desc_programa_fomento: string,
    desc_immex: string;
}