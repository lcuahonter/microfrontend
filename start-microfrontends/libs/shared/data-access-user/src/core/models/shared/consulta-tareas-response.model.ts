/**
 * Modelo de respuesta para la bitácora de eventos del sistema.
 * Define la estructura de un evento registrado en la bitácora, incluyendo información del usuario y tiempos del evento.
 */
export interface TareasSolicitud {
    /**
     * Identificador único del evento en la bitácora
     */
    id_bitacora: number;

    /**
     * Tipo de evento registrado, por ejemplo: "EVENTO.ASG"
     */
    evento: string;

    /**
     * Identificador del usuario que ejecutó la acción (RFC, CURP u otro identificador)
     */
    id_usuario: string;

    /**
     * Nombre completo del usuario que ejecutó la acción
     */
    nombre_usuario: string;

    /**
     * Tarea o acción realizada dentro del proceso, por ejemplo: "Evaluar Solicitud"
     */
    tarea: string;

    /**
     * Fecha y hora en que inició el evento (formato: yyyy-MM-dd HH:mm:ss)
     */
    fecha_evento_inicio: string;

    /**
     * Fecha y hora en que finalizó el evento (puede ser null si no ha concluido)
     */
    fecha_evento_fin: string | null;
}