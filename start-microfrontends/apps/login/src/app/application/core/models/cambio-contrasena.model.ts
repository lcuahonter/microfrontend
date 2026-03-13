/**
 * Modelo para el cambio de contraseña de un usuario.
 */
export interface CambioContrasena {
   /** Contraseña anterior del usuario. */
    contrasenaAnterior: string;
    /** Nueva contraseña del usuario. */
    contrasenaNueva: string;
    /** Confirmación de la nueva contraseña. */
    confirmacionContrasena: string;
}