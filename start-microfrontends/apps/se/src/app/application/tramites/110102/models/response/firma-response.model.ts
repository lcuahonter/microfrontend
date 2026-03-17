/**
 * Modelo de respuesta de firma response
 */
export interface FirmaResponse {
    /** Numero de folio */
    num_folio_tramite: string;
    /** Id solicitud */
    id_solicitud: number;
    /** Indica si es automática */
    es_automatica: boolean;
}