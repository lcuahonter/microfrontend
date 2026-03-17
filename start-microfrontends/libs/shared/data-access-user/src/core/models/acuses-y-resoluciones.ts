/**
 * Representa la información relacionada con los acuses y resoluciones de un trámite.
 *
 * @interface AcusesYResoluciones
 * 
 * @property {string} folio - Número de folio asignado al trámite o solicitud.
 * @property {string} fechaInicial - Fecha de inicio del trámite en formato específico.
 * @property {string} fechaFinal - Fecha de finalización del trámite, si aplica.
 * @property {string} dependencia - Nombre de la dependencia responsable del trámite.
 * @property {string} unidadAdministrativaORepresentacionFederal - Unidad administrativa o representación federal asociada.
 * @property {string} tipoDeSolicitud - Tipo de solicitud correspondiente al trámite.
 * @property {string} estatusDeLaSolicitud - Estado actual de la solicitud (por ejemplo: "EN PROCESO", "FINALIZADO").
 * @property {string} diasHabilesTranscurridos - Número de días hábiles transcurridos desde el inicio del trámite.
 */
export interface AcusesYResoluciones {
    folio: string;
    fechaInicial: string;
    fechaFinal: string;
    dependencia: string;
    unidadAdministrativaORepresentacionFederal: string;
    tipoDeSolicitud: string;
    estatusDeLaSolicitud: string;
    diasHabilesTranscurridos: string;
}
/**
 * Representa la respuesta del servicio que obtiene la información
 * de acuses y resoluciones asociados a un trámite.
 *
 * @interface AcusesYResolucionesResponse
 * 
 * @property {string} codigo - Código del resultado de la operación (por ejemplo, "00" para éxito).
 * @property {string} mensaje - Mensaje descriptivo de la operación ejecutada.
 * @property {Array<AcusesYResoluciones>} datos - Lista de elementos que contienen la información de acuses y resoluciones.
 */
export interface AcusesYResolucionesResponse {
    codigo: string;
    mensaje: string;
    datos: Array<AcusesYResoluciones>;
}
