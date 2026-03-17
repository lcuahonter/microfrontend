/**
 * Representa la información de un ganador dentro del proceso de adjudicación.
 *
 * @interface ListaGanadores
 * 
 * @property {string} rfc - Registro Federal de Contribuyentes del ganador.
 * @property {string} empresa - Nombre de la empresa o razón social del ganador.
 * @property {number} monto_adjudicado - Monto económico adjudicado al ganador.
 */
export interface ListaGanadores {
    rfc: string
    empresa: string
    monto_adjudicado: number
}

/**
 * Contiene el conjunto de ganadores y el total de registros obtenidos.
 *
 * @interface DatosGanadores
 * 
 * @property {ListaGanadores[]} datos - Lista de ganadores obtenidos.
 * @property {number} total - Número total de ganadores registrados.
 */
export interface DatosGanadores {
    datos: ListaGanadores[]
    total: number
}

/**
 * Representa la respuesta del servicio que obtiene la información de los ganadores.
 *
 * @interface DatosGanadoresResponse
 * 
 * @property {string} error - Mensaje de error devuelto por el servicio, vacío o null en caso de éxito.
 * @property {DatosGanadores} datos - Contiene la información de los ganadores y el total de registros.
 */
export interface DatosGanadoresResponse {
    error: string
    datos: DatosGanadores
}