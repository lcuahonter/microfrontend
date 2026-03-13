/**
 * Modelo de solicitud para el tramite 120301.
 * Este modelo define los campos necesarios para realizar una solicitud de TPL.
 */
export interface TplRequest {
    /**
     * RFC del solicitante.
     */
    rfc: string;
    /**
     * Rol actual del usuario que realiza la solicitud.
     */
    tipo_busqueda: string;
    /**
     * Número de constancia.
     */
    num_folio_asignacion_tpl?: string;
    /**
     * Año de la solicitud.
     */
    anio?: string;
}
