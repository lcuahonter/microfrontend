/**
 * Representa el modelo de datos de un usuario en el sistema.
 *
 * @property id_persona Identificador único de la persona.
 * @property rfc Registro Federal de Contribuyentes del usuario.
 * @property nombreUsuario Nombre del usuario.
 * @property apellidoPaterno Apellido paterno del usuario.
 * @property apellidoMaterno Apellido materno del usuario.
 * @property perfil Perfil o rol asignado al usuario.
 * @property correoElectronico Correo electrónico del usuario.
 */
export interface ModeloDatos {
    id_persona?: string,
    rfc?: string,
    nombreUsuario?: string,
    apellidoPaterno?: string,
    apellidoMaterno?: string,
    perfil?: string,
    correoElectronico?: string,
}