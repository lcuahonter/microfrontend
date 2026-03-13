export interface MontoDeInversion {
  PLANTA: string;
  TIPO: string;
  CANTIDAD: string;
  DESCRIPCION: string;
  MONTO: string;
}

export const MONTOS_DE_INVERSION = [
  {
    encabezado: '#Planta',
    clave: (ele: MontoDeInversion): string => ele.PLANTA,
    orden: 1,
  },
  {
    encabezado: 'Tipo',
    clave: (ele: MontoDeInversion): string => ele.TIPO,
    orden: 2,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: MontoDeInversion): string => ele.CANTIDAD,
    orden: 3,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: MontoDeInversion): string => ele.DESCRIPCION,
    orden: 4,
  },
  {
    encabezado: 'Monto',
    clave: (ele: MontoDeInversion): string => ele.MONTO,
    orden: 5,
  },
];
