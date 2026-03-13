export interface CapturarColumns {
  nombreDenominacionORazonSocial: string;
  rfc: string;
  curp: string;
  telefono: number;
  correoElectronico: string,
  calle: string;
  numeroExterior: number;
  numeroInterior: number;
  pais: string;
  colonia: string;
  municipioOAlcaldia: string;
  localidad: string;
  entidadFederativa: string;
  estadoLocalidad: string;
  codigoPostal: string;
  coloniaOEquivalente: string;
}

export const FABRICANTE_TABLE_COLUMNS =
  [
    {
      encabezado: 'Nombre/denominación o razón social',
      clave: (fila: CapturarColumns): string => fila.nombreDenominacionORazonSocial,
      orden: 1,
    },
    {
      encabezado: 'R.F.C.',
      clave: (fila: CapturarColumns): string => fila.rfc,
      orden: 2,
    },
    {
      encabezado: 'CURP',
      clave: (fila: CapturarColumns): string => fila.curp,
      orden: 3,
    },
    {
      encabezado: 'Teléfono',
      clave: (fila: CapturarColumns): number => fila.telefono,
      orden: 4,
    },
    {
      encabezado: 'Correo electrónico',
      clave: (fila: CapturarColumns): string => fila.correoElectronico,
      orden: 5,
    },
    {
      encabezado: 'Calle',
      clave: (fila: CapturarColumns): string => fila.calle,
      orden: 6,
    },
    {
      encabezado: 'Número exterior',
      clave: (fila: CapturarColumns): number => fila.numeroExterior,
      orden: 7,
    },
    {
      encabezado: 'Número interior',
      clave: (fila: CapturarColumns): number => fila.numeroInterior,
      orden: 8,
    },
    {
      encabezado: 'País',
      clave: (fila: CapturarColumns): string => fila.pais,
      orden: 9,
    },
    {
      encabezado: 'Colonia',
      clave: (fila: CapturarColumns): string => fila.colonia,
      orden: 10,
    },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (fila: CapturarColumns): string => fila.municipioOAlcaldia,
      orden: 11,
    },
    {
      encabezado: 'Localidad',
      clave: (fila: CapturarColumns): string => fila.localidad,
      orden: 12,
    },
    {
      encabezado: 'Entidad federativa',
      clave: (fila: CapturarColumns): string => fila.entidadFederativa,
      orden: 13,
    },
    {
      encabezado: 'Estado/localidad',
      clave: (fila: CapturarColumns): string => fila.estadoLocalidad,
      orden: 14,
    },
    {
      encabezado: 'Código postal',
      clave: (fila: CapturarColumns): string => fila.codigoPostal,
      orden: 15,
    },
    {
      encabezado: 'Colonia o equivalente',
      clave: (fila: CapturarColumns): string => fila.coloniaOEquivalente,
      orden: 16,
    },
  ];