
export interface TableData {
    /** Encabezados de la tabla, representados como un array de strings. */
    encabezadoDeTabla: string[];
  
    /** Cuerpo de la tabla, representado como un array de filas. */
    cuerpoTabla: TableRow[];
  }



 export interface TableRow {
    /** Datos de la fila, organizados como un array de strings. */
    tbodyData: string[];
  }
  