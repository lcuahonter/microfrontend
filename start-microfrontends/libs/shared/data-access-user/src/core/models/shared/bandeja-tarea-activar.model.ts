/**
 * Modelo de request para activar tarea
 */
export interface ActivarTareaRequest {
    /** ID de la acción a realizar */
    action_id: string;
    
    /** Folio del trámite */
    folio_tramite: string;
    
    /** ID de la tarea */
    id_tarea: string;
    
    /** Nombre de usuario */
    user_name: string;
    
    /** RFC del solicitante */
    rfc_solicitante: string;
    
    /** Rol actual del usuario */
    rol_actual: string;
}