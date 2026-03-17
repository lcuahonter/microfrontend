/**
 * Representa un tratado dentro de un listado de selección.
 *
 * @interface ListaTratados
 * 
 * @property {string} value - Valor identificador del tratado, utilizado internamente (por ejemplo, como value en un select).
 * @property {string} label - Texto descriptivo que se muestra al usuario para identificar el tratado.
 */
export interface ListaSelect {
    value: string;
    label: string;
}
