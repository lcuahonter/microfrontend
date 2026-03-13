/**
 * Representa una lista de catálogo que contiene un conjunto de datos de tipo `Catalogo`.
 */
export interface CatalogoLista {
    datos: Catalogo[];
  }
/**
 * Representa un elemento de un catálogo.
 */
export interface Catalogo {
    id: number;
    descripcion: string;
  }