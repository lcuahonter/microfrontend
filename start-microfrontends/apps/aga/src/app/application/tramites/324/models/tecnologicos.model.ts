/**
 * Interfaz que representa los datos de un acceso en la tabla de accesos.
 */
export interface AccesosTabla {
    /**
     * Registro Federal de Contribuyentes (RFC) del usuario.
     */
    rfc: string;
  
    /**
     * Nombre del sistema al que el usuario tiene acceso.
     */
    sistema: string;
  
    /**
     * Rol o perfil asignado al usuario dentro del sistema.
     */
    rol: string;
  
    /**
     * Tipo de movimiento relacionado con el acceso (e.g., alta, baja, modificación).
     */
    tipoMovimiento: string;
  
    /**
     * Aduana asociada al acceso del usuario.
     */
    aduana: string;
  }