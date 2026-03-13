/**
 * Modelo de respuesta para estados de los tabs
 */
export interface TabsResponse {
    /** Indica si el módulo de solicitudes está activo */
    solicitudes: boolean | null;
    
    /** Indica si el módulo de documentos está activo */
    documentos: boolean | null;
    
    /** Indica si el módulo de dictámenes está activo */
    dictamenes: boolean | null;
    
    /** Indica si el módulo de requerimientos está activo */
    requerimientos: boolean | null;
    
    /** Indica si el módulo de opiniones está activo */
    opiniones: boolean | null;
    
    /** Indica si el módulo de acuses de resolución está activo */
    acusesResoluciones: boolean | null;
    
    /** Indica si la tarea de trámite está activa */
    tareaTramite: boolean | null;
    
    /** Indica si el envío digital está activo */
    envioDigital: boolean | null;
    
    /** Indica si el estado de transmisión está activo */
    estadoTransmision: boolean | null;
}