/**
 * Modelo de request para creación de requerimientos
 */
export interface MostrarFirmarAutorizarRequerimientoRequest {
        
    /** ID de la acción asociada al requerimiento */
    id_accion: string;

    /** ID de la acción asociada al requerimiento */
    id_requerimiento: number;

    /** Clave del usuario que realiza el requerimiento */
    cve_usuario: string;
    
    /** Información del solicitante */
    usuario_perfil: UsuarioPerfil;
}

/**
 * Modelo con informacion del usuario
 */
export interface UsuarioPerfil {
    /** Nombre del usuario */
    nombre: string;
    /** Apellido materno del usuario */
    apellido_materno: string;
    /** Apellido paterno del usuario */
    apellido_paterno: string;
    /** RFC del usuario */
    rfc: string;
}