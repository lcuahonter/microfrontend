export interface Directos {
  PLANTA: string;
  TOTAL: string;
  DIRECTOS: string;
  CEDULA_DE_CUOTAS: string;
  FECHA_DE_CEDULA: string;
  INDIRECTOS: string;
  CONTRATO: string;
  OBJETO_DEL_CONTRATO_DEL_SERVICIO: string;
  FECHA_FIRMA: string;
  FECHA_FIN_VIGENCIA: string;
  RFC: string;
  RAZON_SOCIAL: string;
}

export const DIRECTOS = [
  {
    encabezado: '#Planta',
    clave: (ele: Directos): string => ele.PLANTA,
    orden: 1,
  },
  {
    encabezado: 'Total',
    clave: (ele: Directos): string => ele.TOTAL,
    orden: 2,
  },
  {
    encabezado: 'Directos',
    clave: (ele: Directos): string => ele.DIRECTOS,
    orden: 3,
  },
  {
    encabezado: 'Cédula de cuotas',
    clave: (ele: Directos): string => ele.CEDULA_DE_CUOTAS,
    orden: 4,
  },
  {
    encabezado: 'Fecha de cédula',
    clave: (ele: Directos): string => ele.FECHA_DE_CEDULA,
    orden: 5,
  },
  {
    encabezado: 'Indirectos',
    clave: (ele: Directos): string => ele.INDIRECTOS,
    orden: 6,
  },
  {
    encabezado: 'Contrato',
    clave: (ele: Directos): string => ele.CONTRATO,
    orden: 7,
  },
  {
    encabezado: 'Objeto del contrato del servicio',
    clave: (ele: Directos): string => ele.OBJETO_DEL_CONTRATO_DEL_SERVICIO,
    orden: 8,
  },
  {
    encabezado: 'Fecha de firma',
    clave: (ele: Directos): string => ele.FECHA_FIRMA,
    orden: 9,
  },
  {
    encabezado: 'Fecha de fin de vigencia',
    clave: (ele: Directos): string => ele.FECHA_FIN_VIGENCIA,
    orden: 10,
  },
  {
    encabezado: 'RFC',
    clave: (ele: Directos): string => ele.RFC,
    orden: 11,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: Directos): string => ele.RAZON_SOCIAL,
    orden: 12,
  },
];

export const FECHA_DE_CEDULA = {
  labelNombre: 'Fecha de cédulas del IMSS',
  required: true,
  habilitado: true,
};
export const FECHA_DE_FIRMA = {
  labelNombre: 'Fecha de firma',
  required: true,
  habilitado: true,
};

export const FECHA_FIN_VIGENCIA = {
  labelNombre: 'Fecha de fin de vigencia',
  required: true,
  habilitado: true,
};

export const CEDULAS_OPTIONS = [
  { "id": 1, "descripcion": "SI" },
  { "id": 2, "descripcion": "NO" }
]
