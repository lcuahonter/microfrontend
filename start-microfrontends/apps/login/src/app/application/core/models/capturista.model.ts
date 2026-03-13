/**
 * Modelo que representa a un capturista.
 * Contiene los datos personales básicos del capturista.
 */
export interface Capturista {
    /** Identificador único del capturista */
    idCapturista: number;
    /** Nombre del capturista */
    nombre: string;
    /** Apellido paterno del capturista */
    apellidoPaterno: string;
    /** Apellido materno del capturista */
    apellidoMaterno: string;
    /** RFC del capturista */
    rfc: string;
    /** CURP del capturista */
    curp?: string;
}