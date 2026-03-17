export interface PermisoModel {
  Nombre: string;
  RFC: string;
  CURP: string;
  Teléfono: number;
  CorreoElectrónico: string;
  calle: string;
}

/**
 * Modelo de datos para una fila de una tabla.
 * Representa los datos que se mostrarán en la tabla.
 */
export interface TablaDatos {
  /**
   * Datos de la fila representados por un arreglo de cadenas.
   *
   * @property {string[]} tbodyData - Datos de la fila que se mostrarán en la tabla.
   */
  tbodyData: string[];
}