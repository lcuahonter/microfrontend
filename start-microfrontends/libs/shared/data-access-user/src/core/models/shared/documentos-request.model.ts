/**
 * Class: DocumentosRequest
 * 
 * Description:
 * 
 * Modelo que representa la estructura de una solicitud de documentos para un trámite específico.
 *
 * @author Miguel Arturo Rojas Hernández
 * @email marojash@desarrollo-ultrasist.com.mx
 * 
 * @created 05 de junio 2024
 * @version 1.0
 * @category Modelo de salida
 */

/** Representa la solicitud para obtener documentos asociados a un trámite específico. */
export interface DocumentosRequest {
    tipo_dependencia: string;
    tipo_tramite: string;
    tipo_documento: number;
    parametros: Parametros;
}

/** Parámetros adicionales requeridos para la solicitud de documentos. */
export interface Parametros {
    id_solicitud: number;
}

/** Representa la respuesta al solicitar un documento. */
export interface DocumentoResponse {
    llave_archivo: string;
    nombre_archivo: string;
    contenido: string;
}

/**
 * Representa la respuesta al solicitar la descarga de documentos en las pestañas.
 */
export interface TabDocumentosDescarga{
    /**
     * Contenido del documento en formato string.
     */
    content: string;

    /** 
     * Indica si la descarga fue exitosa. 
     */
    success: boolean;

    /**
     * Mensaje de error en caso de que la descarga falle.
     */
    errorMessage: string;
}
