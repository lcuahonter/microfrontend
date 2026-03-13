/**
 * Interface que define el modelo de un Capítulo.
 */
export interface Capitulo {
  id: string;
  clave: string;
  descripcion: string;
  children?: Capitulo[];
  expanded?: boolean;
  loading?: boolean;
  level?: number;
}
