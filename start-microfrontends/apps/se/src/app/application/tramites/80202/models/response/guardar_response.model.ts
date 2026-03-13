/**
 * Modelo de respuesta para guardar una solicitud de trámite.
 * Define la estructura de los datos devueltos al guardar una solicitud en el sistema.
 */
export interface GuadarSolicitudResponse {
    /**
     * Identificador único de la solicitud guardada.
     */
    id_solicitud: number;
 
    /**
     * Código de régimen asociado a la solicitud.
     */
    fecha_creacion: Date;
}
 