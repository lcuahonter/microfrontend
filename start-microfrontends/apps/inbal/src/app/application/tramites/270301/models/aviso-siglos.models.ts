/**
 * @interface TablaDatos
 * @description
 * Representa la estructura de los datos de una tabla. 
 * Incluye un array que almacena las filas del cuerpo de la tabla (`tbody`).
 */
export interface TablaDatos {
    /**
     * @property {string[]} tbodyData
     * @description
     * Contiene los datos de las filas del cuerpo de la tabla.
     */
    tbodyData: string[];
  }
  