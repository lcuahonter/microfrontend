/**
 * Enum que representa los origenes a través de los que puede ser creada o modificada una solicitud.
 */
export enum OrigenPeticion {
    /** Solicitud seleccionada desde la lista de trámites */
    NUEVA = 'NUEVA_SOLICITUD',
    /** Bandeja de las solicitudes registradas */
    BANDEJA = 'BANDEJA_SOLICITUDES',
    /** Evaluación de la solicitud registrada */
    EVALUAR = 'FLUJO_AUTORIZACION_EVALUAR',
    /** Atención al requerimiento realizado por el agente aduanal */
    ATENDER_REQUERIMIENTO = 'FLUJO_AUTORIZACION_ATENDER_REQUERIMIENTO',
    /** Autorización de la solicitud */
    AUTORIZACION = 'FLUJO_AUTORIZACION_AUTORIZACION',
    /** Consulta de la solicitud */
    CONSULTA_TRAMITE = 'CONSULTA_TRAMITE',
    /** Pre llenado de la solicitud */
    PRE_LLENADO = 'PRELLENADO'
}