/**
 * Representa la respuesta de una opinión asociada a un trámite
 */
export interface OpinionResponse {
    /** Fecha de solicitud de la opinión en formato string */
    fecha_solicitud: string;
    
    /** Identificador único de la opinión */
    id_opinion: number;
    
    /** Identificador del estado de la opinión */
    ide_est_opinion: string;
    
    /** Descripción del estado actual de la opinión */
    estado_opinion: string;
    
    /** Nombre del área que solicitó la opinión */
    area_solicitante: string;
    
    /** Nombre del área responsable de emitir la opinión */
    area_responsable: string;
}