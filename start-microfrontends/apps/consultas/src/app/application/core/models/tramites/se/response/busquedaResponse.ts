/**
 * Representa la información de un trámite obtenida a partir de una búsqueda.
 *
 * @interface BusquedaTramite
 * 
 * @property {string} tipo_tramite - Tipo de trámite consultado.
 * @property {string} folio_tramite - Número de folio del trámite.
 * @property {string} estatus_tramite - Estado actual del trámite.
 * @property {string} no_resolucion_programa - Número de resolución del programa asociado al trámite.
 * @property {string} fecha_resolucion - Fecha en la que se emitió la resolución del trámite.
 * @property {string} sentido_resolucion - Resultado o sentido de la resolución emitida.
 */
export interface BusquedaTramite {
    tipo_tramite: string;
    folio_tramite: string;
    estatus_tramite: string;
    no_resolucion_programa: string;
    fecha_resolucion: string;
    sentido_resolucion: string;
}

/**
 * Representa la respuesta del servicio de búsqueda de trámites.
 *
 * @interface BusquedaTramiteResponse
 * 
 * @property {string} codigo - Código de resultado de la operación (por ejemplo: "00" para éxito).
 * @property {BusquedaTramite[]} data - Lista de trámites obtenidos como resultado de la búsqueda.
 */
export interface BusquedaTramiteResponse {
    codigo: string;
    data: BusquedaTramite[];
}