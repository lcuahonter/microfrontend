/** MostrarFirmaRequest */
export interface AutorizarMostrarFirmaRequest {
    /** ID de la acción a realizar */
    id_accion: string;
    /** ID del requerimiento a firmar */
    id_requerimiento: number;
    /** Clave del usuario que firma */
    cve_usuario: string;
    /** Datos del perfil del usuario */
    usuario_perfil: UsuarioPerfil;
}

/** UsuarioPerfil */
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