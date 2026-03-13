/**
 * Modelo de solicitud para la cadena original.
 * Define la estructura de los datos necesarios para la cadena original en el trámite.
 */
export interface CadenaOriginalRequest {
    boolean_extranjero: boolean;
    solicitante: Solicitante;
    cve_rol_capturista: string;
    cve_usuario_capturista: string;
    fecha_firma: string;
   
}


/**
 * Modelo que representa un solicitante en el trámite.
 * Contiene información sobre el RFC, nombre y si es persona moral.
 */
export interface Solicitante {
    rfc: string;
    nombre: string;
    es_persona_moral: boolean;
    certificado_serial_number: string;
}
