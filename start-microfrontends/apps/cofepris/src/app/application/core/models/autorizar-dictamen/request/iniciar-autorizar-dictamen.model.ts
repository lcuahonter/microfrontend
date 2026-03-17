/**
 * Modelo para iniciar la autorización del dictamen.
 */
export interface IniciarAutorizarDictamen {
    /**
     * Clave del usuario que inicia la autorización.
     */
    cve_usuario: string;

    /**
     * Identificador de la acción.
     */
    id_accion: string;
}
