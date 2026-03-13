/**
 * Representa el cuerpo (body) de la solicitud para la búsqueda o filtrado
 * de trámites del módulo terrestre.
 *
 * @interface BodyTerrestre
 *
 * @property {string} rfc - Registro Federal de Contribuyentes asociado al trámite.
 * @property {string} denominacion - Denominación o razón social relacionada con el trámite.
 * @property {string} denominacion_extra - Denominación complementaria utilizada para criterios adicionales de búsqueda.
 * @property {string} folio_busqueda_caat - Folio de la solicitud CAAT asociado al trámite.
 */
export interface MaritimoBody {
    rfc: string,
    denominacion: string,
    denominacion_extra: string,
    folio_busqueda_caat: string
}