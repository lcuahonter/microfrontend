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
  
  /**
 * @interface ObraTablaDatos
 * @description
 * Representa la estructura de los datos de una tabla de obras.
 * Incluye un array que almacena las columnas de la tabla.
 */
  export interface ObraTablaDatos {
    /**
   * @property {string[]} columns
   * @description
   * Contiene los nombres de las columnas de la tabla.
   */
    columns: string[];
  }