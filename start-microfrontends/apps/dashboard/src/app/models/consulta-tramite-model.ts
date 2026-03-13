/**
 * @interface TareasActivas
 * @description
 * Representa una tarea actualmente activa dentro del flujo del trámite.
 *
 * @property {string} action_name - Nombre o descripción de la acción o tarea pendiente.
 * @property {string} current_user - Usuario responsable o asignado a la tarea activa.
 * @property {string} fecha_inicio_tarea - Fecha en la que la tarea inició su proceso.
 */
export interface TareasActivas{
    action_name : string,
    current_user: string,
    fecha_inicio_tarea: string
}
/**
 * @interface ConsultaTramite
 * @description
 * Contiene la información general del trámite consultado, incluyendo su tipo,
 * folio, solicitud asociada, tiempo transcurrido y las tareas activas (si existen).
 *
 * @property {string} num_folio_tramite - Folio único asignado al trámite.
 * @property {number} id_tipo_tramite - Identificador numérico del tipo de trámite.
 * @property {string} id_solicitud - Identificador de la solicitud vinculada al trámite.
 * @property {string} acronimo - Acrónimo de la dependencia o área asociada.
 * @property {string} tipo_solicitud - Descripción del tipo de solicitud.
 * @property {number} dias_habiles_transcurridos - Número de días hábiles transcurridos desde el inicio del trámite.
 * @property {Array<TareasActivas> | null} tareas_activas - Lista de tareas activas asociadas al trámite, o `null` si no existen tareas pendientes.
 */
export interface ConsultaTramite {
    num_folio_tramite: string,
    id_tipo_tramite: number,
    id_solicitud : string,
    acronimo: string
    tipo_solicitud: string,
    dias_habiles_transcurridos: number,
    tareas_activas: null | Array<TareasActivas>
}
/**
 * @interface ConsultaTramiteresponse
 * @description
 * Estructura base de la respuesta del servicio de consulta de trámite.
 * Incluye código de operación, mensaje informativo y el listado de trámites obtenidos.
 *
 * @property {string} codigo - Código de respuesta del servicio.
 * @property {string} mensaje - Mensaje descriptivo del resultado de la operación.
 * @property {Array<ConsultaTramite>} datos - Arreglo con la información detallada de los trámites consultados.
 */
export interface ConsultaTramiteresponse {
    codigo: string,
    mensaje: string,
    causa: string,
    datos: ConsultaTramite
}
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
export interface BodyConsultaTramite {
   roles_usuario: Array<string>,
   user_name: string,
   folio: string
}