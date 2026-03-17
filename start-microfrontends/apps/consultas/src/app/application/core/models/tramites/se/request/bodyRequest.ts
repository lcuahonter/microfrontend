/**
 * @interface BodyConsultaTramite
 * @description
 * Representa la estructura del cuerpo de la petición utilizada para consultar
 * información relacionada con un trámite. Contiene los datos del usuario que realiza
 * la consulta, así como los roles que tiene asignados.
 *
 * @property {Array<string>} roles_usuario - Lista de roles asignados al usuario que realiza la consulta.
 * @property {string} user_name - RFC del usuario que requiere la informacion.
 */
export interface BodyConsultaTramite{
   roles_usuario: Array<string>,
   user_name: string,
   folio: string
}