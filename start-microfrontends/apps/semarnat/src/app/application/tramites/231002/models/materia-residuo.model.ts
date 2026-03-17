/**
 * Modelo que representa una materia prima o residuo.
 */

export interface MateriaResiduo {
  id_mercancia: number;
  descripcion_mercancia: string;
  cantidad: string;
  cantidad_letra: string;
  descripcion_umc: string;
  cve_fraccion_arancelaria: string;
  numeroBitacora: string;
  unidadMedidaComercial: string;
  descFraccion: string;
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
