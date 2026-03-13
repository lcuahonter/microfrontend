/**
 * Modelo de respuesta para iniciar el trámite 120301.
 * Este modelo define los campos que se reciben al iniciar el trámite.
 */
export interface IniciarResponse {
    /**
     * RFC del solicitante.
     */
    roles_capturista_gubernamental: string;
    /**
     * Rol actual del usuario que inicia el trámite.
     */
    tiene_prellenado: boolean;
}
