/**
 * @interface AcusesYResolucionesFolioTramite
 * @description
 * Representa los datos relacionados con el acuse y las resoluciones de un trámite.
 * 
 * @property {string} tramite - Folio unico del tramite.
 * @property {string} id_solicitud - Id asociado a la solicitud del tramite.
 * @property {string} fecha_resolucion - Fecha en la que el tramité fue resuelto.
 * @property {string} dependencia - Dependencia asociada a la solicitud.
 * @property {string} tipo_tramite - Descripcion del tipo de tramite.
 * @property {string} acronimo - Acronimo del departamento
 */

export interface AcusesYResolucionesFolioTramite {
    tramite: string,
    id_solicitud: string,
    fecha_resolucion: string,
    dependencia: string,
    tipo_tramite: string,
    acronimo: string
}

/**
 * @interface AcusesYResolucionesResponse
 * @description
 * Representa los datos de respuesta de /acuses-resoluciones.
 *  
 * @property {string} codigo - Codigo de la solicitud.
 * @property {string} mensaje - mensaje de la solicitud.
 * @property {string} datos - array de datos en respuesta.
 */

export interface AcusesYResolucionesResponse {
    codigo: string,
    mensaje: string,
    datos: Array<AcusesYResolucionesFolioTramite>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface body_post_acuses_y_resoluciones {
  rfc_solicitante: string,
  cve_usuario: string,
  rol_actual: string,
  num_folio_tramite: string,
  fecha_inicio: string,
  fecha_fin: string,
  certificado: null 
}
