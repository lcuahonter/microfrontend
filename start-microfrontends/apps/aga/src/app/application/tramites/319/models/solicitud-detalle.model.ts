/**
 * Respuesta con los detalles de una solicitud para el trámite 319.
 */
export interface SolicitudResponseDetalle319 {
    /** Identificador único de la solicitud. */
    id_solicitud: number;
    /** RFC del solicitante. */
    rfc_solicitante: string;
    /** Operación solicitada. */
    operacion: string;
    /** Lista de periodos asociados a la solicitud. */
    periodos: PeriodoSolicitud[];
}

/**
 * Representa un periodo asociado a una solicitud.
 */
export interface PeriodoSolicitud {
    /** Identificador único del periodo de solicitud. */
    id_periodo_solicitud: number;
    /** Identificador de la solicitud a la que pertenece este periodo. */
    id_solicitud: number;
    /** Código o nombre del periodo (por ejemplo, "2025-01"). */
    periodo: string;
    /** Descripción del periodo, o `null` si no aplica. */
    periodo_desc: string | null;
    /** Fecha de inicio del periodo en formato ISO. */
    periodo_inicio: string;
    /** Fecha de fin del periodo en formato ISO. */
    periodo_fin: string;
    /** Fecha específica asociada al periodo, o `null` si no aplica. */
    fecha_periodo: string | null;
}
