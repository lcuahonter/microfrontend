/**
 * Modelo de solicitud para iniciar el tramite 120301.
 * Este modelo define los campos necesarios para iniciar el tramite.
 */
export interface IniciarRequest {
    /**
     * RFC del solicitante.
     */
    rfc_solicitante: string;

    /**
     * Rol actual del usuario que inicia el tramite.
     */
    rol_actual: string;
}
