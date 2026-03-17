export interface CapacidadInstalada {
  PLANTA: string;
  FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: string;
  UMT: string;
  DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: string;
  TURNOS: string;
  HORAS_POR_TURNO: string;
  CANTIDAD_EMPLEADOS: string;
  CANTIDAD_MAQUINARIA: string;
  DESCRIPCION_MAQUINARIA: string;
  CAPACIDAD_INSTALADA_MENSUAL: string;
  CAPACIDAD_INSTALADA_ANUAL: string;
  CAPACIDAD_EFECTIVAMENTE_UTILIZADA: string;
  CALCULO_CAPACIDAD_INSTALADA: string;
}

export const CAPACIDAD_INSTALADA = [
  {
    encabezado: 'Planta',
    clave: (ele: CapacidadInstalada): string => ele.PLANTA,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria de producto',
    clave: (ele: CapacidadInstalada): string =>
      ele.FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO,
    orden: 2,
  },
  {
    encabezado: 'UMT',
    clave: (ele: CapacidadInstalada): string => ele.UMT,
    orden: 3,
  },
  {
    encabezado: 'Descripción comercial del producto terminado',
    clave: (ele: CapacidadInstalada): string =>
      ele.DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO,
    orden: 4,
  },
  {
    encabezado: 'Turnos',
    clave: (ele: CapacidadInstalada): string => ele.TURNOS,
    orden: 5,
  },
  {
    encabezado: 'Horas por turno',
    clave: (ele: CapacidadInstalada): string => ele.HORAS_POR_TURNO,
    orden: 6,
  },
  {
    encabezado: 'Cantidad empleados',
    clave: (ele: CapacidadInstalada): string => ele.CANTIDAD_EMPLEADOS,
    orden: 7,
  },
  {
    encabezado: 'Cantidad maquinaria',
    clave: (ele: CapacidadInstalada): string => ele.CANTIDAD_MAQUINARIA,
    orden: 8,
  },
  {
    encabezado: 'Descripción de la maquinaria',
    clave: (ele: CapacidadInstalada): string => ele.DESCRIPCION_MAQUINARIA,
    orden: 9,
  },
  {
    encabezado: 'Capacidad instalada mensual',
    clave: (ele: CapacidadInstalada): string => ele.CAPACIDAD_INSTALADA_MENSUAL,
    orden: 10,
  },
  {
    encabezado: 'Capacidad instalada anual',
    clave: (ele: CapacidadInstalada): string => ele.CAPACIDAD_INSTALADA_ANUAL,
    orden: 11,
  },
  {
    encabezado: 'Capacidad efectivamente utilizada (porcentaje)',
    clave: (ele: CapacidadInstalada): string =>
      ele.CAPACIDAD_EFECTIVAMENTE_UTILIZADA,
    orden: 12,
  },
  {
    encabezado: 'Cálculo capacidad instalada',
    clave: (ele: CapacidadInstalada): string => ele.CALCULO_CAPACIDAD_INSTALADA,
    orden: 13,
  },
];
