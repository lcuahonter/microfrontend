/**
 * Modelo de request para validar solicitud
 */
export interface ValidarRequest {
/** RFC del solicitante */
    rfc: string | null;
    
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** ID de la solicitud del productor */
    id_solicitud_productor: number | null;
    
    /** Clave de la entidad */
    clave_entidad: string | null;
    
    /** Clave de la entidad solicitante */
    clave_entidad_solicitante: string | null;
    
    /** Clave de la unidad administrativa */
    clave_unidad_admin: string | null;
    
    /** Tratados aplicables */
    tratados: string[];
    
    /** Registro del cuestionario */
    registro_cuestionario: RegistroCuestionarioProductor;
}

/**
 * Modelo para registro de cuestionario del productor
 */
export interface RegistroCuestionarioProductor {
    /** Separación contable */
    separacion_contable: boolean;
    
    /** Solicita exportador autorizado */
    solicita_exportador_autorizado: boolean;
    
    /** ID condición exportador autorizado */
    ide_condicion_exportador_autorizado: string | null;
    
    /** Solicita exportador autorizado Japón */
    solicita_exportador_autorizado_jpn: boolean;
    
    /** ID condición exportador autorizado Japón */
    ide_condicion_exportador_autorizado_jpn: string | null;
}