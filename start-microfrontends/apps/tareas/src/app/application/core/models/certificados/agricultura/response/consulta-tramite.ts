/**
 * Representa la información de un trámite agrícola obtenida a partir de una consulta.
 *
 * @interface ConsultaTramiteAgricultura
 * 
 * @property {string} tipo_tramite - Tipo de trámite agrícola consultado.
 * @property {string} folio_tramite - Número de folio asignado al trámite.
 * @property {string} estatus_tramite - Estado actual del trámite.
 * @property {string} num_certificado - Número de certificado asociado al trámite.
 * @property {string} fecha_resolucion - Fecha en la que se emitió la resolución del trámite.
 * @property {string} sentido_resolucion - Resultado o sentido de la resolución emitida.
 */
export interface ConsultaTramiteAgricultura {
    tipo_tramite: string;
    folio_tramite: string;
    estatus_tramite: string;
    num_certificado: string;
    fecha_resolucion: string;
    sentido_resolucion: string;
}

/**
 * Representa la respuesta del servicio de consulta de trámites agrícolas.
 *
 * @interface ConsultaTramiteAgriculturaResponse
 * 
 * @property {string} error - Mensaje de error devuelto por el servicio, vacío o null en caso de éxito.
 * @property {ConsultaTramiteAgricultura[]} data - Lista de trámites agrícolas obtenidos en la consulta.
 */
export interface ConsultaTramiteAgriculturaResponse {
    error: string;
    data: ConsultaTramiteAgricultura[];
}
