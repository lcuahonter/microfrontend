/** MostrarFirmaRequest */
export interface MostrarFirmaRequest {
  /** ID de la acción a realizar */
  id_accion: string;
  /** ID del dictamen a firmar */
  id_dictamen: number;
  /** Clave del usuario que firma */
  cve_usuario: string;
  /** Datos del perfil del usuario */
  usuario_perfil: UsuarioPerfil;
  /**
   * ID del sentido del dictamen.
   */
  ide_sentido_dictamen: string;
  /*
   * justificacion del dictamen
   */
  justificacion_dictamen: string;
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
