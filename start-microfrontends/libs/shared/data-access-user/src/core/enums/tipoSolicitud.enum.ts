/**
 * Enumeración que representa los diferentes tipos de solicitud de usuario en el sistema.
 *
 * @enum {string}
 * @property {string} SOLICITANTE - Usuario que realiza una solicitud.
 * @property {string} FUNCIONARIO - Usuario con rol de funcionario.
 * @property {string} ADMIN - Usuario con privilegios de administrador.
 */
export enum TipoSolicitud {
    SOLICITANTE = '1',
    FUNCIONARIO = '2',
    ADMIN = '3'
}