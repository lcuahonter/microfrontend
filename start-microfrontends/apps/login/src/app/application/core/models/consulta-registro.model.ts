/**
 * Modelo para la consulta de registro de un usuario.
 * Contiene los datos personales básicos requeridos para la búsqueda o consulta.
 */
export interface ConsultaRegistro {
    /** idUsuario(s) del usuario */
    idUsuario: number;
    /** Nombre(s) del usuario */
    nombre: string;
    /** Apellido paterno del usuario */
    apellidoPaterno: string;
    /** Apellido materno del usuario */
    apellidoMaterno: string;
    /** RFC del usuario */
    rfc: string;
      /** CURP del usuario */
    curp?: string
}