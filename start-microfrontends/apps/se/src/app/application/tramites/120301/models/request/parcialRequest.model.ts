/**
 * Modelo de solicitud para el tramite 120301.
 * Interfaz que representa un guardado parcial de la solicitud
 */
export interface ParcialRequest {
    /** ID de la solicitud (puede ser nulo) */
    id_solicitud: number | null;
    
    /** ID de la asignación relacionada */
    id_asignacion: number | null;
    
    /** Bandera booleana genérica */
    boolean_generico: boolean | null;
    
    /** Identificador genérico 1 (ej. "Nacional") */
    ide_generica_1: string | null;
    
    /** Descripción genérica adicional */
    descripcion_generica_2: string | null;
    
    /** Identificador genérico 2 */
    ide_generica_2: string | null;
    
    /** Información del solicitante */
    solicitante: {
        /** RFC del solicitante */
        rfc: string;
        
        /** Número de serie del certificado */
        certificado_serial_number: string;
    };
    
    /** Clave de la unidad administrativa */
    cve_unidad_administrativa: string;
    
    /** ID de expedición (puede ser nulo) */
    id_expedicion: number | null;
}