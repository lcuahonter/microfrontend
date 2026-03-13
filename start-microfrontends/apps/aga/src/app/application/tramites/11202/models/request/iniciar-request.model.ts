/**
 * Modelo de solicitud para iniciar un trámite.
 * Define la estructura de los datos necesarios para iniciar un trámite en el sistema.
 */
export interface IniciarRequest {
    /**
     * RFC del solicitante que inicia el trámite.
     */
    rfc_solicitante: string;

    /**
     * Rol actual del solicitante en el trámite.
     */
    rol_actual: string;
}
