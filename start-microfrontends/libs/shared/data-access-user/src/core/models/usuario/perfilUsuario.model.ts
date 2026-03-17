/**
 * Modelo para guardar los datos relacionados al usuario
 */
export interface PerfilUsuario {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombreCompleto: string;
    rfc: string;
    correoElectronico: string;
    tipoPersona: string
}

/**
 * Detalles del resultado del intento de login.
 */
export interface LoginDetalle {
    rfc: string;
    tieneLogin: boolean;
}