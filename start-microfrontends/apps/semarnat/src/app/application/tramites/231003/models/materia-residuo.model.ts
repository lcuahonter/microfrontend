/**
 * Modelo que representa una materia prima o residuo.
 */

export interface MateriaResiduo {
  /** ID único de la materia prima o residuo */
  id_mercancia: number;
  /** ID de la solicitud asociada (opcional) */
  id_solicitud?: number;
  /** Descripción o nombre de la materia prima o residuo */
  descripcion_mercancia: string;
  /** Unidad de medida comercial (opcional) */
  umc?: string;
  /** Descripción de la unidad de medida comercial */
  descripcion_umc: string;
  /** Cantidad en letra */
  cantidad_letra: string;
  /** Número de partida de la mercancía (opcional) */
  num_partida_mercancia?: string;
  /** Clave de la fracción arancelaria */
  cve_fraccion_arancelaria: string;
  /** Cantidad en número */
  cantidad: string;

  /** Número de bitácora */
  no_bitacora: string;
}

/** Configuración de columnas para la tabla dinámica */
export const MATERIA_RESIDUO_TABLA = [
  {
    encabezado: 'Id materia prima',
    clave: (item: MateriaResiduo): number => item.id_mercancia,
    orden: 1,
  },
  {
    encabezado: 'Nombre materia prima',
    clave: (item: MateriaResiduo): string => item.descripcion_mercancia,
    orden: 2,
  },
  {
    encabezado: 'Cantidad',
    clave: (item: MateriaResiduo): string => item.cantidad,
    orden: 3,
  },
  {
    encabezado: 'Cantidad letra',
    clave: (item: MateriaResiduo): string => item.cantidad_letra,
    orden: 4,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (item: MateriaResiduo): string => item.descripcion_umc,
    orden: 5,
  },
  {
    encabezado: 'Fracción',
    clave: (item: MateriaResiduo): string => item.cve_fraccion_arancelaria,
    orden: 6,
  },
];
