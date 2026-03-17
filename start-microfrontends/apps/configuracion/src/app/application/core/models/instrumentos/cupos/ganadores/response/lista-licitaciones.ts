/**
 * Representa una licitación dentro de un listado de selección.
 *
 * @interface ListaLicitaciones
 * 
 * @property {string} value - Valor identificador de la licitación, utilizado internamente (por ejemplo, como value en un select).
 * @property {string} label - Texto descriptivo que se muestra al usuario para identificar la licitación.
 */
export interface ListaLicitaciones {
    value: string,
    label: string
}