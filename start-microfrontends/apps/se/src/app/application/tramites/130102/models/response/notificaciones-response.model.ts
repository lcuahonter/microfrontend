
/**
 * Interfaz que representa la respuesta al iniciar una notificación.
 */
export interface IniciarNotificacionResponse {
    codigo: string;
    error? : string;
    causa?: string;
    mensaje: string;
}
