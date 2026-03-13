/**
 * Interfaz que define la estructura de un tratado
 */
export interface Tratado {
  clave: string;
  descripcion: string;
}

/**
 * Interfaz que define la estructura de un país
 */
export interface Pais {
  clave: string;
  descripcion: string;
}

/**
 * Interfaz que define la estructura de una norma o resolución
 */
export interface NormaResolucion {
  id?: number;
  criterio: string;
  norma: string;
  calificacion: string;
  primerParrafo?: string;
  segundoParrafo?: string;
  tercerParrafo?: string;
  cuartoParrafo?: string;
  exportadorAutorizado?: boolean;
  parrafoExportadorAutorizado?: string;
  asunto?: string;
  activo?: boolean;
}
